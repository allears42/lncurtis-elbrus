/*
	© 2017 LN Curtis
*/

//@module Cart
define('Cart.QuickAddToCart.View.CallForPricing'
,	[
		'Cart.QuickAddToCart.View'
	,	'SC.Configuration'
	,	'underscore'
	]
,	function (
		CartQuickAddToCartView
	,	Configuration
	,	_
	)
{
	'use strict';
	
	_.extend(CartQuickAddToCartView.prototype, {
		initialize: _.wrap(CartQuickAddToCartView.prototype.initialize, function (fn, options) {
			fn.apply(this, _.toArray(arguments).slice(1));
			
			//add check for call for pricing
			this.showQuickAddToCartButton = !!(Configuration.get('addToCartFromFacetsView', false) &&
				this.model.getItem().get('_isPurchasable') &&
				this.model.areAttributesValid(['options','quantity'])) &&
				this.model.getItem().get('_isCallForPricing') === false;
			
		})
	});
	
});
