/*
 © 2017 LN Curtis - Call for Pricing modification
 */

// @module Call for Pricing

define('CallForPricing',
	[
		'Cart.QuickAddToCart.View.CallForPricing',
		'ProductDetails.Base.View.CallForPricing',
		'ProductViews.Price.View.CallForPricing'
	],
	function (
		CartQuickAddToCartViewCallForPricing,
		ProductDetailsBaseViewCallForPricing,
		ProductViewsPriceViewCallForPricing
	){
		'use strict';
		
		return {
			CartQuickAddToCartViewCallForPricing: CartQuickAddToCartViewCallForPricing,
			ProductDetailsBaseViewCallForPricing: ProductDetailsBaseViewCallForPricing,
			ProductViewsPriceViewCallForPricing: ProductViewsPriceViewCallForPricing
		}
	}
);