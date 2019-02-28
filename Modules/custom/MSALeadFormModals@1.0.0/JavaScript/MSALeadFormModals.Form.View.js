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

    // ,   customSaveForm: function(e)
    //     {
    //         e.preventDefault();
    //         e.stopPropagation();
    //
    //         var result
    //         ,   self = this;
    //
    //         // TODO: Testing only
    //         // self.afterFailedSubmit();
    //         // self.afterSuccessfulSubmit();
    //
    //         result = this.saveForm(e, this.validationModel, null);
    //         console.log('RESULT: ', result);
    //
    //         if (!result) {
    //             self.afterFailedSubmit();
    //             return;
    //         }
    //
    //         result.done(function(data) {
    //             console.log('GOT SUCCESFUL SUBMIT: ', data);
    //             self.afterSuccessfulSubmit();
    //         })
    //     }

    ,   getContext: function()
        {
            // console.log('MODEL: ', this.model);
            return {
                showForm: this.showForm
            ,   successMessage: this.successMessage
            ,   campaignTitle: this.model.get('campaignTitle')
            ,   desc: this.model.get('desc')
            ,   imagePath: this.model.get('imagePath')
            }
        }
    });
});