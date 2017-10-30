/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ProductList
define('ProductList.ControlSingle.View.Copy.Extension'
	,
		[
			'ProductList.ControlSingle.View'

		,	'underscore'
		,	'SC.Configuration'
		]
	,	function(
		ProductListControlSingleView

		,	_
		,	Configuration
	)
{
	'use strict';

	_.extend(ProductListControlSingleView.prototype, {
		
		// @method renderAfterAdded Adds the item to the list
		renderAfterAdded: function (self)
		{
			if (!this.validateGiftCertificate(self.product))
			{
				return;
			}
			
			self.addItemToList(self.product, self.single_list);
			self.render();
			
			self.saveAndShowConfirmationMessage(
				_(Configuration.get('productList.itemAddedConfirmationText', '')).translate()
			);
			
			//this.$('[data-action="add-product-to-single-list"]').attr('disabled', 'true');
		}
	})
	
});