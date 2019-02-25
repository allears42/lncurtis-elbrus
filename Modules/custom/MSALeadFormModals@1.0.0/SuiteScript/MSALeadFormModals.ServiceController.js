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
            ,   columns = []
            ,   imageId
            ,   imageFile
            ,   imageUrl;

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
                    returnObj.items = searchResults[0].getValue('custrecord_jhm_msa_lead_cam_items');

                    imageId = searchResults[0].getValue('custrecord_jhm_msa_lead_cam_image');

                    if (imageId) {

                        imageFile = nlapiLoadFile(imageId);
                        imageUrl = imageFile.getURL();
                        returnObj.imagePath = imageUrl;
                    }

                    returnObj.status = 200;
                }

            }

            return returnObj;
        }

    ,   post: function() {

            nlapiLogExecution('DEBUG', 'CHECKPOINT 1', 'ENTER POST');
            var url
            ,   response
            ,   responseCode;

            url = SC.Configuration.msaLeadCampaigns.externalUrl;
            nlapiLogExecution('DEBUG', 'CHECKPOINT 2: DATA', JSON.stringify(this.data));

            try {

                response = nlapiRequestURL(url, this.data);
                responseCode = parseInt(response.getCode(), 10);
                nlapiLogExecution('DEBUG', 'CHECKPOINT 3: response', responseCode.toString());

                // Just in case someday it accepts the redirect. 206 is netsuite error ('partial content')
                if (responseCode === 200 || responseCode === 302 || responseCode === 201 || responseCode === 404) {
                    return {
                        successMessage: this.successMessage
                    }
                }

            } catch(e) {

                // The 'successful' exception is a redirect error, so let's intercept that
                if (e instanceof nlobjError && e.getCode().toString() === 'ILLEGAL_URL_REDIRECT')
                {
                    return {
                        successMessage: this.successMessage
                    };

                    // Finally, let's catch any other error that may come
                    return {

                        status: 500
                    , 	code: 'ERR_FORM'
                    , 	message: 'There was an error submitting the form, please try again later'
                    }
                }
            }
        }

    });
});