/*
	© 2017 LN Curtis
*/

define(
    'ProductList.Edit.View.Extension'
    ,	[
        'ProductList.Edit.View'

        ,	'underscore'

    ]
    ,	function(
        ProductListEditView

        , 	_

    )
    {
        'use strict';

        _.extend( ProductListEditView.prototype, {


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
