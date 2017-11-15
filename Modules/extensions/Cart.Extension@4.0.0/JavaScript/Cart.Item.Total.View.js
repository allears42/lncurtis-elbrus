/*
	© 2017 LN Curtis
	View to show line total in cart summary
*/

//@module Cart
define('Cart.Item.Total.View'
,	[	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	,	'Profile.Model'

	,	'cart_item_total.tpl'

	,	'Backbone'
	,	'underscore'
	]
,	function (
		BackboneCompositeView
	,	BackboneCollectionView
	,	ProfileModel

	,	cart_item_total_tpl

	,	Backbone
	,	_
	)
{
	'use strict';

	//@class Cart.Item.Summary.View @extend Backbone.View
	return Backbone.View.extend({

		// @property {Function} template
		template: cart_item_total_tpl

		//@method initialize Defines this view as composite
   		//@return {Void}
	,	initialize: function ()
		{
			BackboneCompositeView.add(this);
		}

		// @method getContext
		// @return {Cart.Item.Summary.View.Context}
	,	getContext: function ()
		{
			var minimum_quantity = this.model.get('item').get('_minimumQuantity', true) || 1;

			//@class Cart.Item.Summary.View.Context
			return {
				//@property {Model} line
				line: this.model
				//@property {String} lineId
			,	lineId: this.model.get('internalid')
				//@property {Boolean} isMinusButtonDisabled
				//@property {Boolean} showComparePrice
			,	showComparePrice: false//this.model.get('amount') > this.model.get('total')
				// @property {Boolean} isPriceEnabled
			,	isPriceEnabled: !ProfileModel.getInstance().hidePrices()
			};
			//@class Cart.Item.Summary.View
		}
	});
});
