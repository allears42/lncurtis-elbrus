/*
	© 2017 LN Curtis
	Add custom property closeModalOnSuccess that can be uses to not close modal on success
*/

define(
	'Backbone.FormView.Extension'
,	[
		'Backbone.FormView'
	,	'Backbone'
	,	'underscore'
	,	'jQuery'
	,	'backbone.stickit'
	,	'Backbone.Validation'
	]
,	function(
		BackboneFormView
	,	Backbone
	,	_
	,	jQuery
	)
{
	'use strict';
	
	function buttonSubmitDone (savingForm)
	{
		savingForm.find('[type="submit"]').each(function () {
			var element = jQuery(this);
			element.attr('disabled', false);
			element.text(element.data('default-text'));
		});
	}
	
	_.extend( BackboneFormView.prototype, {

		closeModalOnSuccess: true
	
		// @method saveForm will serialize the input of some form and save() the given model using it
		// @param {HTMLEvent} e @param {Backbone.Model} model @param {Object} props properties to pass to model.save()
		// @return {jQuery.Deferred}
	,	saveForm: function (e, model, props)
		{
			e.preventDefault();
			
			//Add validate method into the view.model
			Backbone.Validation.bind(this);
			
			model = model || this.model;
			
			this.$savingForm = jQuery(e.target).closest('form');
			this.isSavingForm = true;
			
			if (this.$savingForm.length)
			{
				// and hides reset buttons
				this.$savingForm.find('input[type="reset"], button[type="reset"]').hide();
			}
			
			this.hideError();
			
			var self = this
				// Returns the promise of the save action of the model
				,	result = model.save(props || this.$savingForm.serializeObject(), {
					
					wait: true
					
					,	forceUpdate: false
					
					// Hides error messages, re enables buttons and triggers the save event
					// if we are in a modal this also closes it
					,	success: function (model, response)
					{
						if (self.inModal && self.$containerModal)
						{
							// customization to not auto close modal
							if(self.closeModalOnSuccess) {
								self.$containerModal.modal('hide');
							}
						}
						
						if (self.$savingForm.length)
						{
							self.hideError(self.$savingForm);
							buttonSubmitDone(self.$savingForm);
							
							model.trigger('save', model, response);
						}
						model.trigger('saveCompleted');
					}
					
					// Re enables all button and shows an error message
					,	error: function (model, response)
					{
						buttonSubmitDone(self.$savingForm);
						
						if (response.responseText)
						{
							model.trigger('error', jQuery.parseJSON(response.responseText));
						}
					}
				});
			
			if (result === false)
			{
				this.$savingForm.find('input[type="reset"], button[type="reset"]').show();
				this.$savingForm.find('*[type=submit], *[type=reset]').attr('disabled', false);
			}
			
			return result;
		}
	});

});
