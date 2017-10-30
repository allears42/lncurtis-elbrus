/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ProductList
define('ProductList.CartSaveForLater.View.Copy.Extension'
,	[
		'SC.Configuration'
	,	'ProductList.CartSaveForLater.View'

	,	'underscore'
	]
,	function (
		Configuration
	,	ProductListCartSaveForLaterView
	,	_
	)
{
	'use strict';
	
	_.extend(ProductListCartSaveForLaterView.prototype, {
		// save for later:
		// handles the click event of the save for later button
		// removes the item from the cart and adds it to the saved for later list
		saveForLaterItem: function (e)
		{
			e.preventDefault();
			
			if (!this.validateLogin())
			{
				return;
			}
			
			var cart_line = this.model.get('lines').get(jQuery(e.target).data('internalid'))
				,	internalid = cart_line.get('internalid')
				,	whole_promise = jQuery.Deferred()
				,	self = this;
			
			jQuery.when(this.model.removeLine(cart_line), self.addItemToList(cart_line)).then(function()
			{
				self.showConfirmationMessage(_(Configuration.get('productList.itemSavedForLaterConfirmationText', '')).translate());
				
				whole_promise.resolve();
			});
			
			this.disableElementsOnPromise(whole_promise, '#' + internalid + ' button');
		}
	});

});
