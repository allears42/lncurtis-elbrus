/*
	© 2017 LN Curtis
*/

define(
	'ProductList.Details.View.CallForPricing'
	, [
		'ProductList.Details.View'
		, 'ProductList.Item.Edit.View'
		, 'ProductList.Item.Collection'
		, 'ProductList.Item.Model'
		, 'MenuTree.View'
		
		, 'underscore'
		, 'jQuery'
	
	]
	, function (
		ProductListDetailsView
		, ProductListItemEditView
		, ProductListItemCollection
		, ProductListItemModel
		, MenuTreeView

		, _
		, jQuery) {
		'use strict';
		
		_.extend(ProductListDetailsView.prototype, {
			
			
			addItemToCartHandler: function (e) {
				e.stopPropagation();
				e.preventDefault();
				
				var self = this
					, selected_product_list_item_id = self.$(e.target).closest('article').data('id')
					, selected_product_list_item = self.model.get('items').findWhere({
					internalid: selected_product_list_item_id.toString()
				})
					, selected_item = selected_product_list_item.get('item')
					, selected_item_internalid = selected_item.internalid
					, item_detail = selected_product_list_item.getItemForCart(selected_item_internalid, selected_product_list_item.get('quantity'), selected_item.itemoptions_detail, selected_product_list_item.getOptionsArray());
				
				// customization to NOT add items that are call for pricing to the cart
				item_detail['custitem_sc_call_for_pricing'] = selected_item.custitem_sc_call_for_pricing;
				
				var isCallForPricing = selected_item.custitem_sc_call_for_pricing || false;
				
				// only add items that are not call for pricing
				if (!isCallForPricing) {
					var add_to_cart_promise = this.addItemToCart(item_detail)
						, whole_promise = jQuery.when(add_to_cart_promise).then(jQuery.proxy(this, 'showConfirmationHelper', selected_product_list_item));
					
					if (whole_promise) {
						this.disableElementsOnPromise(whole_promise, 'article[data-item-id="' + selected_item_internalid + '"] a, article[data-item-id="' + selected_item_internalid + '"] button');
					}
				}
				
			}
			
			, _getSelection: function (isDeleteItemsFromList) {
				var items = []
				, 	button_selector = [];

				//Filter items for bulk operation to remove call for pricing
				_.each(this.collection.models, function (pli) {
					//irrelevant items: no-op
					if (pli.get('checked') !== true) {
						return;
					}
					
					var item = pli.get('item')
					, item_internal_id = pli.getItemId()
					, isCallForPricing = item.get('custitem_sc_call_for_pricing') || false;

					if ((!_.isUndefined(isDeleteItemsFromList) && isDeleteItemsFromList) || (!isCallForPricing)) {
						items.push(pli);
						button_selector.push('article[data-item-id="' + item_internal_id + '"] a, article[data-item-id="' + item_internal_id + '"] button');
					}
					
				});
				
				return {
					items: new ProductListItemCollection(items)
					, button_selector: button_selector
				};
			}

			, deleteItemsHandler: function (e) {
				e.preventDefault();

				var self = this
				, 	selected_models = this._getSelection(true)
				, 	delete_promises = [];

				if (selected_models.items.length < 1) {
					return;
				}

				//there are two collections with the same information this.model and the one on application
				//should remove the item on both
				var app_item_list = _.findWhere(self.application.ProductListModule.Utils.getProductLists().models, {id: self.model.id});

				_.each([].concat(selected_models.items.models), function (item) {
					//fix already used in "deleteListItem"
					item.url = ProductListItemModel.prototype.url;

					app_item_list && app_item_list.get('items').remove(item);

					delete_promises.push(item.destroy().promise());
				});

				jQuery.when.apply(jQuery, delete_promises).then(function () {
					self.render();
					MenuTreeView.getInstance().updateMenuItemsUI();

					self.showConfirmationMessage(_('The selected items were removed from your product list').translate());
				});
			}
			
			, addItemsToCartBulkHandler: function (e) {
				e.preventDefault();
				
				var self = this
					, selected_models = this._getSelection();
				
				//no items selected: no opt
				if (selected_models.items.length < 1) {
					return;
				}
				
				var button_selector = selected_models.button_selector.join(',');
				
				_.each(selected_models.items.models, function (item) {
					
					var matchingItem = _.findWhere(selected_models.items, function (model) {
						return model.get('item').get('internalid') === item.get('internalid')
					});
					
					if (matchingItem && matchingItem.get('item')) {
						var itemModel = matchingItem.get('item');
						_.each(Object.keys(itemModel), function (key) {
							item.set(key, itemModel[key]);
						});
						// normalize for matrix item (data thats stored on the parent has to be added b/c this is a child)
						if (itemModel.matrix_parent) {
							
							item.set('itemimages_detail', itemModel.matrix_parent['itemimages_detail']);
							item.set('pagetitle2', itemModel.matrix_parent['pagetitle2']);
							item.set('_pageHeader', itemModel.matrix_parent['pagetitle2']);
						}
					}
					
				});
				
				//add items to cart
				var add_to_cart_promise = this.cart.addProducts(selected_models.items.models);
				
				add_to_cart_promise.then(function () {
					//TODO: confirm if this modification is necessary
					/*var list = self.model
						, items = self._getSelection()
						, message = items.items_for_cart.length && items.items_for_cart.length > 1
						? _(Configuration.get('productList.itemsAddedToCartConfirmationText', '')).translate(selected_models.items_for_cart.length, list.get('internalid'), list.get('name'))
						: _(Configuration.get('productList.itemAddedToCartConfirmationText', '')).translate(selected_models.items_for_cart.length, list.get('internalid'), list.get('name'));*/
					
					/*self.unselectAll();
					self.showConfirmationMessage(_(message).translate(list.get('internalid'), list.get('name')));
					self.showConfirmationHelper();*/
					
					self.unselectAll();
					self.showConfirmationHelper();
					
				});
				
				if (add_to_cart_promise) {
					this.disableElementsOnPromise(add_to_cart_promise, button_selector);
				}
			}
			
		});
		
	});
