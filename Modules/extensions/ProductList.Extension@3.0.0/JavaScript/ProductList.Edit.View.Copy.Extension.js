/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ProductList
define('ProductList.Edit.View.Copy.Extension'
,	[	'ProductList.Edit.View'
	,	'ProductList.Item.Collection'
	,	'MenuTree.View'

	,	'product_list_new.tpl'

	,	'underscore'
	,	'SC.Configuration'
	,	'Backbone.View'
	,	'Backbone.View.render'
	,	'Utils'
	]
,	function (
		ProductListEditView
	,	ProductListItemCollection
	,	MenuTreeView

	,	product_list_new_tpl

	,	_
	,	Configuration
	)
{
	'use strict';

	_.extend(ProductListEditView.prototype, {
		// Handles the form submit on save
		onSaveComplete: function()
		{
			var self = this;
			
			if (_.isArray(self.model.get('items')))
			{
				self.model.set('items', new ProductListItemCollection(self.model.get('items')));
			}
			
			self.$containerModal && self.$containerModal.modal('hide');
			
			if (self.isEdit)
			{
				self.application.ProductListModule.Utils.getProductLists().add(self.model, {merge: true});
				MenuTreeView.getInstance().updateMenuItemsUI();
				self.parentView.render();
				
				if (self.parentView.$el.hasClass('ProductListDetailsView'))
				{
					self.parentView.showConfirmationMessage(
						_(Configuration.get('productList.listUpdatedText', '')).translate(1, self.model.get('internalid'), self.model.get('name'))
					);
				}
				else
				{
					self.parentView.showConfirmationMessage(
						_(Configuration.get('productList.listUpdatedText', '')).translate(1, self.model.get('internalid'), self.model.get('name'))
					);
				}
			}
			else
			{
				self.application.ProductListModule.Utils.getProductLists().add(self.model);
				MenuTreeView.getInstance().updateMenuItemsUI();
				self.parentView.render();
				self.parentView.showConfirmationMessage(
					_(Configuration.get('productList.listAddedText', '')).translate(1, self.model.get('internalid'), self.model.get('name'))
				);
			}
			self.parentView.highlightList && self.parentView.highlightList(self.model.get('internalid'));
		}
	});
	
});
