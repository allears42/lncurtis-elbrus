/*
	© 2017 LN Curtis
*/

define(
    'ErrorManagement.PageNotFound.View.Extension'
    ,	[
        'ErrorManagement.PageNotFound.View'
    ,   'SC.Configuration'

    ,	'underscore'

    ]
    ,	function(
        ErrorManagementPageNotFoundView
    ,   Configuration

    , 	_

    )
    {
        'use strict';

        _.extend( ErrorManagementPageNotFoundView.prototype, {

            getContext: _.wrap( ErrorManagementPageNotFoundView.prototype.getContext, function(fn)
            {
                var self = this
                ,   returnVariable = fn.apply(self, _.toArray(arguments).slice(1));

                _.extend(returnVariable , {
                    telephone : Configuration.get("header.telephone", "#")
                ,   customerServiceHours : Configuration.get("header.customerServiceHours", "#")
               });

                return returnVariable
            })

        });

    });
