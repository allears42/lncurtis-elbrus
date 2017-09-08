/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ProductViews
define(
	'ProductViews.Price.View.CallForPricing'
,	[
		'ProductViews.Price.View'
	,	'underscore'
	]
,	function(
		ProductViewsPriceView
	,	_
	)
{
	'use strict';

	_.extend(ProductViewsPriceView.prototype, {
		getContext: _.wrap(ProductViewsPriceView.prototype.getContext, function (fn) {
			var returnVariable = fn.apply(this, _.toArray(arguments).slice(1))
			,   isCallForPricing = this.model.get('item') && this.model.get('item').get('_isCallForPricing') || false;
			
			_.extend(returnVariable, {
				isCallForPricing: isCallForPricing
			});
			
			return returnVariable;
		})
	})
	
});

