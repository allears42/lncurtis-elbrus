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