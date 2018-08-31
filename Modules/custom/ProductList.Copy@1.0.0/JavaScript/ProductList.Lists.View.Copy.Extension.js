/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ProductList
define('ProductList.Lists.View.Copy.Extension'
,	[
		'ProductList.Lists.View'

	,	'ProductList.AddedToCart.View'
	,	'ProductList.Model'

	,	'LiveOrder.Model'
	,	'SC.Configuration'

	,	'underscore'
	]
,	function (
		ProductListListsView

	,	ProductListAddedToCartView
	,	ProductListModel
	
	,	LiveOrderModel
	,	Configuration

	,	_
	)
{
	'use strict';

	_.extend(ProductListListsView.prototype, {
		// @method Adds an entire list to the cart @param {ProductList.Model} list
			addListToCart: function (list)
			{
			// collect the items data to add to cart
			var lines_to_add = []
				,	self = this
				,	not_purchasable_items_count = 0;
			
			list.get('items').each(function (pli)
			{
				if (pli.get('item').get('_isPurchasable'))
				{
					lines_to_add.push(pli);
				}
				else
				{
					not_purchasable_items_count++;
				}
			});
			
			if (lines_to_add.length === 0)
			{
				var errorMessage = _('All items in the list are not available for purchase.').translate();
				
				self.showWarningMessage(errorMessage);
				
				return;
			}
			
			// add the items to the cart and when its done show the confirmation view
			LiveOrderModel.getInstance().addProducts(lines_to_add).done(function ()
			{
				// before showing the confirmation view we need to fetch the items of the list with all the data.
				self.application.ProductListModule.Utils.getProductList(list.get('internalid')).done(function(model)
				{
					self.addedToCartView = new ProductListAddedToCartView({
						application: self.application
						,	parentView: self
						,	list: new ProductListModel(model) //pass the model with all the data
						,	not_purchasable_items_count: not_purchasable_items_count
					});
					
					// also show a confirmation message
					var confirmMessage;
					
					if (list.get('items').length > 1)
					{
						confirmMessage =  _(Configuration.get('productList.itemsAddedToCartConfirmationText', '')).translate(lines_to_add.length, list.get('internalid'), list.get('name'));
					}
					else
					{
						confirmMessage =  _(Configuration.get('productList.itemAddedToCartConfirmationText', '')).translate(1, list.get('internalid'), list.get('name'));
					}
					
					self.showConfirmationMessage(confirmMessage);
					self.application.getLayout().showInModal(self.addedToCartView);
				});
			});
		}
		
		
			,	getBreadcrumbPages: function()
			{
				return {
					text: _('Product Lists').translate()
					,	href: '/productlist'
				};
			}
	});
});
