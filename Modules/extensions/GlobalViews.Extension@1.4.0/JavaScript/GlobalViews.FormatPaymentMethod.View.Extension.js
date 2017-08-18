/*
	© 2017 LN Curtis
*/

define(
    'GlobalViews.FormatPaymentMethod.View.Extension'
    ,	[
        'GlobalViews.FormatPaymentMethod.View'

        ,	'underscore'
    ]
    ,	function(
        GlobalViewsFormatPaymentMethodView

        , 	_
    )
    {
        'use strict';

        _.extend( GlobalViewsFormatPaymentMethodView.prototype, {

            getContext: function()
            {
                var payment_methods = Configuration.get('siteSettings.paymentmethods')
                    ,	credit_card = this.model.get('creditcard')
                    ,	is_paypal = this.model.get('type') === 'paypal'
                    ,	is_credit_card = this.model.get('type') === 'creditcard' && credit_card && credit_card.ccnumber
                    ,	is_invoice = this.model.get('type') === 'invoice'
                    ,	is_gift_certificate = this.model.get('type') === 'giftcertificate'
                    ,	credit_card_payment_method_name = credit_card && credit_card.paymentmethod ? credit_card.paymentmethod.name : ''
                    , 	credit_card_payment_method_internalid = credit_card && credit_card.paymentmethod ? credit_card.paymentmethod.internalid : ''
                    , 	credit_card_payment_method_key = credit_card && credit_card.paymentmethod ? credit_card.paymentmethod.key : ''
                    ,	gift_certificate_ending = ''
                    ,	payment_method = credit_card_payment_method_key ? _.findWhere(payment_methods, {key: credit_card_payment_method_key}) : _.findWhere(payment_methods, {internalid: credit_card_payment_method_internalid})
                    ,	icon = payment_method && payment_method.imagesrc && payment_method.imagesrc[0]
                    ,   iconClass = payment_method && payment_method.name ? payment_method.name.toLowerCase().replace(/ /g, '') : "";


                if (payment_method && payment_method.name && payment_method.name.toLowerCase().indexOf('american') > -1) iconClass = "amex";

                if (is_gift_certificate)
                {
                    var code_length = this.model.get('giftcertificate').code.length;
                    gift_certificate_ending = this.model.get('giftcertificate').code.substring(code_length - 4, code_length);
                }

                // @class GlobalViews.FormatPaymentMethod.View.Context
                return {
                    // @property {Object} model
                    model: this.model
                    // @property {Boolean} showStreet
                    ,	showStreet: this.model.get('ccstreet') && this.showBillingInfo
                    // @property {Boolean} showZipCode
                    ,	showZipCode: this.model.get('cczipcode') && this.showBillingInfo
                    // @property {Boolean} isCreditcard
                    ,	isCreditcard: is_credit_card
                    // @property {Boolean} isGiftCertificate
                    ,	isGiftCertificate: is_gift_certificate
                    // @property {Boolean} isPaypal
                    ,	isPaypal: is_paypal
                    // @property {Boolean} isInvoice
                    ,	isInvoice: is_invoice
                    // @property {Boolean} isOther
                    ,	isOther: !is_invoice && !is_paypal && !is_credit_card && !is_gift_certificate
                    // @property {String} type
                    ,	type: this.model.get('type') || _('Not specified').translate()
                    // @property {String} name
                    ,	name: this.model.get('name') || _('Not specified').translate()
                    // @property {String} creditCardNumberEnding
                    ,	creditCardNumberEnding: credit_card && credit_card.ccnumber && credit_card.ccnumber.replace(/\*/g, '') || ''
                    // @property {String} showCreditCardImage
                    ,	showCreditCardImage: !!icon
                    // @property {String} creditCardImageUrl
                    ,	creditCardImageUrl: icon || ''
                    // @property {String} creditCardPaymentMethodName
                    ,	creditCardPaymentMethodName: credit_card_payment_method_name
                    // @property {Object} creditCard: credit_card
                    ,	creditCard: credit_card
                    // @property {String} giftCertificateEnding
                    ,	giftCertificateEnding: gift_certificate_ending
                    // @property {String} showPurchaseNumber
                    ,	showPurchaseNumber: !!this.model.get('purchasenumber')
                    ,   iconClass: iconClass

                };
            }

        });

    });
