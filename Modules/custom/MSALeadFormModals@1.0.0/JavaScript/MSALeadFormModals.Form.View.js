define('MSALeadFormModals.Form.View'
,   [
        'Backbone'
    ,   'msa_lead_form.tpl'
    ,   'Backbone.FormView'
    ,   'jQuery'
    ,   'MSALeadFormModals.Utils'
    ]
,   function
    (
        Backbone
    ,   msa_lead_form_tpl
    ,   BackboneFormView
    ,   jQuery
    ,   MSALeadFormModalsUtils
    )
{
    'use strict';

    return Backbone.View.extend({

        template: msa_lead_form_tpl

    ,   events: {
            'submit form': 'saveForm'
        ,   'click [data-action="dismiss-msa-modal"]': 'dismissModal'
        }

    ,   bindings: {
            '[name="firstname"]': 'firstname'
        ,   '[name="lastname"]': 'lastname'
        ,   '[name="email"]': 'email'
        ,   '[name="custevent_jhm_zip_code"]': 'custevent_jhm_zip_code'
        }

    ,   successMessage: 'Thank you for contacting us! We will respond to your inquiry as quickly as possible.'
    ,   failureMessage: 'Sorry, there was an error submitting your inquiry. Please try again.'
    ,   showForm: true
    ,   closeModalOnSuccess: false

    ,   initialize: function(options)
        {
            this.application = options.application;
            BackboneFormView.add(this);

            this.listenTo(this.model, 'saveCompleted', this.afterSuccessfulSubmit);
            this.listenTo(this.model, 'error', this.afterFailedSubmit);
        }

    ,   afterSuccessfulSubmit: function()
        {
            MSALeadFormModalsUtils.setCookie(this.model);
            this.validationModel.clear();
            this.showForm = false;
            this.render();
            this.showForm = true;
        }

    ,   afterFailedSubmit: function()
        {
            this.showWarningMessage(this.failureMessage);
        }

    ,   dismissModal: function(e)
        {
            e.preventDefault();
            e.stopPropagation();

            MSALeadFormModalsUtils.setCookie(this.model);

            this.$containerModal.modal('hide');
        }

    ,   getContext: function()
        {
            var imagePath = this.model.get('imagePath')
            ,   showOptOut = true;

            if (imagePath) {
                imagePath = imagePath.replace('Web Site Hosting Files/LN Curtis Firefighter Hosting Files', '')
                    .replace('Web Site Hosting Files/LN Curtis Blueline Hosting Files', '');
            }

            if (this.options.hasOwnProperty('showOptOut')) {
                showOptOut = this.options.showOptOut
            }

            return {
                showForm: this.showForm
            ,   successMessage: this.successMessage
            ,   campaignTitle: this.model.get('campaignTitle')
            ,   desc: this.model.get('desc')
            ,   imagePath: imagePath
            ,   showOptOut: showOptOut
            }
        }
    });
});