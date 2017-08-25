/*
	© 2017 LN Curtis
*/

define(
    'ProductList.Item.Edit.View.Extension'
    ,	[
        'ProductList.Item.Edit.View'
    ,   'LiveOrder.Model'

    ,	'underscore'
    ]
    ,	function(
        ProductListItemEditView
    ,   LiveOrderModel
    ,	_
    )
    {
        'use strict';

        _.extend( ProductListItemEditView.prototype, {

            /* todo@rob:
                this is where you've stopped to investigate "updateInventory" and
                the failure when changing inventory in the cart
            */

        })

    });
