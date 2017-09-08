/*
	© 2017 LN Curtis
*/

define(
    'Product.Options.Single'
    ,	[
        'Product.Model.Options.Single.Extension'
    ,   'ProductViews.Option.Single.View.Extension'
    ,   'ProductDetails.Options.Selector.View.Extension'
    ,   'ProductDetails.Base.View.Single.Extension'

    ,	'underscore'
    ]
    ,	function(
		ProductModelOptionsSingleExtension
    ,   ProductViewsOptionViewExtension
    ,   ProductDetailsOptionsSelectorViewExtension
    ,   ProductDetailsBaseViewSingleExtension
    ,	_
    )
    {
        'use strict';

        return {
	        ProductModelOptionsSingleExtension: ProductModelOptionsSingleExtension
        ,   ProductViewsOptionViewExtension: ProductViewsOptionViewExtension
        ,   ProductDetailsOptionsSelectorViewExtension: ProductDetailsOptionsSelectorViewExtension
        ,   ProductDetailsBaseViewSingleExtension: ProductDetailsBaseViewSingleExtension
        }
    });
