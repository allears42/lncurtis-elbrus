/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module ItemViews
define(
	'Product.Configurator.AdditionalProduct.View'
,	[
		'ProductViews.Price.View'
	,	'GlobalViews.StarRating.View'
	
	,	'Product.Model'
	,	'ProductViews.Option.View'
	,	'Cart.QuickAddToCart.View'
	
	,	'Backbone.CollectionView'
	,	'Backbone.CompositeView'

	,	'additional_product_item.tpl'

	,	'Backbone'
	]
,	function (
		ProductViewsPriceView
	,	GlobalViewsStarRatingView
	
	,	ProductModel
	,	ProductViewsOptionView
	,	CartQuickAddToCartView
	
	,	BackboneCollectionView
	,	BackboneCompositeView

	,	additional_product_item_tpl
	

	,	Backbone
	)
{
	'use strict';

	// @class ItemViews.RelatedItem.View Responsible for rendering an item details. The idea is that the item rendered is related to another one in the same page
	// @extend Backbone.View
	return Backbone.View.extend({

		//@property {Function} template
		template: additional_product_item_tpl

		//@method initialize Override default method to make this view composite
		//@param {ItemViews.RelatedItem.View.Initialize.Options} options
		//@return {Void}
	,	initialize: function (options)
		{
			Backbone.View.prototype.initialize.apply(this, arguments);
			BackboneCompositeView.add(this);
		}

	,	childViews: {
			'Item.Price': function ()
			{
				return new ProductViewsPriceView({
					model: this.model
				,	origin: 'RELATEDITEM'
				});
			}
		,	'Global.StarRating': function ()
			{
				return new GlobalViewsStarRatingView({
					model: this.model
				,	showRatingCount: false
				});
			}
			
		,   'Cart.QuickAddToCart': function ()
			{
				var product = new ProductModel({
					item: this.model
				,	quantity: this.model.get('_minimumQuantity', true)
				});
				
				return new CartQuickAddToCartView({
					model: product
				,	application: this.options.application
				});
			}
		
		,   'Product.Options': function () {
				var product = new ProductModel({
					item: this.model
					,	quantity: this.model.get('_minimumQuantity', true)
				})
				, options_to_render = product.getVisibleOptions() || [];
				// get the singles
				options_to_render = _.filter(options_to_render, function (option) {
					return option.get('values') && option.get('values').length > 2
				});
				
				
				return new BackboneCollectionView({
					collection: options_to_render
					,	childView: ProductViewsOptionView
					,	viewsPerRow: 1
					,	childViewOptions: {
						line: this.model
						,	item: this.model.get('item')
						,	templateName: 'selector'
						,	show_required_label: this.options.show_required_label
					}
				});
			}
		}

		//@method getContext
		//@returns {ItemViews.RelatedItem.View.Context}
	,	getContext: function ()
		{
			//@class ItemViews.RelatedItem.View.Context
			return {
				//@property {String} itemURL
				itemURL: this.model.getFullLink()
				//@property {String} itemName
			,	itemName: this.model.get('_name') || this.model.Name
				// @property {ImageContainer} thumbnail
			,	thumbnail: this.model.getThumbnail()
				//@property {String} sku
			,	sku: this.model.get('_sku')
				// @property {String} itemId
			,	itemId: this.model.get('_id')
				// @property {Item.Model} model
			,	model: this.model
			};
			//@class ItemViews.RelatedItem.View
		}
	});
});

//@class ItemViews.RelatedItem.View.Initialize.Options
//@property {Item.Model} model