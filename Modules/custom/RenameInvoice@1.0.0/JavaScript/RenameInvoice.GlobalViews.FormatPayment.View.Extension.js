define('RenameInvoice.GlobalViews.FormatPayment.View.Extension'
,   [
        'GlobalViews.FormatPaymentMethod.View'
    ,   'underscore'
    ,   'SC.Configuration'
    ]
,   function
    (
        GlobalViewsFormatPaymentMethodView
    ,   _
    ,   Configuration
    )
{
    'use strict';

    return _.extend(GlobalViewsFormatPaymentMethodView.prototype, {

        getContext: _.wrap(GlobalViewsFormatPaymentMethodView.prototype.getContext, function(fn) {

            var returnObj = fn.apply(this, _.toArray(arguments).splice(1))
            ,   invoiceNewName
            ,   paymentTerms;

            if (returnObj.hasOwnProperty('isInvoice') && returnObj.isInvoice) {

                invoiceNewName = Configuration.get('checkoutApp.renameInvoice');

                if (invoiceNewName) {

                    paymentTerms = this.model.get('paymentterms');
                    paymentTerms.name = invoiceNewName;
                    this.model.set('paymentterms', paymentTerms);
                }
            }

            return returnObj;
        })
    })
});