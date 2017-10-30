/*
	© 2017 JHM Services
*/

//@module Newsletter
define('Newsletter.View.Extension'
,	[
		'Newsletter.View'
	,	'SC.Configuration'

	,	'newsletter_modal.tpl'

	,	'underscore'
	,	'jQuery'
	,	'Utils'
	]
,	function (
		NewsletterView
	,	Configuration
	
	,	newsletter_modal_tpl
	
	,	_
	)
{
	'use strict';

	_.extend(NewsletterView.prototype, {
		bindings: _.extend(NewsletterView.prototype.bindings, {
			'[name="firstName"]': 'firstName',
			'[name="lastName"]': 'lastName',
			'[name="zipcode"]': 'zipcode'
		})
		
		// @property {Object} feedback Keeps the text and kind of message we need to show as feedback
		,	feedback: {
			'OK' : {
				'type': 'success'
				,	'message': _(Configuration.get('newsletter.success','Thank you! Welcome to our newsletter')).translate()
			}
			,	'ERR_USER_STATUS_ALREADY_SUBSCRIBED' : {
				'type': 'warning'
				,	'message': _(Configuration.get('newsletter.warning','Sorry, the specified email is already subscribed.')).translate()
			}
			,	'ERR_USER_STATUS_DISABLED' : {
				'type': 'error'
				,	'message': _(Configuration.get('newsletter.disabled','Sorry, the specified email cannot be subscribed.')).translate()
			}
			,	'ERROR': {
				'type': 'error'
				, 'message': _(Configuration.get('newsletter.error','Sorry, subscription cannot be done. Try again later.')).translate()
			}
			// if using recaptcha, this will show there error
			,   'NO_CAPTCHA' : {
				'type': 'error'
				, 'message': _('You must complete the captcha').translate()
			}
		}
		
		,   closeModalOnSuccess: false
		
		,	modalClass: 'global-views-modal-large modal-newsletter'
		
		,	showInModal: function (options)
		{
			console.log('showInModal');
			this.title = Configuration.get('newsletter.modalTitle', '');
			this.template = newsletter_modal_tpl;
			
			return this.application.getLayout().showInModal(this, options);
		}
		
	,   getContext: _.wrap(NewsletterView.prototype.getContext, function (fn) {
			var returnVariable = fn.apply(this, _.toArray(arguments).slice(1));
			
			_.extend(returnVariable, {
				additionalText: Configuration.get('newsletter.modalContent', '')
			});
			
			return returnVariable;
		})
		
	});
	
});