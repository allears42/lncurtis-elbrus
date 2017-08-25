/*
	© 2017 LN Curtis
*/

define(
    'ProductList.Control.View.Extension'
    ,	[
        'ProductList.Control.View'
    ,   'Profile.Model'
    ,   'SC.Configuration'
    ,	'MenuTree.View'

    ,	'underscore'

    ]
    ,	function(
        ProductListControlView
    ,   ProfileModel
    ,   Configuration
    ,   MenuTreeView

    , 	_

    )
    {
        'use strict';

        _.extend( ProductListControlView.prototype, {

            addNewProductToList: function (newList)
            {
                this.addItemToList(this.product, newList, true);
                this.saveAndShowConfirmationMessage(
                    _(Configuration.get('productList.itemAddedConfirmationText', '')).translate(1, newList.get('internalid'), newList.get('name'))
                );
            }

        ,	doAddItemToList: function (product, productList, dontShowMessage)
            {
                var self = this
                    ,	product_list_item = this.getNewItemData(product, productList);

                productList.get('items').create(product_list_item, {
                    success: function ()
                    {
                        self.collection.trigger('changed');
                        self.render();

                        if (!dontShowMessage)
                        {
                            self.saveAndShowConfirmationMessage(
                                _(Configuration.get('productList.itemAddedConfirmationText', '')).translate(1, productList.get('internalid'), productList.get('name'))
                            );
                        }
                    }
                });
            }

        ,    moveProduct: function (destination)
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
                        success: function (saved_model)
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
                                _('<div class="product-list-control-message">' + Configuration.get("productList.itemMovedConfirmationText", "The item was moved to") + ' <a href="/productlist/$(0)">$(1)</a></div>').
                                translate(destination.get('internalid'), destination.get('name'))
                            );
                        }
                    });
            }

        ,   getContext: _.wrap( ProductListControlView.prototype.getContext, function(fn)
            {
                var returnVariable = fn.apply(self, _.toArray(arguments).slice(1));

                _.extend(returnVariable , {
                    isLoggedIn: ProfileModel.getInstance().get('isLoggedIn') === 'T'
                });

                return returnVariable
            })
        });

    });
