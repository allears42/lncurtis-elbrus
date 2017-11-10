/*
	© 2017 LN Curtis
*/

define(
    'OrderHistory.Extension'
    ,	[
        'OrderHistory.List.View.Extension'
    ,   'OrderHistory.Summary.View.Extension'
    ]
    ,	function(
        OrderHistoryListViewExtension
    ,   OrderHistorySummaryViewExtension
    )
    {
        'use strict';

        return {
            OrderHistoryListViewExtension: OrderHistoryListViewExtension
        ,   OrderHistorySummaryViewExtension: OrderHistorySummaryViewExtension
        }

    });
