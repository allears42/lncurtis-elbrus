define('CreditCard.Extension'
,   [
        'CreditCard.Edit.View.Extension'
    ,   'CreditCard.Model.Extension'
    ]
,   function
    (
        CreditCardEditViewExtension
    ,   CreditCardModelExtension
    )
{
    'use strict';

    return {
        CreditCardEditViewExtension: CreditCardEditViewExtension
    ,   CreditCardModelExtension: CreditCardModelExtension
    }
});