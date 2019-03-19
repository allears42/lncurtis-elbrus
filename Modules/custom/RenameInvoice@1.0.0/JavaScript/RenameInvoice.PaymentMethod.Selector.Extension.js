define('RenameInvoice.PaymentMethod.Selector.Extension'
,   [
        'OrderWizard.Module.PaymentMethod.Selector'
    ,   'underscore'
    ,   'SC.Configuration'
    ]
,   function
    (
        OrderWizardModulePaymentMethodSelector
    ,   _
    ,   Configuration
    )
{
    'use strict';

    return _.extend(OrderWizardModulePaymentMethodSelector.prototype, {

        initialize: _.wrap(OrderWizardModulePaymentMethodSelector.prototype.initialize, function(fn) {

            var invoiceNewName = Configuration.get('checkoutApp.renameInvoice');

            fn.apply(this, _.toArray(arguments).slice(1));

            if (invoiceNewName) {

                _.each(this.modules, function(module) {

                    if (module.name == 'Invoice') {
                        module.name = invoiceNewName;
                    }
                });
            }
        })
    })
});