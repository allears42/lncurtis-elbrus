/*
	© 2017 LN Curtis
*/

define(
    'ListHeader.View.Extension'
    ,	[
        'ListHeader.View'

        ,	'underscore'

    ]
    ,	function(
        ListHeaderView

        , 	_

    )
    {
        'use strict';

        _.extend( ListHeaderView.prototype, {

            getContext: _.wrap( ListHeaderView.prototype.getContext, function(fn)
            {
                var self = this
                ,   returnVariable = fn.apply(self, _.toArray(arguments).slice(1));

                _.extend(returnVariable , {
                    // removed collection param as we want this option to always be available for CFP items
                    showSelectAll: this.selectable && this.collection.length > 1
                });

                return returnVariable
            })

        });

    });
