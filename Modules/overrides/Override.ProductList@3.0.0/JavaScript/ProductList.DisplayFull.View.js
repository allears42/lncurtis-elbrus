/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ProductList
define('ProductList.DisplayFull.View'
	,	[
			'product_list_display_full.tpl'
		,	'ProductViews.Price.View'
		,	'ProductLine.Stock.View'
		,	'GlobalViews.StarRating.View'
		,	'ProductList.DetailsMinQuantity.View'
		,	'Backbone.CompositeView'
		,	'Backbone.CollectionView'
		,	'Transaction.Line.Views.Options.Selected.View'
		,	'transaction_line_views_options_selected.tpl'

		,	'underscore'
		,	'Backbone'
		,	'Backbone.View'
		,	'Backbone.View.render'
		]
	,	function(
			product_list_display_full_tpl
		,	ProductViewsPriceView
		,	ProductLineStockView
		,	GlobalViewsStarRatingView
		,	ProductListDetailsMinQuantityView
		,	BackboneCompositeView
		,	BackboneCollectionView
		,	TransactionLineViewsOptionsSelectedView
		,	transaction_line_views_options_selected_tpl

		,	_
		,	Backbone
		)
{
	'use strict';

	// @class ProductList.DisplayFull.View @extends Backbone.View
	return Backbone.View.extend({

		template: product_list_display_full_tpl

	,	initialize: function ()
		{
			BackboneCompositeView.add(this);
		}

	,	childViews: {
			'ItemViews.Price': function ()
			{
				return new ProductViewsPriceView({
					model: this.model.get('itemDetails')
				,	origin: 'PRODUCTLISTDETAILSFULL'
				});
			}
		,	'Item.SelectedOptions': function ()
			{
				return new BackboneCollectionView({
					collection: new Backbone.Collection(this.model.get('itemDetails').getPosibleOptions())
				,	childView: TransactionLineViewsOptionsSelectedView
				,	cellTemplate: transaction_line_views_options_selected_tpl
				,	viewsPerRow: 1
				,	childViewOptions: {
						cartLine: this.model
					}
				});
			}
		,	'ItemViews.Stock': function ()
			{
				return new ProductLineStockView({
					model:this.model.get('itemDetails')
				});
			}
		,	'GlobalViews.StarRating': function ()
			{
				return new GlobalViewsStarRatingView({
					model:this.model.get('itemDetails')
				});
			}
		,	'ProductList.DetailsMinQuantity': function ()
			{
				return new ProductListDetailsMinQuantityView({
					model:this.model
				});
			}
		}

		// @method getContext @return {ProductList.DisplayFull.View.Context}
	,	getContext: function()
		{
			var item = this.model
		,	options = this.options
		,	product = item.get('item')
		,	priority = item.get('priority')
		,	itemDetails = item.get('itemDetails')
		,	thumbnail = itemDetails.get('_thumbnail')
		,	description = item.get('description')
        ,   isCallForPricing = product.custitem_sc_call_for_pricing || false
        ,   showCheckBox = !isCallForPricing && (!options || !options.hide_checkbox);

			// @class ProductList.DisplayFull.View.Context
			return {
				// @property {String} itemId
				itemId : item.get('internalid')
				// @property {Boolean} isChecked
			,	isChecked: !!item.get('checked')
				// @property {Integer} quantity
			,	quantity : item.get('quantity')
				// @property {String} description
			,	description : description
				// @property {Boolean} hasDescription
			,	hasDescription : !!description
				// @property {Boolean} showEdit
			,	showEdit : options && options.show_edit_action
				// @property {Boolean} showMoveAction
			,	showMoveAction : options && options.show_move_action
				// @property {Boolean} showAddedOn
			,	showAddedOn : !options || !options.hide_added_on
				// @property {String} itemDetailsId
			,	itemDetailsId : itemDetails.get('internalid')
				// @property {String} itemDetailsUrl
			,	itemDetailsUrl : _(itemDetails.get('_url')).fixUrl()
				// @property {String} thumbnailAlt
			,	thumbnailAlt : thumbnail.altimagetext
				// @property {String} thumbnailResized
			,	thumbnailResized: this.options.application.resizeImage(thumbnail.url, 'thumbnail')
				// @property {Boolean} isAvailableForCart
			,	isAvailableForCart : product.ispurchasable && item.fulfillsMinimumQuantityRequirement()
				// @property {Boolean} showRating
			,	showRating : false //!options || !options.hide_rating
				// @property {Boolean} showCheckbox
			,	showCheckbox : showCheckBox
				// @property {String} productName
			,	productName : item.getProductName() || item.get('name')
				// @property {String} priorityName
			,	priorityName : priority.name
				// @property {String} itemCreatedDate
			,	itemCreatedDate : item.get('createddate')
				// @property {String} linkAttributes
			,	linkAttributes: itemDetails.get('_linkAttributes')
			};
		}
	});
});