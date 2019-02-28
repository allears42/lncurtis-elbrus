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

                if (campaignId && !isCartPage) {

                    requestObj = {data: $.param({campaignId: campaignId})};
                    model = new MSALeadFormModalsModel();
                    promise = model.fetch(requestObj);

                    promise.done(function() {

                        // console.log('GOT PROMISE: ', JSON.stringify(model));

                        model.set('custevent_jhm_msa_lead_campaign', campaignId);
                        model.set('incomingmessage', 'MSA LEAD CAMPAIGN SUBMISSION');
                        model.set('title', 'MSA LEAD CAMPAIGN SUBMISSION');
                        model.set('subsidiary', '1');

                        // console.log('COOKIE FROM DEF: ', MSALeadFormModalsUtils.getCookie(model));
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



                        // Layout.on('afterAppendView', function() { // Fires repeatedly, too much
                        // Layout.on('afterRender', function() {   // Fires once, when layout loads - but not on navigation

                        // })
                    });

                }
            }
        }   // End MTA
    }
});