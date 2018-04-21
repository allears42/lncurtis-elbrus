// add custom field: custbody_special_instructions
// add mapping in sales order in configuration - Advanced > Custom Fields
// Add to CheckoutSteps

define('OrderWizard.Module.OrderComments'
	, [
		'Wizard.Module'
		, 'Profile.Model'
		, 'GlobalViews.Message.View'
		
		, 'order_wizard_order_comments.tpl'
		, 'underscore'
		, 'jQuery'
	],
	function (
		WizardModule
		, ProfileModel
		, GlobalViewsMessageView
		, order_wizard_field_tpl
		, _
		, jQuery
	) {
		'use strict';
		
		return WizardModule.extend({
			
			template: order_wizard_field_tpl
			
		,   field_id: 'custbody_special_instructions'
		
		,   events: {
				'blur [name="custbody_sca_gift_recipient_email"]': 'setFieldValueOnBlur'
			}
			
		,   initialize: function () {
				WizardModule.prototype.initialize.apply(this, arguments);
			}
			
		,   setFieldValueOnBlur: function (e) {
				var $target = jQuery(e.currentTarget),
					value = $target.val().trim();
				
				this.saveFieldValue(value);
			},
			
			saveFieldValue: function (value) {
				console.log('save');
				var options = this.model.get('options'),
					self = this;
				
				options[this.field_id] = value;
				
				this.step.disableNavButtons();
				
				this.model.set('options', options);
				
				this.model.save().always(function () {
					self.step.enableNavButtons();
				});
			}
			
		,   showError: function () {
				var global_view_message = new GlobalViewsMessageView({
					message: this.error.errorMessage,
					type: 'error',
					closable: true
				});
				
				this.$('[data-type="alert-placeholder-module"]:first').html(
					global_view_message.render().$el.html()
				);
				
				this.error = null;
				
			}
			
		,   getContext: function () {
				var options = this.model.get('options')
				,   fieldValue = options[this.field_id];
				
				return {
					model: this.model
					,   field_id: this.field_id
					,   value: fieldValue
				};
			}
		});
	});
