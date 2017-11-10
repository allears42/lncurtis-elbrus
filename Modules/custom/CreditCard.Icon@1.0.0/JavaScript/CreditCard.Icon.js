/*
 © 2017 Satellite Commerce
 Adds icons in place of images in credit card modules
 */

// @module CreditCard

define('CreditCard.Icon',
    [
        'CreditCard.Edit.Form.Icon.View',
        'CreditCard.Icon.View',
        'GlobalViews.FormatPaymentMethod.Icon.View'
    ],
    function (
        CreditCardEditFormIconView,
        CreditCardIconView,
        GlobalViewsFormatPaymentMethodIconView
    ){
        'use strict';

        return {
            CreditCardEditFormIconView: CreditCardEditFormIconView,
            CreditCardIconView: CreditCardIconView,
            GlobalViewsFormatPaymentMethodIconView: GlobalViewsFormatPaymentMethodIconView
        }
    }
);