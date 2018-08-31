define('ProductLine.Extension'
,   [
        'ProductLine.Stock.Cart.View'
    ]
,   function
    (
        ProductLineStockCartView
    )
{
    'use strict';

    return {
        ProductLineStockCartView: ProductLineStockCartView
    }
});