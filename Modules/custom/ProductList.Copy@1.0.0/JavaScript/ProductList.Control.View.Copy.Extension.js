/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ProductList
define('ProductList.Control.View.Copy.Extension'
	,	[
			'ProductList.Control.View'

		,	'MenuTree.View'

		,	'SC.Configuration'
		,	'underscore'
		,	'jQuery'
		,	'Backbone'
		]
	,	function(
			ProductListControlView
	  
		,	MenuTreeView

		,	Configuration
		,	_
		,	jQuery
		,	Backbone
		)
{
	'use strict';

	_.extend(ProductListControlView.prototype, {
		
		// Adds the product to the newly created list, renders the control and shows a confirmation msg
		addNewProductToList: function (newList)
		{
			this.addItemToList(this.product, newList, true);
			this.saveAndShowConfirmationMessage(
				_(Configuration.get('productList.itemAddedConfirmationText', '')).translate(1, newList.get('internalid'), newList.get('name'))
			);
		}
		// Adds the new item to the collection
		,	doAddItemToList: function (product, productList, dontShowMessage)
		{
			var self = this
				,	product_list_line_to_save = this.getNewItemData(product, productList);
			
			product_list_line_to_save.save(null, {
				//Note this is lack of validation is require to not validate the JSON returned from the services as it will lack the Model/Collection structure required
				//to run the validation. for example the list of options will be an array and not a collection as the event handle that parse them didn't run yet
				validate: false
				,	success: function (product_list_line_to_save_saved)
				{
					productList.get('items').add(product_list_line_to_save_saved);
					self.collection.trigger('changed');
					self.render();
					
					if (!dontShowMessage)
					{
						self.saveAndShowConfirmationMessage(
							_(Configuration.get('productList.itemAddedConfirmationText', '')).translate(1, productList.get('internalid'), productList.get('name'))
						);
					}
				}
				//TODO HANLDE ERROR CASE!!!!
			});
		}
		
		// Moves the item to the destination list
		,	moveProduct: function (destination)
		{
			var self = this
				,	original_item = this.moveOptions.productListItem
				,	original_item_clone = original_item.clone()
				,	details_view = this.moveOptions.parentView;
			
			original_item_clone.set('productList', {
				id: destination.get('internalid')
			});
			
			destination.get('items').create(original_item_clone,
				{
					validate: false
					,	success: function (saved_model)
				{
					var app = details_view.application
						,	from_list = self.application.ProductListModule.Utils.getProductLists().findWhere({internalid: self.moveOptions.parentView.model.get('internalid') })
						,	to_list = self.application.ProductListModule.Utils.getProductLists().findWhere({internalid: destination.get('internalid')});
					
					self.doMoveProduct(from_list, to_list, original_item, saved_model);
					
					details_view.model.get('items').remove(original_item);
					details_view.render();
					
					jQuery('.sc-flyout-bg').remove();
					
					MenuTreeView.getInstance().updateMenuItemsUI();
					app.getLayout().currentView.showConfirmationMessage(
						_('<div class="product-list-control-message">'
							+ Configuration.get("productList.itemMovedConfirmationText", "The item was moved to")
							+ ' <a href="/productlist/$(0)">$(1)</a></div>').translate(destination.get('internalid'), destination.get('name'))
					);
				}
			});
		}
	});
});
