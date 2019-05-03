define('CreditCard.Model.Extension'
,   [
        'CreditCard.Model'
    ,   'SC.Configuration'
    ]
,   function
    (
        CreditCardModel
    ,   Configuration
    )
{
    'use strict';

    _.extend(CreditCardModel.prototype, {

        validation: _.extend({}, CreditCardModel.prototype.validation, {

            ccnumber: function (cc_number, attr, form)
                {

                    var luhn_check_is_valid = false
                    ,   card_type_check_is_valid = false
                    ,   payment_methods_configuration
                    ,   paymenthod_key
                    ,   paymentmethod;

                    // credit card number validation
                    // Validate CC number against Luhn algo and payment method regexes
                    if (!cc_number)
                    {
                        return _('Card Number is required').translate();
                    }

                    if (_.isUndefined(form.internalid))
                    {
                        cc_number = cc_number.replace(/\s/g, '');

                        // Check Luhn algorithm
                        luhn_check_is_valid = _(cc_number.split('').reverse()).reduce(function (a, n, index)
                        {
                            return a + _((+n * [1, 2][index % 2]).toString().split('')).reduce(function (b, o)
                            { return b + (+o); }, 0);
                        }, 0) % 10 === 0;

                        payment_methods_configuration = Configuration.get('paymentmethods');


                        // Validate cc number against available payment method regexes
                        _.each(payment_methods_configuration, function (payment_method_configuration)
                        {
                            if (payment_method_configuration.regex && payment_method_configuration.regex.test(cc_number))
                            {
                                paymenthod_key = payment_method_configuration.key;
                            }
                        });

                        paymentmethod = paymenthod_key && _.findWhere(Configuration.get('siteSettings.paymentmethods'), {key: paymenthod_key});

                        if (paymentmethod && paymentmethod.key) {
                            card_type_check_is_valid = true;
                        }


                        if (!luhn_check_is_valid)
                        {
                            // we throw an error if the number fails the regex or the Luhn algorithm
                            return _('Credit Card Number is invalid').translate();
                        }

                        if (!card_type_check_is_valid)
                        {
                            return _('Credit Card type is unsupported. Please use Visa, MasterCard, or American Express').translate();
                        }
                    }
                }

        })
    })
});