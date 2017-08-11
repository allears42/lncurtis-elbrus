/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Header
define(
	'Header.MiniCartItemCell.View'
,	[
		'SC.Configuration'
	,	'Transaction.Line.Views.Options.Selected.View'
	,	'ProductLine.Stock.View'
	,	'Profile.Model'

	,	'header_mini_cart_item_cell.tpl'

	,	'underscore'
	,	'Backbone'
	,	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	,	'underscore'
	,	'Utils'
	]
,	function(
		Configuration
	,	TransactionLineViewsOptionsSelectedView
	,	ProductLineStockView
	,	ProfileModel

	,	header_mini_cart_item_cell_tpl

	,	_
	,	Backbone
	,	BackboneCompositeView
	,	BackboneCollectionView
	)
{
	'use strict';

	// @class Header.MiniCart.View @extends Backbone.View
	return Backbone.View.extend({

		template: header_mini_cart_item_cell_tpl

	,	initialize: function()
		{
			BackboneCompositeView.add(this);
		}
    ,   events: {
            'contextmenu img': 'preventContextMenu'
        }

	,	childViews: {
		'Item.SelectedOptions': function ()
		{
			return new BackboneCollectionView({
				collection: new Backbone.Collection(this.model.get('item').getPosibleOptions())
			,	childView: TransactionLineViewsOptionsSelectedView
			,	viewsPerRow: 1
			,	childViewOptions: {
					cartLine: this.model
				}
			});
		}
		
		, 'Item.Stock': function ()
		{
			//console.log(this.model)
			return new ProductLineStockView({model: this.model.get('item'), origin: "MINI_CART", application: this.application});
		}
		}
        
    ,   preventContextMenu: function (e){
            e.preventDefault();
            console.error('You\'re attempting to access an image that is copyrighted by LNCurtis.com');
            return false;
        }
        
		// @method getContext @return {Header.MiniCart.View.Context}
	,	getContext: function()
		{
            var item = this.model.get('item')
                ,   itemOptions = this.model.get('options')
                ,   customImage = _.first(_.filter(itemOptions, function (option) {
                return option.id == "CUSTCOL_SC_ITEM_IMAGE"
            }));

			// @class Header.MiniCart.View.Context
			return {
				line: this.model
				//@property {Number} itemId
			,	itemId: item.id
				//@property {String} itemType
			,	itemType: item.get('itemtype')
				//@property {String} linkAttributes
			,	linkAttributes: item.get('_linkAttributes')
				// @property {Boolean} isPriceEnabled
			,	isPriceEnabled: !ProfileModel.getInstance().hidePrices()

            ,   image: (customImage && customImage.value) ? customImage.value : item.get('_thumbnail').url
			};
		}
	});
});