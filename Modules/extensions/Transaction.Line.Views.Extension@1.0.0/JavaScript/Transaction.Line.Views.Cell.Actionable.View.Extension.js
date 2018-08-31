define('Transaction.Line.Views.Cell.Actionable.View.Extension'
,   [
        'Transaction.Line.Views.Cell.Actionable.View'
    ,   'underscore'
    ,	'StateComplianceWarnings.View'
    ]
,   function
    (
        TransactionLineViewsCellActionableView
    ,   _
    ,	StateComplianceWarningsView
    )
{
    'use strict';

    _.extend(TransactionLineViewsCellActionableView.prototype, {

        childViews: _.extend({}, TransactionLineViewsCellActionableView.prototype.childViews, {

            'StateWarnings.Icons': function()
            {
                return new StateComplianceWarningsView({
                    model: this.model
                })
            }
        })
    })
});