define('MSALeadFormModals'
,   [
        'MSALeadFormModals.Form.View'
    ,   'SC.Configuration'
    ,   'MSALeadFormModals.Model'
    ,   'MSALeadFormModals.Utils'
    ]
,   function
    (
        MSALeadFormModalsFormView
    ,   Configuration
    ,   MSALeadFormModalsModel
    ,   MSALeadFormModalsUtils
    )
{
    'use strict';

    return {

        mountToApp: function(application) {

            if (!SC.isPageGenerator()) {

                var Layout = application.getLayout()
                ,   modalView
                ,   campaignId = Configuration.get('msaLeadCampaigns.activeCampaign', null)
                ,   delay = Configuration.get('msaLeadCampaigns.delay', 0)
                ,   currPage = window.location.href
                ,   isCartPage = currPage.indexOf('cart') >= 0
                ,   promise
                ,   model
                ,   requestObj
                ,   cookie;


                /**
                 * Attaching an event listener and handler to layout allows us to add elements with the appropriate
                 * data-action property to SMT landing and enhanced pages and trigger modal pop-up on click.
                 */
                _.extend(Layout, {

                    events: _.extend({}, Layout.events, {
                        'click [data-action="display-msa-modal-smt"]': 'displayMSAModal'
                    })

                ,   displayMSAModal: function(e)
                    {
                        // Prevent default but don't stop event propagation
                        e.preventDefault();

                        var model = new MSALeadFormModalsModel()
                        ,   modalView
                        ,   layout = application.getLayout()
                        ,   campaignId = Configuration.get('msaLeadCampaigns.activeCampaign', null)
                        ,   requestObj;

                        if (campaignId) {

                            requestObj = {data: $.param({campaignId: campaignId})};

                            model.fetch(requestObj).done(function() {

                                modalView = new MSALeadFormModalsFormView({
                                    application: application
                                ,   model: model
                                ,   showOptOut: false
                                });

                                layout.showInModal(modalView);
                            })
                        }
                    }
                });


                if (campaignId && !isCartPage) {

                    requestObj = {data: $.param({campaignId: campaignId})};
                    model = new MSALeadFormModalsModel();
                    promise = model.fetch(requestObj);

                    promise.done(function() {

                        cookie = MSALeadFormModalsUtils.getCookie(model);

                        if (!cookie) {

                            modalView = new MSALeadFormModalsFormView({
                                application: application
                            ,   model: model
                            });

                            setTimeout(function() {
                                Layout.showInModal(modalView);
                            }, delay);
                        }

                    });

                }
            }
        }   // End MTA

    }
});