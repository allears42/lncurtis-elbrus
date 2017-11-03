/*
 © 2017 Satellite Commerce
 
 */

//@module ProductViews.Extension
define(
	'ProductList.Extension'
,	[
		'ProductList.BulkActions.View.Extension'
	,   'ProductList.Control.View.Extension'
	,   'ProductList.DisplayFull.View.Extension'
	,   'ProductList.Item.Edit.View.Extension'
	,   'ProductList.Router.Extension'
	,   'ProductList.DetailsLater.View.NoLoadShopping'
	]
	,	function (
		ProductListBulkActionsViewExtension
	,   ProductListControlViewExtension
	,   ProductListDisplayFullViewExtension
	,   ProductListItemEditViewExtension
	,   ProductListRouterExtension
	,   ProductListDetailsLaterViewNoLoadShopping
	
	)
	{
		'use strict';
		
		return {
			ProductListBulkActionsViewExtension: ProductListBulkActionsViewExtension
		,   ProductListControlViewExtension: ProductListControlViewExtension
		,   ProductListDisplayFullViewExtension: ProductListDisplayFullViewExtension
		,   ProductListItemEditViewExtension: ProductListItemEditViewExtension
		,   ProductListRouterExtension: ProductListRouterExtension
		,   ProductListDetailsLaterViewNoLoadShopping: ProductListDetailsLaterViewNoLoadShopping
		}
		
	});