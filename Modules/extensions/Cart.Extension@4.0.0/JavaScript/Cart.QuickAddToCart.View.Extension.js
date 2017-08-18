/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Cart
define('Cart.QuickAddToCart.View.Extension'
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
			
			console.log('this.model.getItem().get(\'_priceCallFor\')', this.model.getItem().get('_priceCallFor'))
			//add check for call for pricing
			this.showQuickAddToCartButton = !!(Configuration.get('addToCartFromFacetsView', false) &&
				this.model.getItem().get('_isPurchasable') &&
				this.model.areAttributesValid(['options','quantity'])) &&
				this.model.getItem().get('_priceCallFor') === false;
		})
	});
	
});

//@class Cart.QuickAddToCart.View.Initialize.Options
//@property {Product.Model} model