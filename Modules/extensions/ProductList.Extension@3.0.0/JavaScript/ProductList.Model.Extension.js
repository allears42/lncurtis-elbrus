/*
	© 2017 LN Curtis
*/

define(
    'ProductList.Model.Extension'
    ,	[
        'ProductList.Model'

    ,	'underscore'

    ]
    ,	function(
        ProductListModel

    , 	_

    )
    {
        'use strict';

        _.extend( ProductListModel.prototype, {


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
