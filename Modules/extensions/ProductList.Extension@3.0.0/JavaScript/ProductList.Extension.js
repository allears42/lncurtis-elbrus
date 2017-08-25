/*
 © 2017 Satellite Commerce
 
 */

//@module ProductViews.Extension
define(
	'ProductList.Extension'
,	[
		'ProductList.BulkActions.View.Extension'
	,   'ProductList.CartSaveForLater.View.Copy.Extension'
	,   'ProductList.Control.View.Copy.Extension'
	,   'ProductList.ControlSingle.View.Copy.Extension'
	,   'ProductList.Details.View.CallForPricing.Extension'
	,   'ProductList.Details.View.Copy.Extension'
	,   'ProductList.DisplayFull.View.Extension'
	,   'ProductList.Edit.View.Copy.Extension'
	,   'ProductList.Lists.View.CallForPricing.Extension'
	,   'ProductList.Lists.View.Copy.Extension'
	,   'ProductList.Model.CallForPricing.Extension'
	,   'ProductList.Router.Extension'
	,   'ProductList.Utils.Extension'
	]
	,	function (
		ProductListBulkActionsViewExtension
	,   ProductListCartSaveForLaterViewCopyExtension
	,   ProductListControlViewCopyExtension
	,   ProductListControlSingleViewCopyExtension
	,   ProductListDetailsViewCallForPricingExtension
	,   ProductListDetailsViewCopyExtension
	,   ProductListDisplayFullViewExtension
	,   ProductListEditViewCopyExtension
	,   ProductListListsViewCallForPricingExtension
	,   ProductListListsViewCopyExtension
	,   ProductListModelCallForPricingExtension
	,   ProductListRouterExtension
	,   ProductListUtilsExtension
	
	)
	{
		'use strict';
		
		return {
			ProductListBulkActionsViewExtension: ProductListBulkActionsViewExtension
		,   ProductListCartSaveForLaterViewCopyExtension: ProductListCartSaveForLaterViewCopyExtension
		,   ProductListControlViewCopyExtension: ProductListControlViewCopyExtension
		,   ProductListControlSingleViewCopyExtension: ProductListControlSingleViewCopyExtension
		,   ProductListDetailsViewCallForPricingExtension: ProductListDetailsViewCallForPricingExtension
		,   ProductListDetailsViewCopyExtension: ProductListDetailsViewCopyExtension
		,   ProductListDisplayFullViewExtension: ProductListDisplayFullViewExtension
		,   ProductListEditViewCopyExtension: ProductListEditViewCopyExtension
		,   ProductListListsViewCallForPricingExtension: ProductListListsViewCallForPricingExtension
		,   ProductListListsViewCopyExtension: ProductListListsViewCopyExtension
		,   ProductListModelCallForPricingExtension: ProductListModelCallForPricingExtension
		,   ProductListRouterExtension: ProductListRouterExtension
		,   ProductListUtilsExtension: ProductListUtilsExtension
		}
		
	});