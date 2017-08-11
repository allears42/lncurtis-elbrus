/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Facets
define(
	'Facets.ItemCell.View'
,	[
		'SC.Configuration'

	,	'ProductViews.Price.View'
	,	'ProductLine.Stock.View'
	,	'GlobalViews.StarRating.View'
	,	'ProductViews.Option.View'
	,	'Utils'

	,	'Backbone'
	,	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	,	'underscore'
	]
,	function(
		Configuration

	,	ProductViewsPriceView
	,	ProductViewsStockView
	,	GlobalViewsStarRating
	,	ProductViewsOptionView
	,	Utils

	,	Backbone
	,	BackboneCompositeView
	,	BackboneCollectionView
	,	_
	)
{
	'use strict';

	// @class Facets.ItemCell.View @extends Backbone.View
	return Backbone.View.extend({

		initialize: function ()
		{
			BackboneCompositeView.add(this);
		}
		// @method getContext @returns {Facets.ItemCell.View.Context}
	,	getContext: function ()
		{
		    var stock_level = this.model.get("_stock", true) || 0
            ,   allowBackorders = this.model.get("_allowBackorders", true)
            ,   set_max_quantity = stock_level > 0 && !allowBackorders;
            
			//@class Facets.ItemCell.View.Context
			return {
				// @property {String} itemId
				itemId: this.model.get('_id')
				// @property {String} name
			,	name: this.model.get('_name')
				// @property {String} url
			,	url: this.model.get('_url')
				// @property {String} seoURL
			,	seoURL: window.location.protocol + '//' + window.location.hostname + this.model.get('_url')
				// @property {Number} minQuantity
			,	minQuantity: parseInt(this.model.get('_minimumQuantity'), 10)
				// @property {Number} rating
			,	rating: this.model.get('_rating')
				// @property {Boolean} canAddToCart
			,	canAddToCart: Configuration.addToCartFromFacetsView && this.model.isReadyForCart() && this.model.get('_priceCallFor') == false
				// @property {Boolean} isEnvironmentBrowser
			,	isEnvironmentBrowser: SC.ENVIRONMENT.jsEnvironment === 'browser' && !SC.ENVIRONMENT.isTouchEnabled
				// @property {Object} thumbnail
			,	thumbnail: this.model.get('_thumbnail')
				// @property {Object} stockInfo
			,	stockInfo: this.model.getStockInfo()
				// @property {Boolean} itemIsNavigable
			,	itemIsNavigable: !_.isUndefined(this.options.itemIsNavigable) ? !!this.options.itemIsNavigable : true
				//@property {Boolean} showRating
			,	showRating: SC.ENVIRONMENT.REVIEWS_CONFIG && SC.ENVIRONMENT.REVIEWS_CONFIG.enabled
				//@property {String} track_productlist_list
			,	track_productlist_list: this.model.get('track_productlist_list')
				//@property {String} track_productlist_position
			,	track_productlist_position: this.model.get('track_productlist_position')
				//@property {String} track_productlist_category
			,	track_productlist_category: this.model.get('track_productlist_category')
				//@property {String} sku
			,	sku: this.model.get('_sku')
				//@property {String} description
			,	storeDescription: this.model.get('storedescription')
				//@property {String} setMaxQuantity
			,	setMaxQuantity: set_max_quantity
				//@property {String} maxQuantity
			,	maxQuantity: stock_level
			};
			//@class Facets.ItemCell.View
		}

	,	childViews: {
			'ItemViews.Price': function()
			{
				return new ProductViewsPriceView({
					model: this.model
				,	origin: 'ITEMCELL'
				});
			}
		,	'ItemViews.Stock': function()
			{
				return new ProductViewsStockView({model: this.model, origin: "FACET_CELL", application: this.application});
			}
		,	'GlobalViews.StarRating': function()
			{
				return new GlobalViewsStarRating({
					model: this.model
				,	showRatingCount: false
				,	queryOptions: Utils.parseUrlOptions(location.href)
				});
			}
		,	'ItemDetails.Options': function()
			{
				return new BackboneCollectionView({
					collection: new Backbone.Collection(_.where(this.model.getPosibleOptions(), {showSelectorInList: true}))
				,	childView: ProductViewsOptionView
				,	viewsPerRow: 1
				,	childViewOptions: {
						item: this.model
					}
				});
			}
		}
	});
});
