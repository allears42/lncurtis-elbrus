/*
	© 2017 LN Curtis
*/

define(
    'ProductDetails.Extension'
    ,	[
        'ProductDetails.Base.View.Extension'
    ,   'ProductDetails.Options.Selector.View.Extension'

    ,	'underscore'
    ]
    ,	function(
        ProductDetailsBaseViewExtension
    ,   ProductDetailsOptionsSelectorViewExtension
    ,	_
    )
    {
        'use strict';

        return {
            ProductDetailsBaseViewExtension: ProductDetailsBaseViewExtension
        ,   ProductDetailsOptionsSelectorViewExtension: ProductDetailsOptionsSelectorViewExtension
        }
    });
