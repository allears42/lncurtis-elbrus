/*
	© 2017 LN Curtis
*/

define(
    'OrderHistory.Summary.View.Extension'
    ,	[
        'OrderHistory.Summary.View'

    ,	'underscore'

    ]
    ,	function(
        OrderHistorySummaryView

    , 	_

    )
    {
        'use strict';

        _.extend( OrderHistorySummaryView.prototype, {


        	getContext: _.wrap( OrderHistorySummaryView.prototype.getContext, function(fn)
                {
                    var self = this
                    ,   returnVariable = fn.apply(self, _.toArray(arguments).slice(1));

                    _.extend(returnVariable , {
                        showCancelButton: false //this.model.get('isCancelable')
                    });

                    return returnVariable
                })

        });

    });
