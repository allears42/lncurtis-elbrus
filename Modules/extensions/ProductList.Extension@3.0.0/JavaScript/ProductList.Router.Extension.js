/*
	© 2017 LN Curtis
*/

define(
    'ProductList.Router.Extension'
    ,	[
        'ProductList.Router'

    ,	'underscore'

    ]
    ,	function(
        ProductListRouter

    , 	_

    )
    {
        'use strict';

        _.extend( ProductListRouter.prototype, {


            /*,	extendedFunction: _.wrap( ModuleUsed.prototype.extendedFunction, function(fn)
                {
                    var self = this
                    ,   returnVariable = fn.apply(self, _.toArray(arguments).slice(1));

                    _.extend(returnVariable , {
                        newKey: 'newValue'
                    });

                    return returnVariable
                })*/

        });

    });
