define('OrderHistory.Details.View.Extension'
,   [
        'OrderHistory.Details.View'
    ,   'SC.Configuration'
    ,   'underscore'

    ]
,   function
    (
        OrderHistoryDetailsView
    ,   Configuration
    ,   _

    )
{
    'use strict';

    _.extend(OrderHistoryDetailsView.prototype, {

        getContext: _.wrap(OrderHistoryDetailsView.prototype.getContext, function(fn)
        {
            var self = this
            ,   returnVariable = fn.apply(self, _.toArray(arguments).slice(1))
            ,   status = this.model.get('status');

            if(status.name === 'Pending Approval') {
                
                status.name = 'Pending Fulfillment';
                status.tooltip = Configuration.get('orderStatusTooltips').pendingFulfillment || '';
            }

            _.extend(returnVariable , {
                status: status
            });

            return returnVariable
        })
    })
});