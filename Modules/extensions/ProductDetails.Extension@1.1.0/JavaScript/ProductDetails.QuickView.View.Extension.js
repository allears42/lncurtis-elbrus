/*
	© 2017 LN Curtis
*/

//@module ProductDetails
define('ProductDetails.QuickView.View.Extension'
,	[
		'ProductDetails.QuickView.View'

	,	'underscore'
	]
,	function (
		ProductDetailsQuickViewView

	,	_
	)
{
	'use strict';
	
	_.extend(ProductDetailsQuickViewView.prototype, {
		showModalPageHeader: true
		
	,   initialize: _.wrap(ProductDetailsQuickViewView.prototype.initialize, function (fn, options) {
			fn.apply(this, _.toArray(arguments).slice(1));
			
			// make modal header product title
			this.title = this.model.get('item').get('_pageTitle');
			this.pageHeader = this.title;
			console.log(this.title)
		})
		
		, attributes: _.extend({}, ProductDetailsQuickViewView.prototype.attributes, {
			id: "product-details-quickview-modal"
			, modalClass: "product-details-quickview-modal"
		})
		
		, getContext: _.wrap(ProductDetailsQuickViewView.prototype.getContext, function (fn) {
			var returnVariable = fn.apply(this, _.toArray(arguments).slice(1));
			
			console.log(this.model, this.model.get('item'))
			_.extend(returnVariable, {
				storedescription: this.model.get('item').get('storedescription')
			});
			
			return returnVariable;
			
		})
	})
});