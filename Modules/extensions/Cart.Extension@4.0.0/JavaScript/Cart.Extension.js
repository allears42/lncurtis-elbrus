/*
	© 2017 LN Curtis
	Custom extension logic for Cart module.
*/

define(
	'Cart.Extension'
,	[
		'Cart.Confirmation.View.Extension'
	,	'Cart.Detailed.View'
	]
,	function(
        CartConfirmationViewExtension
	,	CartDetailedView
	)
{
	'use strict';
	
	return {
        CartConfirmationViewExtension: CartConfirmationViewExtension
	,	CartDetailedView: CartDetailedView
	}

});
