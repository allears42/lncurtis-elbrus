/**

 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define(['N/runtime', 'N/record'], function (runtime, record) {

    function copyShipping(context)
    {
        var ts = Date.now();
        log.debug('Entering copyShipping');
        log.debug('Execution Context', runtime.executionContext);
        if (runtime.executionContext === "WEBSTORE") {

            try {
                var newRecord = context.newRecord;
                log.debug('session data', runtime.getCurrentSession().get({name: 'packageMethods'}))

                var totalShipping = 0, totalCost = 0;
                var packageMethods = JSON.parse(runtime.getCurrentSession().get({name: 'packageMethods'}));

                //log.debug('package methods length', packageMethods.length);
                if (packageMethods) {
                    for (var i = 0; i < packageMethods.length; i++) {
                        totalShipping += packageMethods[i].method.rate;
                        totalCost += packageMethods[i].method.cost;
                    }
                }
                log.debug('total shipping', totalShipping);
                log.debug('total cost', totalCost);
                log.debug('shippingcost before', newRecord.getValue({fieldId: "shippingcost"}));
                var preupdateShipping = newRecord.getValue({fieldId: "shippingcost"});
                var preupdateTotal = newRecord.getValue({fieldId: "total"});
                newRecord.setValue({
                    fieldId: "shippingcost",
                    value: totalShipping
                });
                /*newRecord.setValue({
                    fieldId: "ismultishipto",
                    value: true
                });*/

                newRecord.setValue({
                    fieldId: "altshippingcost",
                    value: totalShipping
                });

                if (packageMethods && packageMethods.length === 1) {
                    newRecord.setValue({
                        fieldId: "shipmethod",
                        value: packageMethods[0].method.internalid
                    });
                }
                newRecord.setValue({
                    fieldId: "custbody_pacejet_freight_cost",
                    value: totalCost
                });
                newRecord.setValue({
                    fieldId: "custbody_pacejet_freight_price",
                    value: totalShipping
                });
                newRecord.setValue({
                    fieldId: "custbody_pacejet_freight_costcurrency",
                    value: totalCost
                });
                newRecord.setValue({
                    fieldId: "custbody_pacejet_freight_pricecurrency",
                    value: totalShipping
                });


                var shipgroupCount = newRecord.getLineCount({sublistId: "shipgroup"});
                log.debug('shipgroupcount', shipgroupCount)

                for (var j = 0; j < shipgroupCount; j++) {
                    var lineAddress = newRecord.getSublistValue({
                        sublistId: 'shipgroup',
                        fieldId: 'destinationaddressref',
                        line: j
                    });
                    log.debug('line address for group ' + j, lineAddress)

                    for (var i = 0; i < packageMethods.length; i++) {
                        if (lineAddress == packageMethods[i].address) {
                            log.debug('setting rate for ' + lineAddress, packageMethods[i].method.rate)
                            newRecord.setSublistValue({
                                sublistId: 'shipgroup',
                                fieldId: 'shippingrate',
                                line: j,
                                value: packageMethods[i].method.rate
                            });
                            break;
                        }
                    }

                }

                if(newRecord.getValue({fieldId: "custbody_pick_up_in_store"}) === true) {
                    log.debug('custbody_pick_up_in_store', newRecord.getValue({fieldId: "shipmethod"}));

                    newRecord.setValue({
                        fieldId: "shipmethod",
                        value: "40"
                    });
                }

                log.debug('shippingcost after', newRecord.getValue({fieldId: "shippingcost"}));
            }
            catch (err) {
                log.debug("error updating ship costs", err);
            }
        }

        log.debug('SetPJShipping time elapsed', Date.now() - ts);
    }

    return {
        beforeSubmit: copyShipping
    };

});