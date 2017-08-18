/*
	© 2017 LN Curtis
*/

define(
    'ProductList.Lists.View.Extension'
    ,	[
        'ProductList.Lists.View'

        ,	'underscore'

    ]
    ,	function(
        ProductListListsView

        , 	_

    )
    {
        'use strict';

        _.extend( ProductListListsView.prototype, {


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
