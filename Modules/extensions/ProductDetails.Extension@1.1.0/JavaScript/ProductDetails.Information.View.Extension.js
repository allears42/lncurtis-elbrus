/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ProductDetails
define(
	'ProductDetails.Information.View.Extension'
,	[
		'ProductDetails.Information.View'
	,	'ProductReviews.Center.View'
	,	'GlobalViews.StarRating.View'
	,	'Utils'
	,	'underscore'
	]
,	function (
		ProductDetailsInformationView
	,	ProductReviewsCenterView
	,	GlobalViewsStarRatingView
	,	Utils
	,	_
	)
{
	'use strict';
	
	_.extend(ProductDetailsInformationView.prototype, {
		childViews: _.extend({}, ProductDetailsInformationView.prototype.childViews, {
			'ProductReviews.Center': function ()
			{
				return new ProductReviewsCenterView({
					item: this.model.get('item')
					,	application: this.application
				});
			}
			
		,   'Global.StarRating': function ()
			{
				return new GlobalViewsStarRatingView({
					model: this.model.get('item')
					, showRatingCount: true
					, showSchemaInfo: true
				});
				
			}
		})
		
	,   getContext: _.wrap(ProductDetailsInformationView.prototype.getContext, function (fn) {
		
			var returnVariable = fn.apply(this, _.toArray(arguments).slice(1))
			, showReviews = false
			, sizeChart = this.model.get('item').get('_sizechart')
			, showSizeChart = sizeChart && (sizeChart.length > 0 || sizeChart.url && sizeChart.url.length > 0);
			
			_.extend(returnVariable, {
				showReviews: showReviews
				, showSizeChart: showSizeChart
				, sizeChart: sizeChart
			});
			
			return returnVariable;
		})
	});
});


//@class ProductDetails.Information.View.InitializationOptions
//@property {Array<ProductDetails.Information.DataContainer>?} details
//@property {Product.Model} model
//