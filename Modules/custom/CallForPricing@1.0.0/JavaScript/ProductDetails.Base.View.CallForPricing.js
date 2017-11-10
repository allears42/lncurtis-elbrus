/*
	© 2017 LN Curtis
*/

define(
    'ProductDetails.Base.View.CallForPricing'
    ,	[
        'ProductDetails.Base.View'
	,	'underscore'
    ]
    ,	function(
        ProductDetailsBaseView
    ,	_
    )
    {
        'use strict';

        _.extend( ProductDetailsBaseView.prototype, {

            getContext: _.wrap(ProductDetailsBaseView.prototype.getContext, function (fn) {
		        var returnVariable = fn.apply(this, _.toArray(arguments).slice(1))
		        ,   isCallForPricing = this.model.get('item').get('_isCallForPricing');
		
		        _.extend(returnVariable, {
					isCallForPricing: isCallForPricing
		        });
		
		        return returnVariable;
            })

        });
        
    });
