/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module OrderWizard
define('OrderWizard.Module.Address.Fix'
,	[	'OrderWizard.Module.Address'
	,	'underscore'
	,	'jQuery'
	,	'Utils'
	]
,	function (
		OrderWizardModuleAddress
	,	_
	,	jQuery
	)
{
	'use strict';
	
	_.extend(OrderWizardModuleAddress.prototype, {
		
		manageError: _.wrap(OrderWizardModuleAddress.prototype.manageError, function (fn, error) {
			fn.apply(this, _.toArray(arguments).slice(1));
			
			console.log('manage error');
			jQuery('html, body').animate({
				scrollTop: jQuery('[data-type="alert-placeholder-step"]:first').offset().top - 30
			}, 600);
		})
	});
});
