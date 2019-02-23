define('MSALeadFormModals.Form.View'
,   [
        'Backbone'
    ,   'msa_lead_form.tpl'
    ,   'Backbone.FormView'
    ]
,   function
    (
        Backbone
    ,   msa_lead_form_tpl
    ,   BackboneFormView
    )
{
    'use strict';

    return Backbone.View.extend({

        template: msa_lead_form_tpl

    ,   events: {
            'submit form': 'customSaveForm'
        }

    ,   bindings: {
            '[name="firstname"]': 'firstname'
        ,   '[name="lastname"]': 'lastname'
        ,   '[name="email"]': 'email'
        ,   '[name="zip"]': 'zip'
        }

    ,   successMessage: 'Thank you for contacting us! We will respond to your inquiry as quickly as possible.'
    ,   failureMessage: 'Sorry, there was an error submitting your inquiry. Please try again.'
    ,   showForm: true

    ,   initialize: function(options)
        {
            this.application = options.application;
            BackboneFormView.add(this);

            this.listenTo(this.model, 'saveCompleted', this.afterSuccessfulSubmit);
            this.listenTo(this.model, 'error', this.afterFailedSubmit);
        }

    ,   afterSuccessfulSubmit: function()
        {
            this.model.clear();
            this.validationModel.clear();
            this.showForm = false;
            this.render();
            this.showForm = true;
        }

    ,   afterFailedSubmit: function()
        {
            this.showWarningMessage(this.failureMessage);
        }

    ,   customSaveForm: function(e)
        {
            e.preventDefault();
            e.stopPropagation();

            var result
            ,   self = this;

            // TODO: Check for/add name, title, message values

            // TODO: Testing only
            // self.afterFailedSubmit();
            self.afterSuccessfulSubmit();

            // result = this.saveForm(e, this.validationModel, null);
            //
            // if(!result) {
            //     self.afterFailedSubmit();
            //     return;
            // }
            //
            // result.done(function(data) {
            //     self.afterSuccessfulSubmit();
            // })
        }

    ,   getContext: function()
        {
            console.log('MODEL: ', this.model);
            return {
                showForm: this.showForm
            ,   successMessage: this.successMessage
            ,   title: this.model.get('title')
            ,   desc: this.model.get('desc')
            ,   imagePath: this.model.get('imagePath')
            }
        }
    });
});