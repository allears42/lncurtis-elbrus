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
                var returnVariable = fn.apply(this, _.toArray(arguments).slice(1))
                ,	options = this.options
                ,	product = item.get('item')
                ,   isCallForPricing = product.custitem_sc_call_for_pricing || false
                ,   showCheckBox = !isCallForPricing && (!options || !options.hide_checkbox);

                _.extend(returnVariable , {
                    showRating : false //!options || !options.hide_rating
                ,	showCheckbox : showCheckBox
                });

                return returnVariable
            })

        });

    });
