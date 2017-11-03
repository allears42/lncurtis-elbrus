/*
	© 2017 LN Curtis
*/

//@module ProductDetails
define(
	'ProductDetails.Full.View.Extension'
,	[
		'ProductDetails.Full.View'
	,   'ProductViews.SizeChart'
	,	'SC.Configuration'
	,	'underscore'

	]
,	function (
		ProductDetailsFullView
	,   ProductViewsSizeChartView
	,	Configuration
	,	_
	)
{
	'use strict';
	
	_.extend(ProductDetailsFullView.prototype, {
		//fix for click event on select - should be change
		optionBindEventByType: {
			//@class ProductDetails.Base.View.OptionBinding This class associated an option type with the event used to set the option's value
			// @extend Dictionary<String, String>
			'select': 'change'
			,	'text': 'blur'
			,	'date': 'change'
		}
		
	,   events: _.extend({}, ProductDetailsFullView.prototype.events, {
			'click [data-action="print-page"]': 'triggerPrint'
			,   'click [data-action="print-page"] i': 'triggerPrint'
			,   'click [data-action="show-size-chart"]': 'showSizeChart'
			,   'contextmenu img': 'preventContextMenu'
		})
		
		
	,   preventContextMenu: function (e)
		{
			e.preventDefault();
			console.error('You\'re attempting to access an image that is copyrighted by LNCurtis.com');
			return false;
		}
		
	,   triggerPrint: function (e)
		{
			e.preventDefault();
			window.print();
		}
		
	,   showSizeChart: function (e)
		{
			
			var model = this.model;
			this.application.getLayout().showInModal(new ProductViewsSizeChartView({
				layout: this
				, application: this.application
				, model: model
			}));
		}
	
	,   showOptionsPusher: function () {
			return false;
		}
		
	,   getContext: _.wrap(ProductDetailsFullView.prototype.getContext, function (fn) {
			
			var returnVariable = fn.apply(this, _.toArray(arguments).slice(1));
			
			_.extend(returnVariable, {
				
				curtisCarePopover: Configuration.get("curtisCarePopover", "")
				, curtisCarePopoverTitle: Configuration.get("curtisCarePopoverTitle", "")
				, mfgPartNo: this.model.get('item').get('mfgPartNo')
				,   origin: document.location.origin
			});
			
			return returnVariable;
		})
	});
	
	//console.log(ProductDetailsFullView.prototype.events)

});
