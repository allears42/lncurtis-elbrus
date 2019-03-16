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

            var returnObj = {status: 400}
            ,   siteId = ModelsInit.session.getSiteSettings(['siteid']).siteid || 2 // lncurtis.com
            ,   leadValuesObj
            ,   caseValuesObj
            ,   dupeSearchResults
            ,   entityId
            ,   isNewLead = false
            ,   caseId;

            this.siteId = siteId;

            leadValuesObj = this.getLeadValuesObj();
            dupeSearchResults = this.getDupeSearchResults();

            if (dupeSearchResults && dupeSearchResults.length) {
                entityId = dupeSearchResults[0].getId();
            } else {

                entityId = this.createNewRecord('lead', leadValuesObj);
                isNewLead = true;
            }

            if (entityId) {

                caseValuesObj = this.getCaseValuesObj(entityId);
                caseId = this.createNewRecord('supportcase', caseValuesObj);

                if (caseId) {

                    if (isNewLead) {
                        nlapiSubmitField('lead', entityId, 'entitystatus', 6);
                    }

                    returnObj.status = 200;
                }
            }

            return returnObj;
        }

    ,   createNewRecord: function(recordType, valuesObj)
        {
            var newRecord
            ,   recordId = null;

            try {
                newRecord = nlapiCreateRecord(recordType);

                for (var key in valuesObj) {
                    newRecord.setFieldValue(key, valuesObj[key]);
                }

                recordId = nlapiSubmitRecord(newRecord);
            } catch (e) {
                nlapiLogExecution('ERROR', 'Error creating new ' + recordType + ' record', e);
            }

           return recordId;
        }

    ,   getDupeSearchResults: function()
        {
            var filters = []
            ,   results = [];

            filters.push(new nlobjSearchFilter('email', null, 'is', this.data.email));
            filters.push(new nlobjSearchFilter('subsidiary', null, 'is', 1));

            try {
                results = nlapiSearchRecord('customer', null, filters, null);
            } catch (e) {
                nlapiLogExecution('ERROR', 'Error searching for duplicate MSA leads', e);
            }

            return results;
        }

    ,   getLeadValuesObj: function()
        {
            return {
                isperson: 'T'
            ,   custentity_customer_class: 1 	// LN Curtis and sons
            ,   salesrep: 53161 	// LNCS Pacific North
            ,   category: 8 	// Person
            ,   custentity_accountclass: 3 	// C
            ,   custentity_targetmarket: 1 	// Fire
            ,   custentity_salesregion: 1 	// Pacific North
            ,   custentity_internal_notes: 'Lead created from MSA lead form for siteid ' + this.siteId
            ,   subsidiary: 1 	// LN Curtis & sons
            ,   custentity_department: 36 	// 001 - LNCS Oakland
            ,   entitystatus: 6 	// LEAD-Unqualified
            ,   customform: 67    // LNCS CUSTOMER - CS
            ,   companyname: this.data.firstname + ' ' + this.data.lastname
            ,   accessrole: 1085  // WEB B2C CUSTOMER CENTER
            ,   custentity_subtype: 17  // LNCurtis.com
            ,   custentity_website_source : this.siteId
            ,   firstname: this.data.firstname
            ,   lastname: this.data.lastname
            ,   email: this.data.email
            };
        }

    ,   getCaseValuesObj: function(entityId)
        {
            return {
                company: entityId
            ,   helpdesk: false
            ,   status: 1
            ,   profile: 1
            ,   origin: '-5'
            ,   assigned: this.supportGroupMap[this.siteId]
            ,   issue: 14 // MSA Lead Form Submission
            ,   title: this.data.title
            ,   custevent_jhm_msa_lead_campaign: this.data.custevent_jhm_msa_lead_campaign
            ,   incomingmessage: this.data.incomingmessage
            ,   firstname: this.data.firstname
            ,   lastname: this.data.lastname
            ,   email: this.data.email
            ,   custevent_jhm_zip_code: this.data.custevent_jhm_zip_code
            }
        }

    });
});