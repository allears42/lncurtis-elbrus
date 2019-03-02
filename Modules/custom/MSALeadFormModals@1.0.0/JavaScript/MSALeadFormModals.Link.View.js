define('MSALeadFormModals.Link.View'
,   [
        'Backbone'
    ,   'msa_lead_form_link.tpl'
    ,   'SC.Configuration'
    ,   'MSALeadFormModals.Form.View'
    ]
,   function
    (
        Backbone
    ,   msa_lead_form_link_tpl
    ,   Configuration
    ,   MSALeadFormModalsFormView
    )
{
    'use strict';

    return Backbone.View.extend({

        template: msa_lead_form_link_tpl

    ,   events: {
            'click [data-view="display-msa-modal"]': 'displayMSAModal'
        }

    ,   initialize: function(options)
        {
            var self = this
            ,   campaignId = Configuration.get('msaLeadCampaigns.activeCampaign', null)
            ,   requestObj
            ,   promise;

            this.application = options.application;
            this.layout = this.application.getLayout();

            if (campaignId) {

                requestObj = {data: $.param({campaignId: campaignId})};
                promise = this.model.fetch(requestObj);

                promise.done(function() {
                    self.render();
                });
            }
        }

    ,   displayMSAModal: function(e)
        {
            e.preventDefault();
            e.stopPropagation();

            var modalView = new MSALeadFormModalsFormView({
                application: this.application
            ,   model: this.model
            ,   showOptOut: false
            });

            this.layout.showInModal(modalView);

        }

    ,   getContext: function()
        {
            var displayLink = false
            ,   items = this.model.get('items');

            if (items && this.options.itemId) {

                items = items.split(',');

                if (items.indexOf(this.options.itemId.toString()) >= 0) {
                    displayLink = true;
                }
            }

            return {
                displayLink: displayLink
            ,   campaignTitle: this.model.get('campaignTitle') || ''
            }
        }
    });
});