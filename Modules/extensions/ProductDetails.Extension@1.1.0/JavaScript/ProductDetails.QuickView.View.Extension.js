/*
	© 2017 LN Curtis
*/

//@module ProductDetails
define('ProductDetails.QuickView.View.Extension'
,	[
		'ProductDetails.QuickView.View'

	,	'underscore'
	,	'StateComplianceWarnings.View'
	,	'ProductBadging.View'
	]
,	function (
		ProductDetailsQuickViewView

	,	_
	,	StateComplianceWarningsView
	,	ProductBadgingView
	)
{
	'use strict';
	
	_.extend(ProductDetailsQuickViewView.prototype, {
		showModalPageHeader: true
		
		,   events: _.extend({}, ProductDetailsQuickViewView.prototype.events, {
			'contextmenu img': 'preventContextMenu'
		})
		
		,   preventContextMenu: function (e)
		{
			e.preventDefault();
			console.error('You\'re attempting to access an image that is copyrighted by LNCurtis.com');
			return false;
		}
		
		,   initialize: _.wrap(ProductDetailsQuickViewView.prototype.initialize, function (fn, options) {
			fn.apply(this, _.toArray(arguments).slice(1));
			
			// make modal header product title
			this.title = this.model.get('item').get('_pageTitle');
			this.pageHeader = this.title;
			
			var self = this
			,   layout = this.application.getLayout();
			
			layout.once('afterAppendView', function () {
				self.model.setSingleOptions();
				self.showContent();
				
			}, self);
		})

	,	childViews: _.extend({}, ProductDetailsQuickViewView.prototype.childViews, {

            'StateWarnings.Icons': function()
            {
                return new StateComplianceWarningsView({
                    model: this.model
                })
            }
		,   'ProductBadging': function()
            {
                return new ProductBadgingView({
                    model: this.model
                })
            }
        })
		
		, attributes: _.extend({}, ProductDetailsQuickViewView.prototype.attributes, {
			id: "product-details-quickview-modal"
			, modalClass: "product-details-quickview-modal"
		})
		
		, getContext: _.wrap(ProductDetailsQuickViewView.prototype.getContext, function (fn) {
			var returnVariable = fn.apply(this, _.toArray(arguments).slice(1));
			
			_.extend(returnVariable, {
				storedescription: this.model.get('item').get('storedescription')
			});
			
			return returnVariable;
			
		})
	})
});
