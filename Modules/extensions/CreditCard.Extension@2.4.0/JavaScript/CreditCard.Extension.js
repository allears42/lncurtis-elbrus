/*
	© 2017 LN Curtis
	Custom extension logic for CreditCard module.
*/

define(
	'CreditCard.Extension'
,	[
		'CreditCard.Edit.Form.View.Extension',
		'CreditCard.View.Extension'
	]
,	function(
        CreditCardEditFormViewExtension,
        CreditCardViewExtension
	)
{
	'use strict';
	
	return {
        CreditCardEditFormViewExtension: CreditCardEditFormViewExtension
	,	CreditCardViewExtension: CreditCardViewExtension
	}

});
