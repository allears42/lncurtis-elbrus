IS_PROCESSING = false;

function SetPJShipping(type, name)
{

    try {

        if (nlapiGetContext().getExecutionContext() !== 'webstore') {
            return true
        }

        var userId = nlapiGetUser();
        if (userId && userId !== -4) {
            if (name === 'custbody_pacejet_shipping_price_hidden') {
                if (IS_PROCESSING) {
                    nlapiLogExecution('debug', "isprocessing quitting");
                    return true
                }

                IS_PROCESSING = true;

                var pjPrice = nlapiGetFieldValue('custbody_pacejet_shipping_price_hidden');
                nlapiSetFieldValue('shippingcost', pjPrice);
                nlapiLogExecution('debug', "set ship cost", pjPrice);

                var packageMethods = JSON.parse(nlapiGetContext().getSessionObject('packageMethods'));
                var totalShipping = 0, totalCost = 0;

                nlapiLogExecution('debug', "package methods", JSON.stringify(packageMethods));
                if (packageMethods && packageMethods[0] && packageMethods[0].method) {
                    nlapiLogExecution('debug', "inside if");

                    if (packageMethods[0].method.internalid) nlapiSetFieldValue('shipmethod', packageMethods[0].method.internalid);
                    nlapiSetFieldValue('custbody_pacejet_freight_cost', packageMethods[0].method.cost);
                    nlapiSetFieldValue('custbody_pacejet_freight_costcurrency', packageMethods[0].method.cost);
                    nlapiSetFieldValue('custbody_pacejet_freight_price', packageMethods[0].method.rate);
                    nlapiSetFieldValue('custbody_pacejet_freight_pricecurrency', packageMethods[0].method.rate);

                }
                nlapiLogExecution('debug', "finished setting fields" );

                /*
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
                */

                /*if (pjPrice) {
                    nlapiSetFieldValue('shippingcost', pjPrice);
                    nlapiSetFieldValue('shipmethod', 4);


                }*/
                IS_PROCESSING = false;

            }
        }
        else {
            //nlapiLogExecution('debug', "user not logged in");
        }
    }
    catch (err) {
        nlapiLogExecution('error', "error in CS field change", err);
    }
}
