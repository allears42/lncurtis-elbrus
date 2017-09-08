/*
	© 2017 LN Curtis
*/

define(
    'ProductDetails.Extension'
    ,	[
        'ProductDetails.Base.View.Extension'
    ,   'ProductDetails.Full.View.Extension'
    ,   'ProductDetails.Information.View.Extension'
    ,   'ProductDetails.QuickView.View.Extension'

    ,	'underscore'
    ]
    ,	function(
        ProductDetailsBaseViewExtension
    ,   ProductDetailsFullViewExtension
    ,   ProductDetailsInformationViewExtension
    ,   ProductDetailsQuickViewViewExtension
    ,	_
    )
    {
        'use strict';

        return {
            ProductDetailsBaseViewExtension: ProductDetailsBaseViewExtension
        ,   ProductDetailsFullViewExtension: ProductDetailsFullViewExtension
        ,   ProductDetailsInformationViewExtension: ProductDetailsInformationViewExtension
        ,   ProductDetailsQuickViewViewExtension: ProductDetailsQuickViewViewExtension
        }
    });
