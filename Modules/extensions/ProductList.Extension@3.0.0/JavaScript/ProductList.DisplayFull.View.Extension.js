/*
	© 2017 LN Curtis
*/

define(
    'ProductList.DisplayFull.View.Extension'
    ,	[
        'ProductList.DisplayFull.View'

        ,	'underscore'

    ]
    ,	function(
        ProductListDisplayFullView

        , 	_

    )
    {
        'use strict';

        _.extend( ProductListDisplayFullView.prototype, {


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
