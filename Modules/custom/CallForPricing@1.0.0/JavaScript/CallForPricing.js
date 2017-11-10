/*
 © 2017 LN Curtis - Call for Pricing modification
 */

// @module Call for Pricing

define('CallForPricing',
	[
		'Cart.QuickAddToCart.View.CallForPricing'
		,   'ProductDetails.Base.View.CallForPricing'
		,   'ProductList.Details.View.CallForPricing'
		,   'ProductList.Lists.View.CallForPricing.Extension'
		,   'ProductList.Model.CallForPricing.Extension'
		,   'ProductViews.Price.View.CallForPricing'
	],
	function (
		CartQuickAddToCartViewCallForPricing
		,   ProductDetailsBaseViewCallForPricing
		,   ProductListDetailsViewCallForPricing
		,   ProductListListsViewCallForPricingExtension
		,   ProductListModelCallForPricingExtension
		,   ProductViewsPriceViewCallForPricing
	){
		'use strict';
		
		return {
			CartQuickAddToCartViewCallForPricing: CartQuickAddToCartViewCallForPricing
			,   ProductDetailsBaseViewCallForPricing: ProductDetailsBaseViewCallForPricing
			,   ProductListDetailsViewCallForPricing: ProductListDetailsViewCallForPricing
			,   ProductListListsViewCallForPricingExtension: ProductListListsViewCallForPricingExtension
			,   ProductListModelCallForPricingExtension: ProductListModelCallForPricingExtension
			,   ProductViewsPriceViewCallForPricing: ProductViewsPriceViewCallForPricing
		}
	}
);