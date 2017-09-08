/*
	© 2017 LN Curtis
*/

// @module ProductViews
define(
	'ProductViews.Option.Single.View.Extension'
,	[
		'ProductViews.Option.View'

	,	'Backbone'
	,	'underscore'
	,	'bootstrap-datepicker'
	]
,	function (
		ProductViewsOptionView

	,	Backbone
	,	_
	)
{
	'use strict';

	_.extend(ProductViewsOptionView.prototype, {
		getContext: _.wrap(ProductViewsOptionView.prototype.getContext, function (fn) {
			
			var returnVariable = fn.apply(this, _.toArray(arguments).slice(1))
			,   normalizedValues = _.filter(returnVariable.values, function (value) {
				return typeof value.internalId !== 'undefined'
			});
			
			_.extend(returnVariable, {
				//@property {Boolean} if there is only one valid value
				isOneValue: normalizedValues.length === 1
			});
			
			return returnVariable;
		})
	})
});
