define('Transaction.Line.Views.Extension'
,   [
        'Transaction.Line.Views.Cell.Navigable.View.Extension'
    ,   'Transaction.Line.Views.Cell.Actionable.View.Extension'
    ]
,   function
    (
        TransactionLineViewsCellNavigableViewExtension
    ,   TransactionLineViewsCellActionableViewExtension
    ) 
{
    'use strict';
    
    return {
        TransactionLineViewsCellNavigableViewExtension: TransactionLineViewsCellNavigableViewExtension
    ,   TransactionLineViewsCellActionableViewExtension: TransactionLineViewsCellActionableViewExtension
    }
});