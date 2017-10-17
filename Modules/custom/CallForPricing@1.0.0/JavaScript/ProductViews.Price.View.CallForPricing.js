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
			
			var origins = ["ITEMCELL_SEARCH", "RELATEDITEM"];
			
			var returnVariable = fn.apply(this, _.toArray(arguments).slice(1))
			,   itemModel = origins.indexOf(this.options.origin) > -1 ? this.model : this.model.get('item')
			,   isCallForPricing = itemModel && itemModel.get('_isCallForPricing') || false;
			
			_.extend(returnVariable, {
				isCallForPricing: isCallForPricing
			});
			
			return returnVariable;
		})
	})
	
});

