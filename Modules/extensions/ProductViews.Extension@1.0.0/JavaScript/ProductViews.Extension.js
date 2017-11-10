/*
    © 2017 POS Supply
 */

//@module ProductViews
define(
	'ProductViews.Extension'
,	[
        'ProductViews.Price.View.Extension'
    ,   'ProductViews.Option.View.Extension'
	]
,	function (
        ProductViewsPriceViewExtension
    ,   ProductViewsOptionViewExtension
	)
{
	'use strict';

    return {
        ProductViewsPriceViewExtension: ProductViewsPriceViewExtension
    ,   ProductViewsOptionViewExtension: ProductViewsOptionViewExtension
    }

});