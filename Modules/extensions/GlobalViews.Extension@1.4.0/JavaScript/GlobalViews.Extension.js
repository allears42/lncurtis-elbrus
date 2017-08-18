/*
	© 2017 LN Curtis

*/

define(
	'GlobalViews.Extension'
,	[
		'GlobalViews.Breadcrumb.View.Extension'
	,	'GlobalViews.FormatPaymentMethod.View.Extension'
	]
,	function(
        GlobalViewsBreadcrumbViewExtension
	,	GlobalViewsFormatPaymentMethodViewExtension
	)
{
	'use strict';
	
	return {
        GlobalViewsBreadcrumbViewExtension: GlobalViewsBreadcrumbViewExtension,
        GlobalViewsFormatPaymentMethodViewExtension: GlobalViewsFormatPaymentMethodViewExtension
	}

});
