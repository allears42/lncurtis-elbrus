/*
	© 2017 LN Curtis
	Custom extension logic for Cart module.
*/

define(
	'Cart.Extension'
,	[
		'Cart.Confirmation.View.Extension'
	,	'Cart.Detailed.View.Extension'
	,	'Cart.Lines.View.Extension'
	,	'Cart.Confirmation.Helpers.Extension'
	,	'Cart.QuickAddToCart.View.Extension'
	,	'Cart.Promocode.List.Item.View.Extension'
	]
,	function(
		CartConfirmationViewExtension
	,	CartDetailedViewExtension
	,	CartLinesViewExtension
	,	CartConfirmationHelpersExtension
	,	CartQuickAddToCartViewExtension
	,	CartPromocodeListItemViewExtension
	)
{
	'use strict';
	
	return {
		CartConfirmationViewExtension: CartConfirmationViewExtension
	,	CartDetailedViewExtension: CartDetailedViewExtension
	,	CartLinesViewExtension: CartLinesViewExtension
	,	CartConfirmationHelpersExtension: CartConfirmationHelpersExtension
	,	CartQuickAddToCartViewExtension: CartQuickAddToCartViewExtension
	,	CartPromocodeListItemViewExtension: CartPromocodeListItemViewExtension
	}

});
