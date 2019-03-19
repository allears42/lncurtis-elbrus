define('RenameInvoice'
,   [
        'RenameInvoice.PaymentMethod.Selector.Extension'
    ,   'RenameInvoice.GlobalViews.FormatPayment.View.Extension'
    ]
,   function
    (
        RenameInvoicePaymentMethodSelectorExtension
    ,   RenameInvoiceGlobalViewsFormatPaymentViewExtension
    )
{
    'use strict';

    return {
        RenameInvoicePaymentMethodSelectorExtension: RenameInvoicePaymentMethodSelectorExtension
    ,   RenameInvoiceGlobalViewsFormatPaymentViewExtension: RenameInvoiceGlobalViewsFormatPaymentViewExtension
    }
});