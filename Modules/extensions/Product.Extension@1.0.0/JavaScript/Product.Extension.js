/*
	© 2017 LN Curtis
*/

define(
    'Product.Extension'
    ,	[
        'Product.Model.Extension'

    ,	'underscore'
    ]
    ,	function(
		ProductModelExtension
    ,	_
    )
    {
        'use strict';

        return {
	        ProductModelExtension: ProductModelExtension
        }
    });
