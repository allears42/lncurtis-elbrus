/*
	© 2017 LN Curtis
*/

define(
    'ProductList.Extension'
    ,	[
        'ProductList.BulkActions.View.Extension'
    ,   'ProductList.CartSaveForLater.View.Extension'
    ,   'ProductList.Control.View.Extension'
    ,   'ProductList.ControlSingle.View.Extension'
    ,   'ProductList.Details.View.Extension'
    ,   'ProductList.DisplayFull.View.Extension'
    ,   'ProductList.Edit.View.Extension'
    ,   'ProductList.Lists.View.Extension'
    ,   'ProductList.Model.Extension'
    ,   'ProductList.Router.Extension'
    ,   'ProductList.Utils.Extension'
        
    ]
    ,	function(
            ProductListBulkActionsViewExtension
        ,   ProductListCartSaveForLaterViewExtension
        ,   ProductListControlViewExtension
        ,   ProductListControlSingleViewExtension
        ,   ProductListDetailsViewExtension
        ,   ProductListDisplayFullViewExtension
        ,   ProductListEditViewExtension
        ,   ProductListListsViewExtension
        ,   ProductListModelExtension
        ,   ProductListRouterExtension
        ,   ProductListUtilsExtension
    )
    {
        'use strict';

        return {
            ProductListBulkActionsViewExtension: ProductListBulkActionsViewExtension
        ,   ProductListCartSaveForLaterViewExtension: ProductListCartSaveForLaterViewExtension
        ,   ProductListControlViewExtension: ProductListControlViewExtension
        ,   ProductListControlSingleViewExtension: ProductListControlSingleViewExtension
        ,   ProductListDetailsViewExtension: ProductListDetailsViewExtension
        ,   ProductListDisplayFullViewExtension: ProductListDisplayFullViewExtension
        ,   ProductListEditViewExtension: ProductListEditViewExtension
        ,   ProductListListsViewExtension: ProductListListsViewExtension
        ,   ProductListModelExtension: ProductListModelExtension
        ,   ProductListRouterExtension: ProductListRouterExtension
        ,   ProductListUtilsExtension: ProductListUtilsExtension
        }

    });
