/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module OrderWizard.Module.PaymentMethod
define(
	'OrderWizard.Module.PaymentMethod.Creditcard.Fix'
,	[
		'OrderWizard.Module.PaymentMethod.Creditcard'
	,	'underscore'
	]
,	function (
		OrderWizardModulePaymentMethodCreditcard
	,	_
	)
{
	'use strict';
	
	_.extend(OrderWizardModulePaymentMethodCreditcard.prototype, {
		
		manageError: _.wrap(OrderWizardModulePaymentMethodCreditcard.prototype.manageError, function (fn, error) {
			fn.apply(this, _.toArray(arguments).slice(1));
			
			//console.log('manage error - cc');
			
			// errors data-validation-error="block"
			var errorsStep = jQuery('[data-type="alert-placeholder-step"]:first')
				,   errorsInline = jQuery('[data-validation-error="block"]:first')
				,   globalViews = jQuery('.global-views-message-error:first')
				,   scrollTop = null;
			
			if(errorsStep && errorsStep.length > 0) {
				scrollTop = errorsStep.offset().top - 30
			}
			else if(errorsInline && errorsInline.length > 0) {
				scrollTop = errorsInline.offset().top - 30
			}
			else if(globalViews && globalViews.length > 0) {
				scrollTop = globalViews.offset().top - 30
			}
			
			if(!_.isNull(scrollTop)) {
				jQuery('html, body').animate({
					scrollTop: scrollTop
				}, 600);
			}
		})
	});
});
