IS_PROCESSING = false;

function FieldChanged(type, name)
{
//TODO
    /*
        Create custom body field to trigger this
        Set body field with order.setCustomBodyField() in PJ module

        Check login - nlapiGetUser (userID or -4 )
        Confirm CS is running
        Update order.shippintotal from session.pacejettotal in CS


        test guest checkout (userID == 0)
        Confirm shipping total available before paypal call
    */
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
                nlapiLogExecution('debug', "setting shipping pj total", pjPrice);

                if (pjPrice) {
                    /*var preChangeShipping = nlapiGetFieldValue('shippingcost'),
                        preChangeTax = nlapiGetFieldValue('taxtotal'),
                        preChangeTotal = nlapiGetFieldValue('total');

                    nlapiLogExecution('debug', "prechange shipping", preChangeShipping);
                    nlapiLogExecution('debug', "prechange tax ", preChangeTax);
                    nlapiLogExecution('debug', "prechange total", preChangeTotal);

*/
                    nlapiSetFieldValue('shippingcost', pjPrice);

                    /*var midChangeTax = nlapiGetFieldValue('taxtotal')
                    var midChangeTotal = nlapiGetFieldValue('total')
                    nlapiLogExecution('debug', "midchange total ", midChangeTotal);
                    nlapiLogExecution('debug', "midchange tax ", midChangeTax);

                    //nlapiSetFieldValue('total', preChangeTotal - parseFloat(preChangeShipping - pjPrice) - parseFloat(preChangeTax - midChangeTax) );

                    var postChangeShipping = nlapiGetFieldValue('shippingcost'),
                        postChangeTax = nlapiGetFieldValue('taxtotal'),
                        postChangeTotal = nlapiGetFieldValue('total');
                    nlapiLogExecution('debug', "postchange shipping", postChangeShipping);
                    nlapiLogExecution('debug', "postchange tax ", postChangeTax);
                    nlapiLogExecution('debug', "postchange total", postChangeTotal);*/
                }
                IS_PROCESSING = false;

            }
        }
        else {
            nlapiLogExecution('debug', "user not logged in");
        }
    }
    catch (err) {
        nlapiLogExecution('error', "error in CS field change", err);
    }
}
