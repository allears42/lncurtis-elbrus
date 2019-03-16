/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */
define(['N/record', 'N/runtime', 'N/search', '/SuiteScripts/lib/underscore-min'],
    function(record, runtime, search, _) {
        function onRequest(context) {
            log.debug({title: 'ss_createCase', details: 'start'});

            var ret = { error: true }
                , leadOrCustomerId
                , caseId
                , isNewLead = false;

            try {
                if (context.request.method === 'POST') {

                    var enteredValues = JSON.parse(context.request.body);
                    log.debug({title: 'enteredValues', details: JSON.stringify(enteredValues,null,2)});

                    var defaultValues = {
                        // default lead attributes
                        isperson: 'T'
                        , custentity_customer_class: 1 	// LN Curtis and sons
                        , salesrep: 53161 	// LNCS Pacific North
                        , category: 8 	// Person
                        , custentity_accountclass: 3 	// C
                        , custentity_targetmarket: 1 	// Fire
                        , custentity_salesregion: 1 	// Pacific North
                        , custentity_internal_notes: 'Lead created from customer service form for siteid ' + enteredValues['siteid'] || 2 //lncurtis.com
                        , subsidiary: 1 	// LN Curtis & sons
                        , custentity_department: 36 	// 001 - LNCS Oakland
                        , entitystatus: 6 	// LEAD-Unqualified
                        , customform: 67    // LNCS CUSTOMER - CS
                        , companyname: enteredValues['firstname'] + ' ' + enteredValues['lastname']
                        , accessrole: 1085  // WEB B2C CUSTOMER CENTER
                        , custentity_subtype: 17  // LNCurtis.com
                        , custentity_website_source : enteredValues['siteid'] || 2 //lncurtis.com

                        // default case attributes
                    };
                    log.debug({title: 'defaultValues', details: JSON.stringify(defaultValues,null,2)});

                    var combinedValues = _.extend({}, defaultValues, enteredValues);
                    log.debug({title: 'combinedValues', details: JSON.stringify(combinedValues,null,2)});

                    if (combinedValues.issue == "1") {      // Billing Issue
                        combinedValues.assigned = 53140;    // Static Employee Group: Accounting Support
                    }
                    else if (combinedValues.custentity_website_source == 3) {
                        combinedValues.assigned = 263258;        // Static Employee Group: curtisblueline.com Support
                    }
                    else {
                        combinedValues.assigned = 75640;        // Static Employee Group: LNCurtis.com Support
                    }

                    // Change general inquiry message type for CBL to Website Issue - CBL.com
                    if (combinedValues.issue == "9" && combinedValues.custentity_website_source == 3) {
                        combinedValues.issue = "11";
                    }

                    // duplicate email check

                    var dupCheck = search.create({
                        type: search.Type.CUSTOMER,
                        columns: [ 'email' ],
                        filters: [
                            ['email', 'is', combinedValues.email],
                            'AND',
                            ['subsidiary', 'is', defaultValues.subsidiary]
                        ]
                    }).run().getRange({ start: 0, end: 1 });

                    log.debug({title: 'dupCheck.length', details: dupCheck.length});

                    if (dupCheck.length > 0) {
                        var existingResult = dupCheck[0];
                        log.debug({title: 'existingResult.id', details: existingResult.id});
                        leadOrCustomerId = existingResult.id;
                    }

                    else {
                        // Create/update lead record

                        var newLead = record.create({
                            type: record.Type.LEAD,
                            isDynamic: false
                        });

                        var customerKeys = [
                            // 'customform'
                            'firstname'
                            , 'lastname'
                            , 'email'
                            , 'isperson'
                            , 'custentity_customer_class'
                            , 'salesrep'
                            , 'category'
                            , 'custentity_accountclass'
                            , 'custentity_targetmarket'
                            , 'custentity_salesregion'
                            , 'custentity_internal_notes'
                            , 'subsidiary'
                            , 'custentity_department'
                            , 'entitystatus'
                            , 'companyname'
                            , 'accessrole'
                            , 'custentity_subtype'
                            , 'custentity_website_source'
                        ];

                        customerKeys.forEach(function (key) {
                            combinedValues[key] && newLead.setValue({
                                fieldId: key
                                , value: combinedValues[key]
                            });
                        });
                        //newLead.setValue({ fieldId: 'isperson', value: 'T' });

                        log.debug({title: 'newLead.create: newLead', details: newLead});

                        try {
                            leadOrCustomerId = newLead.save({
                                enableSourcing: false,
                                ignoreMandatoryFields: false
                            });
                            isNewLead = true;
                        }
                        catch (e) {
                            // unexpected error, need to decide how to handle error.  probably log and swallow them quietly.
                            log.debug({title: 'newLead.save exception', details: JSON.stringify(e,null,2)});
                        }
                    }

                    // create case here

                    log.debug({title: 'leadOrCustomerId', details: leadOrCustomerId});

                    if (leadOrCustomerId) {
                        try {
                            log.debug({title: 'Start createCase', details: new Date().getTime()});

                            var newCase = record.create({
                                type: record.Type.SUPPORT_CASE,
                                isDynamic: false
                            });

                            var caseKeys = [
                                'title'
                                , 'issue'
                                , 'incomingmessage'
                                , 'assigned'
                            ];

                            caseKeys.forEach(function (key) {
                                combinedValues[key] && newCase.setValue({
                                    fieldId: key
                                    , value: combinedValues[key]
                                });
                                log.debug({title: 'set caseKey', details: 'key = ' + key + ', combinedValues[key] = ' + combinedValues[key]});
                            });
                            newCase.setValue({ fieldId: 'company', value: leadOrCustomerId });
                            newCase.setValue({ fieldId: 'helpdesk', value: false });
                            newCase.setValue({ fieldId: 'status', value: 1 });
                            newCase.setValue({ fieldId: 'profile', value: 1 });
                            newCase.setValue({ fieldId: 'origin', value: -5 });

                            log.debug({title: 'newCase.create: newCase', details: newCase});

                            try {
                                caseId = newCase.save({
                                    enableSourcing: false,
                                    ignoreMandatoryFields: false
                                });
                            }
                            catch (e) {
                                // unexpected error, need to decide how to handle error.  probably log and swallow them quietly.
                                log.debug({title: 'newCase.save exception', details: JSON.stringify(e,null,2)});
                            }

                            ret.error = false;

                            // if this is a new lead, reset the entitystatus to 6 since it has been changed by the case system.
                            if (isNewLead) {
                                try {
                                    var updatedId = record.submitFields({
                                        type: record.Type.CUSTOMER
                                        , id: leadOrCustomerId
                                        , values: { entitystatus: 6 }
                                    });
                                    log.debug({title: 'update new customer entitystatus to 6', details: 'updatedId = ' + updatedId});
                                }
                                catch (e) {
                                    log.error({title: 'Exception updating customer entitystatus', details: e});
                                }
                            }
                        }
                        catch (e) {
                            log.error({title: 'Exception', details: e});
                        }

                        log.debug({title: 'Returning caseId', details: caseId});
                    }

                    // return caseId;


                }
                else {
                    // Not a POST, ignore and return an error
                }
            }
            catch (e) {
                log.error({title: 'ss_createCase: exception', details: e});
            }

            log.debug({title: 'ss_createCase: returning ', details: JSON.stringify(ret,null,2)});
            context.response.write(JSON.stringify(ret));

            log.debug({title: 'End', details: new Date().getTime()});
        }
        return {
            onRequest: onRequest
        };
    });
