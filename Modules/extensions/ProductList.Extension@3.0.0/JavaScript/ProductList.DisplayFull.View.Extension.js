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


        	getContext: _.wrap( ProductListDisplayFullView.prototype.getContext, function(fn)
                {
                    var returnVariable = fn.apply(self, _.toArray(arguments).slice(1));

                    _.extend(returnVariable , {
                        showRating : false //!options || !options.hide_rating
                    ,	showCheckbox : showCheckBox
                    });

                    return returnVariable
                })

        });

    });
