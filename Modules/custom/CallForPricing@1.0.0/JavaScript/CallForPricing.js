/*
 © 2017 LN Curtis - Call for Pricing modification
 */

// @module Call for Pricing

define('CallForPricing',
	[
		'Cart.QuickAddToCart.View.CallForPricing',
		'ProductDetails.Base.View.CallForPricing',
		'ProductList.Details.View.CallForPricing',
		'ProductViews.Price.View.CallForPricing'
	],
	function (
		CartQuickAddToCartViewCallForPricing,
		ProductDetailsBaseViewCallForPricing,
		ProductListDetailsViewCallForPricing,
		ProductViewsPriceViewCallForPricing
	){
		'use strict';
		
		return {
			CartQuickAddToCartViewCallForPricing: CartQuickAddToCartViewCallForPricing,
			ProductDetailsBaseViewCallForPricing: ProductDetailsBaseViewCallForPricing,
			ProductListDetailsViewCallForPricing: ProductListDetailsViewCallForPricing,
			ProductViewsPriceViewCallForPricing: ProductViewsPriceViewCallForPricing
		}
	}
);