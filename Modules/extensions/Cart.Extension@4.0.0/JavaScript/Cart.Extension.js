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
	]
,	function(
        CartConfirmationViewExtension
	,	CartDetailedViewExtension
	,	CartLinesViewExtension
	)
{
	'use strict';
	
	return {
        CartConfirmationViewExtension: CartConfirmationViewExtension
	,	CartDetailedViewExtension: CartDetailedViewExtension
	,	CartLinesViewExtension: CartLinesViewExtension
	}

});
