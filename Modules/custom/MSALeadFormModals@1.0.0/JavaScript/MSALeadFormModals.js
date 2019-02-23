define('MSALeadFormModals'
,   [
        'MSALeadFormModals.Form.View'
    ,   'SC.Configuration'
    ,   'MSALeadFormModals.Model'
    ]
,   function
    (
        MSALeadFormModalsFormView
    ,   Configuration
    ,   MSALeadFormModalsModel
    )
{
    'use strict';

    return {

        mountToApp: function(application) {

            // TODO: Skip and reset if cart page?
            // TODO: Call for campaign data, execute on return

            if (!SC.isPageGenerator()) {

                var Layout = application.getLayout()
                ,   modalView
                ,   campaignId = Configuration.get('msaLeadCampaigns.activeCampaign', null)
                ,   delay = Configuration.get('msaLeadCampaigns.delay', 0)
                ,   currPage = window.location.href
                ,   isCartPage = currPage.indexOf('cart') >= 0
                ,   promise
                ,   model
                ,   requestObj;

                if (campaignId && !isCartPage) {

                    requestObj = {data: $.param({campaignId: campaignId})};
                    model = new MSALeadFormModalsModel();
                    promise = model.fetch(requestObj);

                    promise.done(function(data) {

                        console.log('GOT PROMISE: ', model);

                        // Layout.on('afterAppendView', function() { // Fires repeatedly, too much
                        // Layout.on('afterRender', function() {   // Fires once, when layout loads - but not on navigation

                            modalView = new MSALeadFormModalsFormView({
                                application: application
                            ,   model: model
                            });

                            setTimeout(function() {
                                Layout.showInModal(modalView);
                            }, delay);
                        // })
                    });

                }

            }
        }
    }
});