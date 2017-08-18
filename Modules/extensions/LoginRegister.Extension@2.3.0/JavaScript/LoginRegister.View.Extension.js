/*
	© 2017 LN Curtis
*/

define(
    'LoginRegister.View.Extension'
    ,	[
        'LoginRegister.View'

	,	'underscore'
	,	'Utils'

    ]
    ,	function(
        LoginRegisterView

	, 	_
	,	Utils

    )
    {
        'use strict';

        _.extend( LoginRegisterView.prototype, {

            initialize: _.wrap( LoginRegisterView.prototype.initialize, function(fn)
            {
                var self = this
				,	parameters = Utils.parseUrlOptions(location.search);

                //custom handling for aredirect -> account redirect
                if (parameters.acctredirect) {
                    var touchpoints = SC.getSessionInfo('touchpoints');
                    window.location.href = touchpoints.customercenter + (parameters.acctredirect.indexOf('#') !== 0 ? "#" : "") + parameters.acctredirect;
                }

                fn.apply(self, _.toArray(arguments).slice(1));

            })

        });

    });
