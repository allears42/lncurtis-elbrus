define('MSALeadFormModals.ServiceController'
,   [
        'ServiceController'
    ,	'SC.Models.Init'
    ]
,   function
    (
        ServiceController
    ,	ModelsInit
    )
{
    'use strict';

    return ServiceController.extend({

        name: 'MSALeadFormModals.ServiceController'

    ,   supportGroupMap: {
            '2': 75640
        ,   '3': 263258
        }

    ,   get: function() {

            var campaignId = this.request.getParameter('campaignId')
            ,   returnObj = {}
            ,   filters = []
            ,   searchResults
            ,   columns = []
            ,   imageId
            ,   imageFile;

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

                    returnObj.campaignTitle = searchResults[0].getValue('custrecord_jhm_msa_lead_cam_title');
                    returnObj.desc = searchResults[0].getValue('custrecord_jhm_msa_lead_cam_desc');
                    returnObj.items = searchResults[0].getValue('custrecord_jhm_msa_lead_cam_items');
                    returnObj.custevent_jhm_msa_lead_campaign = campaignId;
                    returnObj.incomingmessage = 'MSA LEAD CAMPAIGN SUBMISSION';
                    returnObj.title = 'MSA LEAD CAMPAIGN SUBMISSION';
                    returnObj.subsidiary = nlapiGetContext().getSubsidiary();

                    imageId = searchResults[0].getValue('custrecord_jhm_msa_lead_cam_image');

                    if (imageId) {

                        imageFile = nlapiLoadFile(imageId);
                        returnObj.imagePath = imageFile.path;
                    }

                    returnObj.status = 200;
                }

            }

            return returnObj;
        }

    ,   post: function() {

            // var url
            // ,   response
            // ,   responseCode;

            // url = SC.Configuration.msaLeadCampaigns.externalUrl;

            // try {
            //
            //     response = nlapiRequestURL(url, this.data);
            //     responseCode = parseInt(response.getCode(), 10);
            //
            //     // Just in case someday it accepts the redirect. 206 is netsuite error ('partial content')
            //     if (responseCode === 200 || responseCode === 302 || responseCode === 201 || responseCode === 404) {
            //         return {
            //             successMessage: this.successMessage
            //         }
            //     }
            //
            // } catch(e) {
            //
            //     // The 'successful' exception is a redirect error, so let's intercept that
            //     if (e instanceof nlobjError && e.getCode().toString() === 'ILLEGAL_URL_REDIRECT')
            //     {
            //         return {
            //             successMessage: this.successMessage
            //         };
            //
            //         // Finally, let's catch any other error that may come
            //         return {
            //
            //             status: 500
            //         , 	code: 'ERR_FORM'
            //         , 	message: 'There was an error submitting the form, please try again later'
            //         }
            //     }
            // }


            // TODO: TEST IF THIS WORKS, THEN REFACTOR
            // TODO: ADD ERROR HANDLING
            var returnObj = {status: 400}
            ,   leadValuesObj
            ,   siteId = ModelsInit.session.getSiteSettings(['siteid']).siteid || 2 // lncurtis.com
            ,   caseValuesObj
            ,   dupeSearchResults
            ,   filters = []
            ,   entityId
            ,   leadRec
            ,   isNewLead = false
            ,   caseRec;

            leadValuesObj = {
                isperson: 'T'
            ,   custentity_customer_class: 1 	// LN Curtis and sons
            ,   salesrep: 53161 	// LNCS Pacific North
            ,   category: 8 	// Person
            ,   custentity_accountclass: 3 	// C
            ,   custentity_targetmarket: 1 	// Fire
            ,   custentity_salesregion: 1 	// Pacific North
            ,   custentity_internal_notes: 'Lead created from MSA lead form for siteid ' + siteId
            ,   subsidiary: 1 	// LN Curtis & sons
            ,   custentity_department: 36 	// 001 - LNCS Oakland
            ,   entitystatus: 6 	// LEAD-Unqualified
            ,   customform: 67    // LNCS CUSTOMER - CS
            ,   companyname: this.data.firstname + ' ' + this.data.lastname
            ,   accessrole: 1085  // WEB B2C CUSTOMER CENTER
            ,   custentity_subtype: 17  // LNCurtis.com
            ,   custentity_website_source : this.data.siteid || 2 //lncurtis.com
            ,   firstname: this.data.firstname
            ,   lastname: this.data.lastname
            ,   email: this.data.email
            };

            filters.push(new nlobjSearchFilter('email', null, 'is', this.data.email));
            filters.push(new nlobjSearchFilter('subsidiary', null, 'is', 1));

            dupeSearchResults = nlapiSearchRecord('customer', null, filters, null);

            if (dupeSearchResults && dupeSearchResults.length) {
                entityId = dupeSearchResults[0].getId();
            } else {

                try {

                    leadRec = nlapiCreateRecord('lead');

                    for (var key in leadValuesObj) {
                        leadRec.setFieldValue(key, leadValuesObj[key]);
                    }

                    entityId = nlapiSubmitRecord(leadRec);
                    isNewLead = true;
                } catch (e) {
                    nlapiLogExecution('ERROR', 'Error creating lead record', e);
                }

            }
            nlapiLogExecution('DEBUG', 'ENTITY ID', entityId);
            nlapiLogExecution('DEBUG', 'IS NEW LEAD?', isNewLead.toString());

            if (entityId) {

                caseValuesObj = {
                    company: entityId
                ,   helpdesk: false
                ,   status: 1
                ,   profile: 1
                ,   origin: '-5'
                ,   assigned: this.supportGroupMap[siteId]
                ,   issue: 10 // TODO Add a custom issue here
                ,   title: this.data.title
                ,   custevent_jhm_msa_lead_campaign: this.data.custevent_jhm_msa_lead_campaign
                ,   incomingmessage: this.data.incomingmessage
                ,   firstname: this.data.firstname
                ,   lastname: this.data.lastname
                ,   email: this.data.email
                ,   custevent_jhm_zip_code: this.data.custevent_jhm_zip_code
                };

                try {

                    caseRec = nlapiCreateRecord('supportcase');

                    for (var key in caseValuesObj) {
                        caseRec.setFieldValue(key, caseValuesObj[key]);
                    }

                    nlapiSubmitRecord(caseRec);

                    if (isNewLead) {
                        nlapiSubmitField('lead', entityId, 'entitystatus', 6);
                    }

                    returnObj.status = 200;
                } catch (e) {
                    nlapiLogExecution('ERROR', 'Error creating MSA lead form support case', e);
                }



            }

            return returnObj;
        }

    });
});