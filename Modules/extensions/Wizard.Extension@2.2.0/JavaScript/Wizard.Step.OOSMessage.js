/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Wizard
define('Wizard.Step.OOSMessage'
,	[
		'Wizard.Step'
	,   'GlobalViews.Message.View'
	,	'underscore'
	]
,	function (
		WizardStep
	,	GlobalViewsMessageView
	,	_
	)
{
	'use strict';

	_.extend(WizardStep.prototype, {
		
		// @method  showError
		showError: function ()
		{
			if (this.error)
			{
				// custom code to handle Inventory error.
				// gets called twice so error message gets transfered to "unhandled" which loses the message so must check for both instances
				// todo: update this
				if(this.error.errorCode === "ERR_WS_INVENTORY"
					|| this.error.errorMessage.indexOf("We are unable to place this order because one or more items in your order is not available in sufficient quantity.") > -1) {
					//console.log('true');
					this.error.errorMessage = "One or more items in your order do not allow back-order due to discontinued or otherwise unavailable stock. Please <a class='errortext' href='#' data-touchpoint='viewcart' data-action='edit-module'>go back</a> and adjust your order quantity.";
				}
				
				var global_view_message = new GlobalViewsMessageView({
					message: this.wizard.processErrorMessage(this.error.errorMessage)
					,	type: 'error'
					,	closable: true
				});
				
				this.$('[data-type="alert-placeholder-step"]').html(global_view_message.render().$el.html());
				
				jQuery('html, body').animate({
					scrollTop: jQuery('body .global-views-message-error:first').offset().top
				}, 600);
				
				this.error = null;
			}
		}
	});
	
});
