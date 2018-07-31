/*
	© 2017 LN Curtis
*/

define(
    'OrderHistory.Extension'
    ,	[
        'OrderHistory.List.View.Extension'
    ,   'OrderHistory.Summary.View.Extension'
    ,   'OrderHistory.Details.View.Extension'
    ]
    ,	function(
        OrderHistoryListViewExtension
    ,   OrderHistorySummaryViewExtension
    ,   OrderHistoryDetailsViewExtension
    )
    {
        'use strict';

        return {
            OrderHistoryListViewExtension: OrderHistoryListViewExtension
        ,   OrderHistorySummaryViewExtension: OrderHistorySummaryViewExtension
        ,   OrderHistoryDetailsViewExtension: OrderHistoryDetailsViewExtension
        }

    });
