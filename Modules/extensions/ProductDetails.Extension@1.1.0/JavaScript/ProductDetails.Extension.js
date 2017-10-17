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
    ,   'ProductDetails.Base.View.OptionsFix'

    ,	'underscore'
    ]
    ,	function(
        ProductDetailsBaseViewExtension
    ,   ProductDetailsFullViewExtension
    ,   ProductDetailsInformationViewExtension
    ,   ProductDetailsQuickViewViewExtension
    ,   ProductDetailsBaseViewOptionsFix
    ,	_
    )
    {
        'use strict';

        return {
            ProductDetailsBaseViewExtension: ProductDetailsBaseViewExtension
        ,   ProductDetailsFullViewExtension: ProductDetailsFullViewExtension
        ,   ProductDetailsInformationViewExtension: ProductDetailsInformationViewExtension
        ,   ProductDetailsQuickViewViewExtension: ProductDetailsQuickViewViewExtension
        ,   ProductDetailsBaseViewOptionsFix: ProductDetailsBaseViewOptionsFix
        }
    });
