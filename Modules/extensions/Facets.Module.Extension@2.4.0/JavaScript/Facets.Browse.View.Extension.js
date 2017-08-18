/*
	© 2017 LN Curtis
	Custom extension logic for...
*/

define(
	'Facets.Browse.View.Extension'
,	[
		'Facets.Browse.View'

	,	'underscore'
	]
,	function(
		FacetsBrowseView

	, 	_
	)
{
	'use strict';
	
	_.extend( FacetsBrowseView.prototype, {

		events: _.extend( FacetsBrowseView.prototype.events, {
			'click [data-toggle="facet-navigation"]': 'toggleFacetNavigation'
        ,	'change [data-toggle="add-to-cart"] input[name="quantity"]': 'changeQ'
        ,	'submit [data-toggle="add-to-cart"]': 'addToCart'
        ,	'click [data-action="toggle-filters"]': 'toggleFilters'
        ,   'contextmenu img': 'preventContextMenu'
    	})

	,   preventContextMenu: function (e)
		{
			e.preventDefault();
            console.error('You\'re attempting to access an image that is copyrighted by LNCurtis.com');
            return false;
        }

	,	getPath: function ()
        {
            // fixed for category being relative URL :/
            var canonical = window.location.protocol + '//' + window.location.hostname;

            if (this.model.get('category'))
            {
                return this.model.get('category').get('canonical') || canonical + this.model.get('category').get('fullurl');
            }
            else
            {
                canonical = canonical +  '/' + Backbone.history.fragment;
                var	index_of_query = canonical.indexOf('?');
                // !~ means: indexOf == -1
                return !~index_of_query ? canonical : canonical.substring(0, index_of_query);
            }
        }

	,	setOptionsTranslator: function (translator)
        {
            /*if (translator.options.display === 'grid' && _.isPhoneDevice())
            {
                translator.options.display = 'table';
            }*/
            return translator;
        }

	,	showContent: function ()
        {
            // If its a free text search it will work with the title
            var self = this
                ,	keywords = this.translator.getOptionValue('keywords')
                ,	resultCount = this.model.get('total');

            if (keywords)
            {
                keywords = decodeURIComponent(keywords);

                if (resultCount > 0)
                {
                    this.subtitle =  resultCount > 1 ? _('Results for "$(0)"').translate(keywords) : _('Result for "$(0)"').translate(keywords);
                }
                else
                {
                    this.subtitle = _('We couldn\'t find any items that match "$(0)"').translate(keywords);
                }
            }

            this.totalPages = Math.ceil(resultCount / this.translator.getOptionValue('show'));

            this.application.getLayout().showContent(this).done(function ()
            {
                Tracker.getInstance().trackProductList(self.model.get('items'));
                self.render();

                if(jQuery.fn.scPush)
                {
                    self.$el.find('[data-action="pushable"]').scPush({target: 'tablet'});
                }
            });
        }

	,	changeQ: function(e)
        {
            e.preventDefault();
            var options = jQuery(e.target).closest('form').serializeObject()
                ,	model = this.model.get('items').get(options.item_id)
                ,   stock_level = jQuery(e.target).attr("max");

            // custom limit quantity
            if(typeof stock_level !== 'undefined' && parseInt(stock_level) > 0) {

                if ( parseInt(options.quantity) > parseInt(stock_level)){
                    options.quantity = stock_level;

                    var global_view_message = new GlobalViewsMessageView({
                        message: "<span>Limited quantities, only " + stock_level +" available.</span>"
                        ,	type: 'warning'
                        ,	closable: false
                    });


                    jQuery(e.target).closest('form').find('[data-type="alert-placeholder-module"]').html(
                        global_view_message.render().$el.html()
                    );

                    jQuery(e.target).val(stock_level)
                }
            }


            // Updates the quantity of the model
            model.setOption('quantity', options.quantity);
            jQuery(e.target).closest('.item-cell').find('[itemprop="price"]').html(model.getPrice().price_formatted);
        }

	,	addToCart: function (e)
        {
            e.preventDefault();

            var options = jQuery(e.target).serializeObject()
                ,	model = this.model.get('items').get(options.item_id);

            // Updates the quantity of the model
            model.setOption('quantity', options.quantity);

            if (model.isReadyForCart())
            {
                var self = this
				,	cart = this.cart
				,	layout = this.application.getLayout()
				,	cart_promise = jQuery.Deferred()
				,	error_message = _('Sorry, there is a problem with this Item and can not be purchased at this time. Please check back later.').translate()

				,   stock_level = model.get("_stock", true)
				,   allowBackorders = model.get("_allowBackorders", true);

                // wrap in a load cart promise to make sure we have a live instance of the order to check against inventory
                LiveOrderModel.loadCart().done(function () {
                    var cartInstance = LiveOrderModel.getInstance()
                        , lines = cart.get('lines');

                    var itemCart = SC.Utils.findItemInCart(model, cart) // TODO: resolve error with dependency circular.
                        ,	total = itemCart && itemCart.get('quantity') || 0;

                    if ((total + options.quantity) > stock_level && !allowBackorders)
                    {
                        options.quantity = (stock_level - total > 0) ? stock_level - total : 0;
                    }

                    // reset quantity after calculations take place
                    model.setOption('quantity', options.quantity);

                    if(options.quantity === 0) {
                        // do nothing
                        var global_view_message = new GlobalViewsMessageView({
                            message: "<span>Limited quantities, only " + stock_level +" available.</span>"
                            ,	type: 'warning'
                            ,	closable: false
                        });


                        jQuery(e.target).closest('form').find('[data-type="alert-placeholder-module"]').html(
                            global_view_message.render().$el.html()
                        );
                    }
                    else {
                        if (model.cartItemId) {
                            cart_promise = cart.updateItem(model.cartItemId, model).done(function () {
                                if (cart.getLatestAddition()) {
                                    if (self.$containerModal) {
                                        self.$containerModal.modal('hide');
                                    }

                                    if (layout.currentView instanceof require('Cart').Views.Detailed) {
                                        layout.currentView.showContent();
                                    }
                                }
                                else {
                                    self.showError(error_message);
                                }
                            });
                        }
                        else {
                            cart_promise = cart.addItem(model).done(function () {
                                if (cart.getLatestAddition()) {
                                    layout.showCartConfirmation();
                                }
                                else {
                                    self.showError(error_message);
                                }
                            });
                        }

                        // disalbes the btn while it's being saved then enables it back again
                        if (e && e.currentTarget) {
                            jQuery('input[type="submit"]', e.currentTarget).attr('disabled', true);
                            cart_promise.always(function () {
                                jQuery('input[type="submit"]', e.currentTarget).attr('disabled', false);
                            });
                        }
                    }
                });
            }
        }

	,   getOrderedFacets: function (facets_to_show)
		{
            var self = this
                ,   ordered_facets = facets_to_show && facets_to_show.sort(function (a, b) {
                // Default Priority is 0
                return (self.translator.getFacetConfig(a.url || a.id).priority || 0) - (self.translator.getFacetConfig(b.url || b.id).priority || 0);
            });

            ordered_facets = _.filter(ordered_facets, function (facet) {
                var validURLS = _.filter(facet.values, function (facetValue) {

                    return facetValue.url && facetValue.url.length > 0 }
                );
                return validURLS.length > 1;
            });

            return ordered_facets;
        }

	,	childViews: _.extend( FacetsBrowseView.prototype.childViews, {
			'Facets.FacetedNavigation': function (options)
			{
				var self = this
					, exclude = _.map((options.excludeFacets || '').split(','), function (facet_id_to_exclude) {
					return jQuery.trim(facet_id_to_exclude);
				})
					, customExcludeConfig = Configuration.get('customExclude', '')
					, customExclude = _.map((customExcludeConfig).split(','), function (facet_id_to_exclude) {
					return jQuery.trim(facet_id_to_exclude);
				})
					, has_categories = !!(this.category && this.category.categories)
					, has_items = this.model.get('items').length
					, has_facets = has_items && this.model.get('facets').length
					, applied_facets = this.translator.cloneWithoutFacetId('category').facets
					, has_applied_facets = applied_facets.length
					, is_category = !!this.model.get('category')
					, facets_to_show = _.filter(this.model.get('facets'), function (facet) {
					return !_.contains(exclude, facet.id) && !_.contains(customExclude, facet.id);
				})
					, ordered_facets = self.getOrderedFacets(facets_to_show);


				if (is_category && !has_applied_facets && Utils.isPageGenerator()) {
					if (this.model.get('category').get(
							'parenturl').length < 1) facets_to_show = ordered_facets.slice(0, 4);
				}

				return new FacetsFacetedNavigationView({
					categoryItemId: this.category && this.category.itemid
					, clearAllFacetsLink: this.translator.cloneWithoutFacets().getUrl()
					, hasCategories: has_categories
					, hasItems: has_items

					// facets box is removed if don't find items
					, hasFacets: has_facets

					, hasCategoriesAndFacets: has_categories && has_facets

					// Categories are not a real facet, so lets remove those
					, appliedFacets: applied_facets

					, hasFacetsOrAppliedFacets: has_facets || has_applied_facets

					//,	translatorUrl: this.translator.getUrl()
					, translator: this.translator

					//,	translatorConfig: this.options.translatorConfig
					, facets: facets_to_show

					, totalProducts: this.model.get('total')
					, keywords: this.translator.getOptionValue('keywords')
					//  custom: pass all facets regardless of exclude so that we can use them to populate a category menu on non-category pages
					, allFacets: this.model.get('facets')
					, isCategory: is_category
					, category: this.model.get('category')
				});
				}
		})

	});

});
