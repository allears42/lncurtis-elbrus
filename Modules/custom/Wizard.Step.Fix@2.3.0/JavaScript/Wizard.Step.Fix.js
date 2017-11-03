/*
	© 2017 JHM Services
	Fix for page not scrolling to error when it pops up
*/

// @module Wizard
define('Wizard.Step.Fix'
,	[	'Wizard.Step'
	,	'OrderWizard.Module.Address.Fix'
	,	'OrderWizard.Module.PaymentMethod.Creditcard.Fix'
	,	'OrderWizard.Module.PaymentMethod.Fix'
	,	'underscore'
	,	'jQuery'

	,	'GlobalViews.Message.View'
	,	'Utils'
	]
,	function (
		WizardStep
	,	OrderWizardModuleAddressFix
	,	OrderWizardModulePaymentMethodCreditcardFix
	,	OrderWizardModulePaymentMethodFix
	,	_
	,	jQuery

	,	GlobalViewsMessageView
	)
{
	'use strict';
	
	_.extend(WizardStep.prototype, {
		// fix for scrolling to error
		showError: function ()
		{
			if (this.error)
			{
				var global_view_message = new GlobalViewsMessageView({
					message: this.wizard.processErrorMessage(this.error.errorMessage)
					,	type: 'error'
					,	closable: true
				});
				
				this.$('[data-type="alert-placeholder-step"]').html(global_view_message.render().$el.html());
				
				jQuery('html, body').animate({
					scrollTop: jQuery('body .global-views-message-error:first').offset().top - 30
				}, 600);
				
				this.error = null;
			}
			// errors don't always bubble up
			else if(jQuery('.global-views-message-error') && jQuery('.global-views-message-error').length > 0) {
				jQuery('html, body').animate({
					scrollTop: jQuery('.global-views-message-error:first').offset().top - 30
				}, 600);
			}
		}
	});
	
	return {
		OrderWizardModulePaymentMethodFix: OrderWizardModulePaymentMethodFix
	,   OrderWizardModulePaymentMethodCreditcardFix: OrderWizardModulePaymentMethodCreditcardFix
	,   OrderWizardModuleAddressFix: OrderWizardModuleAddressFix
	}
});
