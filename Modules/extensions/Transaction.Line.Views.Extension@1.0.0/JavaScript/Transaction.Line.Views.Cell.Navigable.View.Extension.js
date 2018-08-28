define('Transaction.Line.Views.Cell.Navigable.View.Extension'
,   [
        'Transaction.Line.Views.Cell.Navigable.View'
    ,	'ProductLine.Stock.Cart.View'
        
    ,   'underscore'
    ,	'StateComplianceWarnings.View'
    ]
,   function
    (
        TransactionLineViewsCellNavigableView
    ,	ProductLineStockCartView
        
    ,   _
    ,	StateComplianceWarningsView
    ) 
{
    'use strict';
    
    _.extend(TransactionLineViewsCellNavigableView.prototype, {
        
        childViews: _.extend({}, TransactionLineViewsCellNavigableView.prototype.childViews, {

            'ItemViews.Stock.View': function ()
            {
                return new ProductLineStockCartView({
                    model: this.model
                });
            }

        ,   'StateWarnings.Icons': function()
            {
                return new StateComplianceWarningsView({
                    model: this.model
                })
            }
        })
    })
});