/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define(['N/record', 'N/runtime', 'N/search', 'N/url', 'N/https'],
    function(record, runtime, search, url, https) {
        function afterSubmit(context) {
            if (context.type !== context.UserEventType.CREATE)
                return;

            var leadOrCustomerId = null,
                caseId = null,
                wf = context.newRecord;

            log.debug({title: 'wf', details: wf});

            try {
                log.debug({title: 'Start', details: new Date().getTime()});

                var defaultValues = {
                    firstname: wf.getValue('custrecord_form_cs_first'),
                    lastname: wf.getValue('custrecord_form_cs_last'),
                    email: wf.getValue('custrecord_form_cs_email'),
                    issue: wf.getValue('custrecord_form_cs_subject'),
                    title: wf.getValue('custrecord_form_cs_title'),
                    incomingmessage: wf.getValue('custrecord_form_cs_comments'),
                    siteid: wf.getValue('custrecord_form_cs_siteid')
                };
                log.debug({title: 'defaultValues', details: JSON.stringify(defaultValues,null,2)});

                // call available without login suitelet to bypass security issues with customer center role

                var scriptUrl = url.resolveScript({
                    scriptId: 'customscript_create_case_ss'
                    , deploymentId: 'customdeploy_create_case_ss'
                    , returnExternalUrl: true
                });
                log.debug({title: 'scriptUrl', details: JSON.stringify(scriptUrl,null,2)});

                var response = https.post({
                    url: scriptUrl
                    , body: JSON.stringify(defaultValues)
                    , headers: {
                        'Content-Type': 'application/json'
                        , 'Accept': 'application/json'
                    }
                });
                log.debug({title: 'response', details: response});

                log.debug({title: 'End', details: new Date().getTime()});
            }
            catch (e) {
                log.error({title: 'Exception', details: e});
            }

        }
        return {
            afterSubmit: afterSubmit
        };
    });