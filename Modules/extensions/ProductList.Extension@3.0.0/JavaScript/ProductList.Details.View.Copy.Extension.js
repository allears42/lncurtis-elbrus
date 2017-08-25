/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ProductList
// -----------------------
// Views for handling Product Lists (CRUD)
define('ProductList.Details.View.Copy.Extension'
,	[
		'ProductList.Details.View'
		
	,	'ProductList.AddedToCart.View'

	,	'SC.Configuration'
	,	'underscore'
	,	'jQuery'
	]
,	function (
		ProductListDetailsView

	,	ProductListAddedToCartView
	,	Configuration
	,	_
	,	jQuery
	)
{
	'use strict';

	_.extend(ProductListDetailsView.prototype, {
		// @method showConfirmationHelper
		showConfirmationHelper: function (selected_item)
		{
			this.showConfirmationMessage(_(Configuration.get('productList.itemAddedToCartConfirmationText', '')).translate(selected_models.items_for_cart.length, list.get('internalid'), list.get('name')));
			
			//selected item may be undefined
			if (_.isUndefined(selected_item) === true) {
				return;
			}
			
			this.addedToCartView = new ProductListAddedToCartView({
				application: this.application
				, parentView: this
				, item: selected_item
			});
			
			this.application.getLayout().showInModal(this.addedToCartView);
		}
	});
	
});
