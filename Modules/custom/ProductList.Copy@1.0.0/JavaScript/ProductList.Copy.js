/*
 © 2017 Satellite Commerce
 
 */

//@module ProductViews.Extension
define(
	'ProductList.Copy'
,	[
		'ProductList.CartSaveForLater.View.Copy.Extension'
	,   'ProductList.Control.View.Copy.Extension'
	,   'ProductList.ControlSingle.View.Copy.Extension'
	,   'ProductList.Details.View.Copy.Extension'
	,   'ProductList.Edit.View.Copy.Extension'
	,   'ProductList.Lists.View.Copy.Extension'
	]
	,	function (
		ProductListCartSaveForLaterViewCopyExtension
	,   ProductListControlViewCopyExtension
	,   ProductListControlSingleViewCopyExtension
	,   ProductListDetailsViewCopyExtension
	,   ProductListEditViewCopyExtension
	,   ProductListListsViewCopyExtension
	
	)
	{
		'use strict';
		
		return {
			ProductListCartSaveForLaterViewCopyExtension: ProductListCartSaveForLaterViewCopyExtension
		,   ProductListControlViewCopyExtension: ProductListControlViewCopyExtension
		,   ProductListControlSingleViewCopyExtension: ProductListControlSingleViewCopyExtension
		,   ProductListDetailsViewCopyExtension: ProductListDetailsViewCopyExtension
		,   ProductListEditViewCopyExtension: ProductListEditViewCopyExtension
		,   ProductListListsViewCopyExtension: ProductListListsViewCopyExtension
		}
		
	});