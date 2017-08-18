/*
	© 2017 LN Curtis
	Custom extension logic for Cart.Confirmation.View.Extension
*/

define(
	'Cart.Detailed.View.Extension'
,	[
		'Cart.Detailed.View'
    ,   'Backbone.CompositeView'
    ,   'Backbone.FormView'
    ,   'Cart.Summary.View'
		
	,	'GlobalViews.Message.View'
	,	'underscore'
	]
,	function(
        CartDetailedView

    ,   BackboneCompositeView
    ,   BackboneFormView
    ,   CartSummaryView
    ,   GlobalViewsMessageView

	, 	_
	)
{
	'use strict';
	
	_.extend( CartDetailedView.prototype, {

        attributes: {
            'id': 'shopping-cart'
        }

    ,   events : _.extend( CartDetailedView.prototype.events, {
            'click [data-action="print-page"]': 'triggerPrint'
        })

    ,	initialize: function (options)
        {
            this.application = options.application;
            this.showEstimated = false;

            BackboneCompositeView.add(this);
            BackboneFormView.add(this);

            this.model.on('change', this.render, this);
            this.model.get('lines').on('add remove', this.render, this);
            this.model.on('LINE_ROLLBACK', this.render, this);

            this.on('afterCompositeViewRender', this.resetColapsiblesState, this);
            this.on('afterCompositeViewRender', this.initPlugins, this);

            this.options = options;

            /*custom code follows*/
            this.cartSummary = new CartSummaryView({
                model: this.model
                ,	showEstimated: this.showEstimated
                ,	application: this.application
            });

            var self = this;
            this.model.on('promocodeUpdated', this.showContent, this);
            this.model.on('itemAddedFromRelated', function() {
                self.showContent();

                jQuery(document).scrollTop(0);
            }, this);

            this.windowWidth = jQuery(window).width();

            var windowResizeHandler = _.throttle(function ()
            {
                if (_.getDeviceType(self.windowWidth) === _.getDeviceType(jQuery(window).width()))
                {
                    return;
                }

                if(Backbone.history.getFragment() === "cart") {
                    self.showContent();
                }

                _.resetViewportWidth();

                self.windowWidth = jQuery(window).width();

            }, 1000);

            this._windowResizeHandler = _.bind(windowResizeHandler, this);

            jQuery(window).on('resize', this._windowResizeHandler);

        }

    ,	initSlider: function()
        {
            var element = this.$el.find('[data-type="carousel-items"]');
            this.$slider = _.initBxSlider(element, Configuration.bxSliderDefaults);
        }

    ,   triggerPrint: function (e)
        {
            window.print();
        }

    ,	showContent: function ()
        {
            var self = this;
            return this.application.getLayout().showContent(this, true).done(function()
            {
                self.initPlugins();
            });
        }

    ,	showError: function (message, line, error_details)
        {
            var placeholder;

            this.hideError();

            if (line)
            {
                // if we detect its a rolled back item, (this i an item that was deleted
                // but the new options were not valid and was added back to it original state)
                // We will move all the references to the new line id
                if (error_details && error_details.status === 'LINE_ROLLBACK')
                {
                    var new_line_id = error_details.newLineId;

                    line.attr('id', new_line_id);

                    line.find('[name="internalid"]').attr({
                        id: 'update-internalid-' + new_line_id
                        ,	value: new_line_id
                    });
                }

                placeholder = line.find('[data-type="alert-placeholder"]');
                this.hideError(line);
            }
            else
            {
                placeholder = this.$('[data-type="alert-placeholder-main"]');
                this.hideError();
            }

            // Finds or create the placeholder for the error message
            if (!placeholder.length)
            {
                placeholder = jQuery('<div/>', {'data-type': 'alert-placeholder'});
                this.$el.prepend(placeholder);
            }

            var global_view_message = new GlobalViewsMessageView({
                message: message
                ,	type: 'error'
                ,	closable: true
            });

            // Renders the error message and into the placeholder
            placeholder.append(global_view_message.render().$el.html());

            jQuery(document).scrollTop(placeholder.offset().top - 20);

            // Re Enables all posible disableded buttons of the line or the entire view
            if (line)
            {
                line.find(':disabled').attr('disabled', false);
            }
            else
            {
                this.$(':disabled').attr('disabled', false);
            }
        }

    ,   updateItemQuantity:  function(e)
        {
            var self = this
                ,	$line = null
                ,	$form = this.$(e.target).closest('form')
                ,	options = $form.serializeObject()
                ,	internalid = options.internalid
                ,	line = this.model.get('lines').get(internalid)
                ,	$input = $form.find('[name="quantity"]')
                ,	validInput = this.validInputValue($input[0]);

            if (!line || this.isRemoving)
            {
                return;
            }

            if (!validInput || options.quantity)
            {
                var	new_quantity = parseInt(options.quantity, 10)
                    ,	item = line.get('item')
                    ,	min_quantity = item ? item.get('_minimumQuantity', true) : line.get('minimumquantity')
                    ,	current_quantity = parseInt(line.get('quantity'), 10)
                    ,   stock_level = item.get("_stock", true)
                    ,   allowBackorders = item.get("_allowBackorders", true);

                new_quantity = (new_quantity >= min_quantity && new_quantity) ? new_quantity : current_quantity;

                if (new_quantity > stock_level && !allowBackorders) {
                    new_quantity = stock_level;
                    self.showError("<span>Limited quantities, only " + stock_level +" available.</span>", this.$('#' + internalid + ' + .item-summary-line-2'), false);
                }

                $input.val(new_quantity);

                this.storeColapsiblesState();

                if (new_quantity !==  current_quantity)
                {

                    $line = this.$('#' + internalid);
                    $input.val(new_quantity).prop('disabled', true);
                    line.set('quantity', new_quantity);

                    var invalid = line.validate();

                    if (!invalid)
                    {
                        var update_promise = this.model.updateLine(line);

                        this.disableElementsOnPromise(update_promise, 'article[id="' + internalid + '"] a, article[id="' + internalid + '"] button');

                        update_promise.done(function ()
                        {
                            self.showContent().done(function (view)
                            {
                                view.resetColapsiblesState();
                            });
                        }).fail(function (jqXhr)
                        {
                            jqXhr.preventDefault = true;
                            var result = JSON.parse(jqXhr.responseText);

                            self.showError(result.errorMessage, $line, result.errorDetails);
                            line.set('quantity', current_quantity);
                        }).always(function ()
                        {
                            $input.prop('disabled', false);
                        });
                    }
                    else
                    {
                        var placeholder = this.$('#' + internalid + ' [data-type="alert-placeholder"]');
                        placeholder.empty();

                        _.each(invalid, function(value)
                        {
                            var global_view_message = new GlobalViewsMessageView({
                                message: value
                                ,	type: 'error'
                                ,	closable: true
                            });

                            placeholder.append(global_view_message.render().$el.html());
                        });

                        $input.prop('disabled', false);
                        line.set('quantity', current_quantity);
                    }
                }
            }
        }

    ,   removeItem: function (e)
        {
            this.storeColapsiblesState();

            var self = this
                ,	product = this.model.get('lines').get(this.$(e.target).data('internalid'))
                ,	remove_promise = this.model.removeLine(product)
                ,	internalid = product.get('internalid');

            this.isRemoving = true;

            this.disableElementsOnPromise(remove_promise, 'article[id="' + internalid + '"] a, article[id="' + internalid + '"] button');

            remove_promise
                .done(function ()
                {
                    self.showContent().done(function (view)
                    {
                        view.resetColapsiblesState();
                    });
                })
                .always(function ()
                {
                    self.isRemoving = false;
                });

            return remove_promise;
        }

    ,	validateGiftCertificate: function (item)
        {
            if (item.itemOptions && item.itemOptions.GIFTCERTRECIPIENTEMAIL)
            {
                if (!Backbone.Validation.patterns.email.test(item.itemOptions.GIFTCERTRECIPIENTEMAIL.label))
                {
                    this.render(); //for unchecking the just checked checkbox
                    this.showError(_('Recipient email is invalid').translate());
                    return false;
                }
            }
            return true;
        }

    ,	estimateTaxShip: function (e)
        {
            var options = this.$(e.target).serializeObject()
                ,	address_internalid = options.zip + '-' + options.country + '-null';

            e.preventDefault();

            this.model.get('addresses').push({
                internalid: address_internalid
                ,	zip: options.zip
                ,	country: options.country
            });

            this.model.set('shipaddress', address_internalid);

            var promise = this.saveForm(e);

            if (promise)
            {
                this.swapEstimationStatus();
                promise.done(jQuery.proxy(this, 'showContent'));
            }

        }

    ,	removeShippingAddress: function (e)
        {
            e.preventDefault();

            this.swapEstimationStatus();

            var self = this;

            this.model.save({
                shipmethod: null
                ,	shipaddress: null
            }).done(function ()
            {
                self.showContent();
            });
        }

    ,	changeCountry: function (e)
        {
            e.preventDefault();
            this.storeColapsiblesState();
            var options = this.$(e.target).serializeObject()
                ,	AddressModel = this.model.get('addresses').model;

            this.model.get('addresses').add(new AddressModel({ country: options.country, internalid: options.country }));
            this.model.set({ shipaddress: options.country });

            this.showContent().done(function (view)
            {
                view.resetColapsiblesState();
            });

        }

    ,   storeColapsiblesState: function ()
        {
            this.storeColapsiblesStateCalled = true;
            this.$('.collapse').each(function (index, element)
            {
                colapsibles_states[SC.Utils.getFullPathForElement(element)] = jQuery(element).hasClass('in');
            });
        }

    ,	childViews: _.extend( CartDetailedView.prototype.childViews, {

            'Cart.Summary': function ()
            {
                return this.cartSummary;
            }

        ,	'Item.ListNavigable': function ()
            {
                return new BackboneCollectionView({
                    collection: this.model.get('lines')
                    ,	viewsPerRow: 1
                    ,	childView: CartLinesView
                    ,	childViewOptions: {
                        navigable: true
                        ,	useLinePrice: true
                        ,	application: this.application
                        ,	SummaryView: CartItemSummaryView
                        ,	ActionsView: CartItemActionsView
                        ,	showAlert: false
                    }
                });
            }

        ,	'RecentlyViewed.Items' : function ()
            {
                return new RecentlyViewedItemsView({ application: this.application, childViewOptions: {showAddToCart: true} });
            }

        ,	'Correlated.Items': function ()
            {
                return new ItemRelationsCorrelatedView({ itemsIds: this.model.getItemsIds(), application: this.application });
            }

        ,	'Related.Items': function ()
            {
                return new ItemRelationsRelatedView({ itemsIds: this.model.getItemsIds(), application: this.application });
            }
        })

	});

});
