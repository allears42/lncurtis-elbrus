/*
	© 2017 LN Curtis
*/

define(
    'ProductList.Router.Extension'
    ,	[
        'ProductList.Router'

    ,	'underscore'

    ]
    ,	function(
        ProductListRouter

    , 	_

    )
    {
        'use strict';

        _.extend( ProductListRouter.prototype, {

            routes: _.extend({}, ProductListRouter.prototype.routes,
            {
                // add url mappings for product list instead of wishlist
                'productlist': 'showProductListsList'
            ,	'productlist/?*options': 'showProductListsList'
            ,	'productlist/:id': 'showProductListDetails'
            ,	'productlist/:id/?*options': 'showProductListDetails'
            })

        });

    });
