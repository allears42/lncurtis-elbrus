/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Product
define('Product.Model.Options.Single.Extension'
,	[
		'Product.Model'

	,	'underscore'
	]
,	function (
		ProductModel
	,	_
	)
{
	'use strict';

	_.extend(ProductModel.prototype, {
		
		// sets all options with one value
		setSingleOptions: function () {
			var options_to_render = this.get('item').getPosibleOptions()
			,   self = this;
			
			_.each(options_to_render.models, function (option) {
				// filter out select values and preselect any options that have only one available value
				var normalizedValues = _.filter(option.get('values'), function (value) {
					return value && value.label !== '- Select -'
				});
				
				if (normalizedValues.length === 1) {
					// have to set it on the option as well
					option.set('value', normalizedValues[0]);
					self.setOption(option.get('cartOptionId'), normalizedValues[0].internalid);
					
				}
				
			});
		}
		
	})
});
