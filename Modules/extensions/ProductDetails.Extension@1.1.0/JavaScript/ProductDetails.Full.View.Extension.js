/*
	© 2017 LN Curtis
*/

//@module ProductDetails
define(
	'ProductDetails.Full.View.Extension'
,	[
		'ProductDetails.Full.View'
	,	'SC.Configuration'
	,	'underscore'

	]
,	function (
		ProductDetailsFullView
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
		
	,   showOptionsPusher: function () {
			return false;
		}
		
	,   getContext: _.wrap(ProductDetailsFullView.prototype.getContext, function (fn) {
			
			var returnVariable = fn.apply(this, _.toArray(arguments).slice(1));
			
			_.extend(returnVariable, {
				
				curtisCarePopover: Configuration.get("curtisCarePopover", "")
				, curtisCarePopoverTitle: Configuration.get("curtisCarePopoverTitle", "")
				, mfgPartNo: this.model.get('item').get('mfgPartNo')
			});
			
			return returnVariable;
		})
	});

});
