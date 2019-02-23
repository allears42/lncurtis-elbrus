define('MSALeadFormModals.ServiceController'
,   [
        'ServiceController'
    ]
,   function
    (
        ServiceController
    )
{
    'use strict';

    return ServiceController.extend({

        name: 'MSALeadFormModals.ServiceController'

    ,   get: function() {

            var campaignId = this.request.getParameter('campaignId')
            ,   returnObj = {}
            ,   filters = []
            ,   searchResults
            ,   columns = [];

            returnObj.status = 400;

            if (campaignId) {

                filters.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));
                filters.push(new nlobjSearchFilter('internalid', null, 'is', campaignId));

                columns.push(new nlobjSearchColumn('custrecord_jhm_msa_lead_cam_title'));
                columns.push(new nlobjSearchColumn('custrecord_jhm_msa_lead_cam_desc'));
                columns.push(new nlobjSearchColumn('custrecord_jhm_msa_lead_cam_image'));
                columns.push(new nlobjSearchColumn('custrecord_jhm_msa_lead_cam_items'));

                try {
                    searchResults = nlapiSearchRecord('customrecord_jhm_msa_lead_campaign', null, filters, columns);
                } catch(e) {
                    nlapiLogExecution('ERROR', 'Error retrieving MSA Lead Campaign', e);
                }

                if (searchResults && searchResults.length) {

                    returnObj.title = searchResults[0].getValue('custrecord_jhm_msa_lead_cam_title');
                    returnObj.desc = searchResults[0].getValue('custrecord_jhm_msa_lead_cam_desc');
                    returnObj.image = searchResults[0].getValue('custrecord_jhm_msa_lead_cam_image');
                    returnObj.items = searchResults[0].getValue('custrecord_jhm_msa_lead_cam_items');

                    returnObj.status = 200;
                }

            }

            return returnObj;
        }

    });
});