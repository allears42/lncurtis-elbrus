/*
	© 2017 LN Curtis
	Custom extension logic for Cart module.
*/

define(
	'Cart.Extension'
,	[
		'Cart.Confirmation.View.Extension'
	,	'Cart.Detailed.View'
	,	'Cart.Detailed.View.Extension'
	]
,	function(
        CartConfirmationViewExtension
	,	CartDetailedView
	,	CartDetailedViewExtension
	)
{
	'use strict';
	
	return {
        CartConfirmationViewExtension: CartConfirmationViewExtension
	,	CartDetailedView: CartDetailedView
	,	CartDetailedViewExtension: CartDetailedViewExtension
	}

});
