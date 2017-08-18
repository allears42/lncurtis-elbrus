/*
	© 2017 LN Curtis
*/

define(
    'ProductList.CartSaveForLater.View.Extension'
    ,	[
        'ProductList.CartSaveForLater.View'
    ,   'ProductList.Model'
    ,	'ProductList.DetailsLater.View'
    ,   'ProductList.Item.Model'
    ,   'Profile.Model'
    ,   'SC.Configuration'

    ,	'underscore'
    ,   'jQuery'

    ]
    ,	function(
        ProductListCartSaveForLaterView
    ,   ProductListModel
    ,   ProductListDetailsLaterView
    ,   ProductListItemModel
    ,   ProfileModel
    ,   Configuration

    , 	_
    ,   jQuery

    )
    {
        'use strict';

        _.extend( ProductListCartSaveForLaterView.prototype, {

            //  modifications
        	saveForLaterItem: function (e)
            {
                e.preventDefault();

                if (!this.validateLogin())
                {
                    return;
                }

                this.storeColapsiblesState();

                var cart_line = this.model.get('lines').get(jQuery(e.target).data('internalid'))
                    ,	internalid = cart_line.get('internalid')
                    ,	whole_promise = jQuery.Deferred()
                    ,	self = this;

                if (cart_line.ongoingPromise)
                {
                    cart_line.ongoingPromise.then(function (new_line)
                    {
                        cart_line = self.model.get('lines').get(new_line.latest_addition);

                        self.saveForLaterItemHelper(whole_promise, cart_line);
                    });
                }
                else
                {
                    this.saveForLaterItemHelper(whole_promise, cart_line);
                }

                this.disableElementsOnPromise(whole_promise, 'article[id="' + internalid + '"] a, article[id="' + internalid + '"] button');
            }

        ,	addItemToList: function (cart_line)
            {
                var defer = jQuery.Deferred()
                ,   self = this;

                if (this.validateGiftCertificate(cart_line))
                {
                    this.application.ProductListModule.Utils.getSavedForLaterProductList().done(function(pl_json)
                    {
                        if (!pl_json.internalid)
                        {
                            var pl_model = new ProductListModel(pl_json);

                            pl_model.save().done(function (pl_json)
                            {
                                self.doAddItemToList(pl_json.internalid, cart_line, defer);
                            });
                        }
                        else
                        {
                            self.doAddItemToList(pl_json.internalid, cart_line, defer);
                        }
                    });
                }
                else
                {
                    defer.resolve();
                }

                return defer.promise();
            }

        ,	doAddItemToList: function (product_list_id, cart_line, internal_promise)
            {
                var self = this
                ,	product_list_item_model = ProductListItemModel.createFromTransactionLine(cart_line);

                product_list_item_model.set('productList', {id: product_list_id});
                product_list_item_model.set('options', cart_line.itemOptions);
                product_list_item_model.set('quantity', cart_line.get('quantity'));
                product_list_item_model.set('description', '');
                product_list_item_model.set('item', cart_line.get('item'), {silent:true});

                product_list_item_model.save(null, {validate: false}).done(function ()
                {
                    product_list_item_model.set('item', cart_line.get('item'), {silent: true});
                    self.productListModel.get('items').add(product_list_item_model, {at:0});
                    internal_promise.resolve();
                });
            }

            // extensions
        ,   render : function()
            {
                this._render();
                this.renderSaveForLaterSection();
            }

        ,	renderSaveForLaterSection: function()
            {
                if (ProfileModel.getInstance().get('isLoggedIn') !== 'T' || !Configuration.get('productList'))
                {
                    return;
                }

                var self = this;

                this.application.ProductListModule.Utils.getSavedForLaterProductList().done(function(json)
                {
                    self.renderSaveForLaterSectionHelper(new ProductListModel(json));
                });
            }

        ,	renderSaveForLaterSectionHelper: function(pl_model)
            {
                var self = this;

                this.product_list_details_view = new ProductListDetailsLaterView({
                    application: this.application
                    ,	model: pl_model
                    ,	addToCartCallback: function() {self.addToCart(); }
                });

                this.$('[data-type=saved-for-later-placeholder]').empty();
                this.$('[data-type=saved-for-later-placeholder]').append(this.product_list_details_view.render().el);
                this.$el.find('[data-action="pushable"]').scPush();
        }

        ,	addToCart: function()
            {
                this.showContent();
            }

        ,	getItemOptions: function (itemOptions)
            {
                var result = {};

                _.each(itemOptions, function (value, name)
                {
                    result[name] = {
                        value: value.internalid
                        ,   displayvalue: value.label
                    };

                });

                return result;
            }


        });

    });
