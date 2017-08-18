/*
	© 2017 LN Curtis
*/

define(
    'ProductList.Utils.Extension'
    ,	[
        'ProductList.Utils'

    ,	'underscore'

    ]
    ,	function(
        ProductListUtils

    , 	_

    )
    {
        'use strict';

        _.extend( ProductListUtils.prototype, {


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
