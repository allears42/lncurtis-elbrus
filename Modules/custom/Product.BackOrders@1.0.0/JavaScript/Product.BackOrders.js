/*
	© 2017 LN Curtis
*/

define(
    'Product.BackOrders'
    ,	[
        'Cart.AddToCart.Button.View.BackOrders'
	,   'Cart.Detailed.View.BackOrders'
	,   'Cart.Item.Summary.View.BackOrders'
	,   'Cart.Lines.View.BackOrders'
	,   'ProductDetails.Quantity.View.BackOrders'

    ,	'underscore'
    ]
    ,	function(
		CartAddToCartButtonViewBackOrders
	,   CartDetailedViewBackOrders
	,   CartItemSummaryViewBackOrders
	,   CartLinesViewBackOrders
	,   ProductDetailsQuantityViewBackOrders
    )
    {
        'use strict';

        return {
	        CartAddToCartButtonViewBackOrders: CartAddToCartButtonViewBackOrders
        ,   CartDetailedViewBackOrders: CartDetailedViewBackOrders
        ,   CartItemSummaryViewBackOrders: CartItemSummaryViewBackOrders
        ,   CartLinesViewBackOrders: CartLinesViewBackOrders
        ,   ProductDetailsQuantityViewBackOrders: ProductDetailsQuantityViewBackOrders
        }
    });
