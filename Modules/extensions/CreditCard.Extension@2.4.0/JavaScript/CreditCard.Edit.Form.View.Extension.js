/*
	© 2017 LN Curtis
	Custom extension logic for CreditCard.Edit.Form.View.Extension
*/

define(
	'CreditCard.Edit.Form.View.Extension'
,	[
		'CreditCard.Edit.Form.View'

	,	'underscore'

	]
,	function(
        CreditCardEditFormView

	, 	_

	)
{
	'use strict';
	
	_.extend( CreditCardEditFormView.prototype, {

        getContext: function ()
        {
            var selected_payment_method = this.model.get('paymentmethod')
                ,	self = this
                ,	paymentMethods = _.map(_.where(Configuration.get('siteSettings.paymentmethods', []), {creditcard: 'T'}), function (paymentmethod)
            {
                //@class CreditCard.PaymentMetod
                return {
                    //@property
                    hidden: !(self.model.isNew() || selected_payment_method && paymentmethod.key === selected_payment_method.key)
                    ,	icon: paymentmethod.imagesrc
                    ,   iconClass: (paymentmethod.name.toLowerCase().indexOf('american') > -1) ? "amex" : paymentmethod.name.toLowerCase().replace(/ /g, '')
                    ,	internalid: paymentmethod.internalid
                    ,	key: paymentmethod.key
                    ,	name: paymentmethod.name
                    ,	selected: selected_payment_method && paymentmethod.key === selected_payment_method.key
                };
            })
                ,	months = _.map(this.options.months, function(month)
            {
                return {
                    month: month
                };
            })
                ,	years = _.map(this.options.years, function(year)
            {
                return {
                    year: year
                    ,	disabled: year === self.options.expyear
                };
            })
                ,	ccnumber = this.model.get('ccnumber');

            // temporal credit card.
            if (ccnumber && !~ccnumber.indexOf('*'))
            {
                ccnumber = '************' + ccnumber.substring(ccnumber.length - 4);
            }

            //@class CreditCard.Form.View.Context
            return {
                //@property {Array<CreditCard.PaymentMetod>} paymentMethods
                paymentMethods: paymentMethods
                //@property {String} paymentMethodValue
                , 	paymentMethodValue: selected_payment_method ? selected_payment_method.key : ''
                //@property {String} ccnumber
                ,	ccnumber: ccnumber
                //@property {boolean} showPaymentSelector
                ,	showPaymentSelector: this.model.isNew()
                //@property {Boolean} isNew
                ,	isNew: this.model.isNew()
                //@property {Array<Object>?} months
                ,	months: months
                //@property {Array<Object>?} years
                ,	years: years
                //@property {Boolean} showDefaults
                ,	showDefaults: !!this.options.showDefaults
                //@property {String} ccname
                ,	ccname: this.model.get('ccname')
                //@property {Boolean} ccdefault
                ,	ccdefault: this.model.get('ccdefault') === 'T'
                //@property {Boolean} showSecurityCode
                ,	showSecurityCodeForm: !!this.options.showSecurityCodeForm
                //@property {Boolean} showSaveCreditCardCheckbox
                ,	showSaveCreditCardCheckbox: !!this.options.showSaveCreditCardCheckbox && (this.model.isNew() || this.model.get('internalid') === '-temporal-')
                //@property {Boolean} saveCreditCardByDefault
                ,	saveCreditCardByDefault: this.model.get('internalid') === '-temporal-' ? false : !!this.options.saveCreditCardByDefault
            };
        }

	});

});
