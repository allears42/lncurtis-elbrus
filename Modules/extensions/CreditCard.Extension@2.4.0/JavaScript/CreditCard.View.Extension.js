/*
	© 2017 LN Curtis
	Custom extension logic for CreditCard.Edit.Form.View.Extension
*/

define(
	'CreditCard.View.Extension'
,	[
		'CreditCard.View'

	,	'underscore'

	]
,	function(
        CreditCardView

	, 	_

	)
{
	'use strict';
	
	_.extend( CreditCardView.prototype, {

        getContext: function ()
        {
            var payment_methods = Configuration.get('siteSettings.paymentmethods')
                ,	payment_method = this.model.get('paymentmethod').key ? _.findWhere(payment_methods, {key: this.model.get('paymentmethod').key}) : _.findWhere(payment_methods, {internalid: this.model.get('paymentmethod').internalid})
                ,	icon = payment_method && payment_method.imagesrc && payment_method.imagesrc[0]

                ,   iconClass = payment_method && payment_method.name ? payment_method.name.toLowerCase().replace(/ /g, '') : ""
                ,	expiration_month = this.model.get('expmonth');

            if (payment_method && payment_method.name && payment_method.name.toLowerCase().indexOf('american') > -1) iconClass = "amex";


            //console.log('payment_methods', payment_methods)

            //@class CreditCard.View
            return {
                //@property {String} creditCartId
                creditCartId: this.model.get('internalid')
                //@property {Boolean} showSecurityCodeForm
                ,	showSecurityCodeForm: !!this.options.showSecurityCodeForm
                // @property {String} showCreditCardImage
                ,	showCreditCardImage: !!icon
                // @property {String} creditCardImageUrl
                ,	creditCardImageUrl: icon || ''
                //@property {String} paymentName
                ,	paymentName: this.model.get('paymentmethod').name
                //@property {String} ccnumber
                ,	ccnumber: this.model.get('ccnumber').substring(this.model.get('ccnumber').length - 4)
                //@property {String} ccname
                ,	ccname: this.model.get('ccname')
                //@property {String} expirationDate
                ,	expirationDate: (expiration_month < 10 ? '0' : '') + expiration_month + '/' + this.model.get('expyear')
                //@property {Boolean} showDefaults
                ,	showDefaults: !!this.options.showDefaults
                //@property {Boolean} isDefaultCreditCard
                ,	isDefaultCreditCard: this.model.get('ccdefault') === 'T'
                //@property {Boolean} showSelect
                ,	showSelect: !!this.options.showSelect
                //@property {String} selectMessage
                ,	selectMessage: this.options.selectMessage
                //@property {Boolean} showActions
                ,	showActions: !!this.options.showActions
                ,   iconClass: iconClass
            };
        }

	});
});
