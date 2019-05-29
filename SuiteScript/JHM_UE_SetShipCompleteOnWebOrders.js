/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */

/**
 * Company            JHM Services LLC
 * Type               Suitelet
 * ID				  customscript_jhm_ue_setshipcompleteonweb
 * Deployments		  customdeploy_jhm_ue_setshipcompleteonweb
 * Description        On web orders, if custom 'ship complete' field value is true, sets native 'ship complete' field
 *                    value to true. Workaround for commerce API inability to set values on unexposed native fields.
 * Governance
 * Changelog          JHM Services      4-17-19    Created script

 **/

define(['N/record', 'N/runtime', 'N/log'],

    function(record, runtime, log) {

        function beforeSubmit(context) {

            var salesOrder
            ,   webShipComplete;

            if (context.type === context.UserEventType.CREATE && runtime.executionContext === runtime.ContextType.WEBSTORE) {

                try {
                    salesOrder = context.newRecord;
                    webShipComplete = salesOrder.getValue({fieldId: 'custbody_jhm_ship_complete_web'});

                    if (webShipComplete && webShipComplete == true) {
                        salesOrder.setValue({
                            fieldId: 'shipcomplete'
                        ,   value: true
                        })
                    }

                } catch(e) {
                    log.error({title: 'Unable to update web ship complete value', details: e});
                }
            }

        }

        return {
            beforeSubmit: beforeSubmit
        }
    }
);