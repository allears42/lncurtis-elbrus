/*
	© 2017 LN Curtis
*/

define(
    'ProductDetails.Extension'
    ,	[
        'ProductDetails.Information.View.Extension'
    ,   'ProductDetails.Base.View.OptionsFix'
	,   'ProductDetails.Base.View.Extension'
	,   'ProductDetails.Full.View.Extension'
	,   'ProductDetails.QuickView.View.Extension'

    ,	'underscore'
    ]
    ,	function(
        ProductDetailsInformationViewExtension
	,   ProductDetailsBaseViewOptionsFix
    ,   ProductDetailsBaseViewExtension
	,   ProductDetailsFullViewExtension
	,   ProductDetailsQuickViewViewExtension
    ,	_
    )
    {
        'use strict';

        return {
	        ProductDetailsQuickViewViewExtension: ProductDetailsQuickViewViewExtension
        ,   ProductDetailsBaseViewExtension: ProductDetailsBaseViewExtension
        ,   ProductDetailsFullViewExtension: ProductDetailsFullViewExtension
        ,   ProductDetailsInformationViewExtension: ProductDetailsInformationViewExtension
        ,   ProductDetailsBaseViewOptionsFix: ProductDetailsBaseViewOptionsFix
        }
    });
