/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Facets
define('Facets.Browse.View'
,	[	'SC.Configuration'
	,	'LiveOrder.Model'
	,	'Facets.Helper'
	,	'Categories'
	,	'Facets.FacetedNavigation.View'
	,	'Facets.FacetedNavigationItem.View'
	,	'Facets.FacetsDisplay.View'
	,	'Facets.FacetList.View'
	,	'Facets.ItemListDisplaySelector.View'
	,	'Facets.ItemListSortSelector.View'
	,	'Facets.ItemListShowSelector.View'
	,	'Facets.ItemCell.View'
	,	'Facets.Empty.View'
	,	'Facets.Browse.CategoryHeading.View'
	,	'Facets.CategoryCell.View'
	,	'Facets.FacetedNavigationItemCategory.View'
	,	'GlobalViews.Pagination.View'
	,	'GlobalViews.Message.View'
	,	'Tracker'

	,	'facets_facet_browse.tpl'
	,	'facets_items_collection.tpl'
	,	'facets_items_collection_view_cell.tpl'
	,	'facets_items_collection_view_row.tpl'

	,	'Backbone'
	,	'Backbone.CollectionView'
	,	'Backbone.CompositeView'
	,	'underscore'
	,	'jQuery'
    ,	'Utils'
	,	'Bootstrap.Slider'
	]
,	function (
		Configuration
	,	LiveOrderModel
	,	Helper
	,	Categories
	,	FacetsFacetedNavigationView
	,	FacetsFacetedNavigationItemView
	,	FacetsFacetsDisplayView
	,	FacetsFacetListView
	,	FacetsItemListDisplaySelectorView
	,	FacetsItemListSortSelectorView
	,	FacetsItemListShowSelectorView
	,	FacetsItemCellView
	,	FacetsEmptyView
	,	FacetsBrowseCategoryHeadingView
	,	FacetsCategoryCellView
	,	FacetsFacetedNavigationItemCategoryView
	,	GlobalViewsPaginationView
	,	GlobalViewsMessageView
	,	Tracker

	,	facet_browse_tpl
	,	facets_items_collection_tpl
	,	facets_items_collection_view_cell_tpl
	,	facets_items_collection_view_row_tpl

	,	Backbone
	,	BackboneCollectionView
	,	BackboneCompositeView

	,	_
	,	jQuery
    ,   Utils
	)
{
	'use strict';


	// statuses stores the statuses of the collapsible facets
	var statuses = window.statuses = {}
		// collapsable_elements stores the statuses of the collapsible elements. This store elements collapsable that are not facets
		/*
		each object should be of the form
		{
			selector: '' //id of the element that will collapsed/expanded
		,	collapsed: true/false
		}
		*/
	,	collapsable_elements = window.collapsable_elements = {};

	//@class Facets.Browse.View View that handles the item list @extends Backbone.View
	return Backbone.View.extend({

		template: facet_browse_tpl
	,	description: _('This is a description').translate()

	,	attributes: {
			'id': 'facet-browse'
		,	'class': 'view facet-browse'
		}

	,	events: {
			'click [data-toggle="facet-navigation"]': 'toggleFacetNavigation'
		,	'change [data-toggle="add-to-cart"] input[name="quantity"]': 'changeQ'
		,	'submit [data-toggle="add-to-cart"]': 'addToCart'
		,	'click [data-action="toggle-filters"]': 'toggleFilters'
        ,   'contextmenu img': 'preventContextMenu'
		}

    ,   preventContextMenu: function (e){
            e.preventDefault();
            console.error('You\'re attempting to access an image that is copyrighted by LNCurtis.com');
            return false;
        }
        
	,	initialize: function (options)
		{
			BackboneCompositeView.add(this);
			this.statuses = statuses;
			this.collapsable_elements = collapsable_elements;
			this.translator = this.setOptionsTranslator(options.translator);
			this.application = options.application;

			this.cart = LiveOrderModel.getInstance();

			this.collapsable_elements['facet-header'] = this.collapsable_elements['facet-header'] || {
				selector: 'this.collapsable_elements["facet-header"]'
			,	collapsed: false
			};

		}

		//@method toggleFilters
	,	toggleFilters: function (e)
		{
			e.preventDefault();

			var current_target = jQuery(e.currentTarget);

			this.collapsable_elements['facet-header'].collapsed = !this.collapsable_elements['facet-header'].collapsed;

			current_target.find('.filter-icon').toggleClass('icon-chevron-up');

			current_target.parents('[data-type="accordion"]')
				.toggleClass('well')
				.toggleClass('facet-header-white-well')
				.find('[data-type="accordion-body"]').stop().slideToggle();
		}

		//@method getPath
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

		//@method getCanonical
	,	getCanonical: function ()
		{
			var canonical_url = this.getPath()
			,	current_page = this.translator.getOptionValue('page');

			if (current_page > 1)
			{
				canonical_url += '?page=' + current_page;
			}

			return canonical_url;
		}

		//@method getRelPrev
	,	getRelPrev: function ()
		{
			var previous_page_url = this.getPath()
			,	current_page = this.translator.getOptionValue('page');

			if (current_page > 1)
			{
				if (current_page === 2)
				{
					return previous_page_url;
				}

				if (current_page > 2)
				{
					return previous_page_url += '?page=' + (current_page - 1);
				}
			}

			return null;
		}

		//@method getRelNext
	,	getRelNext: function ()
		{
			var next_page_url = this.getPath()
			,	current_page = this.translator.getOptionValue('page');

			if (current_page < this.totalPages)
			{
				return next_page_url += '?page='+ (current_page + 1);
			}

			return null;
		}

		//@method formatFacetTitle: accepts a facet object and returns a string formatted to be displayed on the document's title according with user facet configuration property titleToken
		//@param {Object} facet @returns {String}
	,	formatFacetTitle: function (facet)
		{
			var defaults = {
				range: '$(2): $(0) to $(1)'
			,	multi: '$(1): $(0)'
			,	single: '$(1): $(0)'
			};

			if (!facet.config.titleToken)
			{
				facet.config.titleToken = defaults[facet.config.behavior] || defaults.single;
			}
			if (_.isFunction(facet.config.titleToken))
			{
				return facet.config.titleToken(facet);
			}
			else if (facet.config.behavior === 'range')
			{
				return _(facet.config.titleToken).translate(facet.value.to, facet.value.from, facet.config.name);
			}
			else if (facet.config.behavior === 'multi')
			{
				var buffer = [];
				_.each(facet.value, function (val)
				{
					buffer.push(val);
				});
				return _(facet.config.titleToken).translate(buffer.join(', '), facet.config.name);
			}
			else
			{
				var value = this.translator.getLabelForValue(facet.config.id, facet.value);

				return _(facet.config.titleToken).translate(value, facet.config.name);
			}
		}

		// @method getTitle overrides Backbone.Views.getTitle
	,	getTitle: function ()
		{
			// TODO: add facets to the category title??
			var facets = this.options.translator.facets
			,	category = this.model.get('category')
			,	title = category ? category.get('pagetitle') || _.pluck(this.getBreadcrumbPages(), 'text').join(' > ') : this.title;

			if (facets && facets.length)
			{
				var buffer = []
				,	facet = null;

				for (var i = 0; i < facets.length; i++)
				{
					facet = facets[i];
					buffer.push(this.formatFacetTitle(facet));

					if (i < facets.length - 1)
					{
						buffer.push(facet.config.titleSeparator || ', ');
					}
				}

				title = title ? title + ' - ' : '';

				title = this.application.getConfig('searchTitlePrefix', '') +
						buffer.join('') +
						this.application.getConfig('searchTitleSuffix', '');
			}
			else if (this.translator.getOptionValue('keywords'))
			{
				title = _('Search results for "$(0)"').translate(
					this.translator.getOptionValue('keywords')
				);
			}
			else
			{
				title = title || this.application.getConfig('defaultSearchTitle', '');
			}

			// Update the meta tag 'twitter:title'
			this.setMetaTwitterTitle(title);

			return title;
		}

		// @method getMetaDescription Get view's SEO attributes @return {String}
	,	getMetaDescription: function ()
		{
			var category = this.model.get('category');

			return category && category.get('metadescription') || this.metaDescription;
		}

		// @method getMetaKeywords @return {String}
	,	getMetaKeywords: function ()
		{
			var category = this.model.get('category');

			return category && category.get('metakeywords') || this.metaKeywords;
		}

	,	getAddToHead: function ()
		{
			var category = this.model.get('category');

			return category && category.get('addtohead') || this.addToHead;
		}

		// @method setMetaTwitterTitle @param {Strnig}title
	,	setMetaTwitterTitle: function (title)
		{
			var seo_twitter_title = jQuery('meta[name="twitter:title"]');
			seo_twitter_title && seo_twitter_title.attr('content', title);
		}

		//@method setOptionsTranslator Set up the default option for displaying the facets.
		//If we are in a small device, we've got to omit the 'grid' display option,
		//for it is not showing in this kind of devices. We must change it for 'table'
		//@param {Facets.Translator} translator
		//@return {Facets.Translator}
	,	setOptionsTranslator: function (translator)
		{
			/*if (translator.options.display === 'grid' && _.isPhoneDevice())
			{
				translator.options.display = 'table';
			}*/
			return translator;
		}

		// @method showContent overrides Backbone.View.showContent to works with the title to find the proper wording and calls the layout.showContent
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

		//@method changeQ
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

		// @method addToCart Adds the item to the cart
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
		// @method getBreadcrumbPages
		// It will generate an array suitable to pass it to the breadcrumb macro
		// It looks in the category facet value
		// @return {Array<Object>}
	,	getBreadcrumbPages: function ()
		{
			var breadcrumb = [];

			if (this.model.get('category'))
			{
				var list = this.model.get('category').get('breadcrumb');

				_.each(list, function(bread)
				{
					breadcrumb.push({
						'text': bread.name
					,	'href': bread.fullurl
					});
				});

				return breadcrumb;
			}
			else if (this.translator.getOptionValue('keywords'))
			{
				breadcrumb.push({
					href: '#'
				,	text: _('Search Results').translate()
				});
			}
			else
			{
				breadcrumb.push({
					href: '#'
				,	text: _('Shop').translate()
				});
			}

			return breadcrumb;
		}

		// @method toggleFacetNavigation Hides/Shows the facet navigation area
	,	toggleFacetNavigation: function ()
		{
			this.$el.toggleClass('narrow-by');
			this.toggleNavigationListener(this.$el.hasClass('narrow-by'));
		}

		// @method toggleNavigationListener
		// adds/removes event listeners to the HTML to hide the facet navigation area
		// @param {Boolean} isOn
	,	toggleNavigationListener: function (isOn)
		{
			var self = this
			,	touch_started = null;

			// turn listeners on
			if (isOn)
			{
				jQuery('html')
					// we save the time when the touchstart happened
					.on('touchstart.narrow-by', function ()
					{
						touch_started = new Date().getTime();
					})
					// code for touchend and mousdown is the same
					.on('touchend.narrow-by mousedown.narrow-by', function (e)
					{
						// if there wasn't a touch event, or the time difference between
						// touch start and touch end is less that 200 miliseconds
						// (this is to allow scrolling without closing the facet navigation area)
						if (!touch_started || new Date().getTime() - touch_started < 200)
						{
							var $target = jQuery(e.target);

							// if we are not touching the narrow by button or the facet navigation area
							if (!$target.closest('[data-toggle="facet-navigation"]').length && !$target.closest('#faceted-navigation').length)
							{
								// we hide the navigation
								self.toggleFacetNavigation();
							}
						}
					});
			}
			else
			{
				jQuery('html')
					// if the navigation area is hidden, we remove the event listeners from the HTML
					.off('mousedown.narrow-by touchstart.narrow-by touchend.narrow-by');
			}
		}

	,	render: function ()
		{
			this._render();
		}

    ,   getOrderedFacets: function (facets_to_show) {
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

	,	childViews: {

			'Facets.FacetedNavigation': function (options)
			{
				var self = this
                ,   exclude = _.map((options.excludeFacets || '').split(','), function (facet_id_to_exclude)
					{
						return jQuery.trim( facet_id_to_exclude );
					})
                ,   customExcludeConfig = Configuration.get('customExclude', '')
                ,   customExclude = _.map((customExcludeConfig).split(','), function (facet_id_to_exclude)
                    {
                        return jQuery.trim( facet_id_to_exclude );
                    })
				,	has_categories = !!(this.category && this.category.categories)
				,	has_items = this.model.get('items').length
				,	has_facets = has_items && this.model.get('facets').length
				,	applied_facets = this.translator.cloneWithoutFacetId('category').facets
				,	has_applied_facets = applied_facets.length
                ,   is_category = !!this.model.get('category')
                ,   facets_to_show = _.filter(this.model.get('facets'), function (facet)
                {
                    return !_.contains(exclude, facet.id) && !_.contains(customExclude, facet.id) ;
                })
                ,	ordered_facets = self.getOrderedFacets(facets_to_show);


                if (is_category && !has_applied_facets && Utils.isPageGenerator()) {
                    if(this.model.get('category').get('parenturl').length < 1) facets_to_show = ordered_facets.slice(0, 4);
                }

				return new FacetsFacetedNavigationView({
					categoryItemId: this.category && this.category.itemid
				,	clearAllFacetsLink: this.translator.cloneWithoutFacets().getUrl()
				,	hasCategories: has_categories
				,	hasItems: has_items

					// facets box is removed if don't find items
				,	hasFacets: has_facets

				,	hasCategoriesAndFacets: has_categories && has_facets

					// Categories are not a real facet, so lets remove those
				,	appliedFacets: applied_facets

				,	hasFacetsOrAppliedFacets: has_facets || has_applied_facets

				//,	translatorUrl: this.translator.getUrl()
				,	translator: this.translator

				//,	translatorConfig: this.options.translatorConfig
				,	facets: facets_to_show

                ,	totalProducts: this.model.get('total')
				,	keywords: this.translator.getOptionValue('keywords')
                //  custom: pass all facets regardless of exclude so that we can use them to populate a category menu on non-category pages
                ,   allFacets: this.model.get('facets')
                ,   isCategory: is_category
                ,   category : this.model.get('category')
				});
			}

		,	'Facets.FacetsDisplay': function()
			{
				var facets = this.translator.cloneWithoutFacetId('category').getAllFacets().sort(function (a, b) {
                    return b.config.priority - a.config.priority;
				});

                return new FacetsFacetsDisplayView({
					facets: facets
				,	translator: this.translator
				});
			}

		,	'Facets.ItemListDisplaySelector': function()
			{
				return new FacetsItemListDisplaySelectorView({
					configClasses: 'pull-right'
				,	options: this.options.application.getConfig('itemsDisplayOptions')
				,	translator: this.translator
				});
			}

		,	'Facets.ItemListSortSelector': function()
			{
				return new FacetsItemListSortSelectorView({
					options: this.options.application.getConfig('sortOptions')
				,	translator: this.translator
				});
			}

		,	'Facets.ItemListShowSelector': function()
			{
				return new FacetsItemListShowSelectorView({
					options: this.options.application.getConfig('resultsPerPage')
				,	translator: this.translator
				});
			}

		,	'Facets.FacetedNavigation.Item': function (options)
			{
				var facet_config = this.translator.getFacetConfig(options.facetId)
				,	contructor_options = {
						model: new Backbone.Model(_.findWhere(this.model.get('facets'), {id: options.facetId}))
					,	translator: this.translator
					};

				if (facet_config.template)
				{
					contructor_options.template = facet_config.template;
				}

				return new FacetsFacetedNavigationItemView(contructor_options);
			}

		,	'Facets.Items': function()
			{
                /*// not firing in SC.Shopping.Configuration
                var screenType = _.getDeviceType();

                // Phone Specific
                if (screenType === 'phone')
                {
                    Configuration.itemsDisplayOptions = Configuration.itemsDisplayOptionsPhone;
                    Configuration.sortOptions = Configuration.sortOptionsPhone;
                    Configuration.defaultPaginationSettings = Configuration.defaultPaginationSettingsPhone;
                }
                // Tablet Specific
                else if (screenType === 'tablet') {
                    Configuration.itemsDisplayOptions = Configuration.itemsDisplayOptionsTablet;
                    Configuration.sortOptions = Configuration.sortOptionsTablet;
                    Configuration.defaultPaginationSettings = Configuration.defaultPaginationSettingsTablet;
                }*/

                var self = this
				,	display_option = _.find(Configuration.itemsDisplayOptions, function (option)
                {
                    return option.id === self.options.translator.getOptionValue('display');
                });

                return new BackboneCollectionView({
					childTemplate: display_option.template
				,	childView: FacetsItemCellView
				,	viewsPerRow: parseInt(display_option.columns, 10)
				,	collection: this.model.get('items')
				,	cellTemplate: facets_items_collection_view_cell_tpl
				,	rowTemplate: facets_items_collection_view_row_tpl
				,	template: facets_items_collection_tpl
				,	context: {
						keywords: this.translator.getOptionValue('keywords')
					}
				});
			}

		,	'Facets.Items.Empty': function()
			{
				return new FacetsEmptyView({
					keywords: this.translator.getOptionValue('keywords')
				});
			}

		,	'GlobalViews.Pagination': function()
			{
				var translator = this.translator;

				return new GlobalViewsPaginationView(_.extend({
					currentPage: translator.getOptionValue('page')
				,	totalPages: this.totalPages
				,	pager: function (page) {
						return translator.cloneForOption('page', page).getUrl();
					}
				}, Configuration.defaultPaginationSettings));
			}

		,	'Facets.Browse.CategoryHeading': function()
			{
				return new FacetsBrowseCategoryHeadingView({
					model: this.model.get('category')
				});
			}

		,	'Facets.CategoryCells': function()
			{
				return new BackboneCollectionView({
					childView: FacetsCategoryCellView
				,	collection: this.model.get('category') ? this.model.get('category').get('categories') : []
				});
			}

		,	'Facets.CategorySidebar': function()
			{
                return new FacetsFacetedNavigationItemCategoryView({
					model: this.model.get('category')
				,	categoryUrl: this.translator.getCategoryUrl()
				});
			}
		}

		//@method getContext @returns {Facets.Browse.View.Context}
	,	getContext: function()
		{
			var hasSelectedFacets = this.translator.cloneWithoutFacetId('category').getAllFacets().length
			,	hasSubcategories = this.model.get('category') ? this.model.get('category').get('categories').length : false
			,	hasItems = this.model.get('items').length;

			// @class Facets.Browse.View.Context
			return {
				// @property {Number} total
				total: this.model.get('total')

				// @property {Boolean} isTotalProductsOne
			,	isTotalProductsOne: this.model.get('total') === 1

				// @property {String} title
			,	title: this.getTitle()

				// @property {Boolean} hasItemsAndFacets
			,	hasItemsAndFacets: !!(this.model.get('items').length && this.model.get('facets').length)

				// @property {Boolean} collapseHeader
			,	collapseHeader: !!(this.collapsable_elements['facet-header'].collapsed)

				// @property {String} keywords
			,	keywords: this.translator.getOptionValue('keywords')

				// @property {Boolean} showResults
			,	showResults: _.isNull(this.translator.getOptionValue('keywords')) ? true : (this.model.get('total') > 0)

				// @property {Boolean} isEmptyList
			,	isEmptyList:  (this.model.get('total') <= 0)

				// @property {Boolean} isCategory
			,	isCategory: !!this.model.get('category')

				// @property {Boolean} showItems
			,	showItems: hasItems || (!hasItems && hasSelectedFacets) || !(!hasItems && !hasSelectedFacets && hasSubcategories)
			};
			// @class Facets.Browse.View
		}
	});
});
