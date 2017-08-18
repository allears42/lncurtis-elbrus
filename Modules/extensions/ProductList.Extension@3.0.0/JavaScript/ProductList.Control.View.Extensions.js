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

            initialize: _.wrap( ProductListControlView.prototype.initialize, function(fn)
            {
                var self = this
                ,   options = _.toArray(arguments)[1];

                self.isDisabledWishlistButton = options.isDisabledWishlistButton;

                fn.apply(self, _.toArray(arguments).slice(1));

            })

        ,   render: _.wrap( ProductListControlView.prototype.render, function(fn)
            {
                var self = this;

                fn.apply(self, _.toArray(arguments).slice(1));

                // we don't want to disable the control button for guest users because we want to send them to login page on click
                if (ProfileModel.getInstance().get('isLoggedIn') === 'T' && !self.isReadyForList())
                {
                    self.$('[data-action="show-productlist-control"]').attr('disabled', 'true');
                }

            })

        ,	addNewProductToList: function (newList)
            {
                this.addItemToList(this.product, newList, true);
                this.saveAndShowConfirmationMessage(
                    _(Configuration.get('productList.itemAddedConfirmationText', '')).translate(1, newList.get('internalid'), newList.get('name'))
                );
            }

        ,   addItemToList: _.wrap( ProductListControlView.prototype.addItemToList, function(fn)
            {

                var self = this;

                if (self.validateGiftCertificate(self.line))
                {
                    fn.apply(self, _.toArray(arguments).slice(1));
                }

            })

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
                            _('<div class="product-list-control-message">' + Configuration.get("productList.itemMovedConfirmationText", "The item was moved to") + ' <a href="/productlist/$(0)">$(1)</a></div>').translate(destination.get('internalid'), destination.get('name'))
                        );
                    }
                    });
            }

        ,	isReadyForList: function ()
            {
                return this.mode === 'move' || this.product.isSelectionComplete();
                // if you want to add only purchasable products to a product list then you can change the above with:
                // return this.product.isReadyForCart();
            }

        ,   getContext: _.wrap( ProductListControlView.prototype.getContext, function(fn)
            {
                var self = this
                ,   returnVariable = fn.apply(self, _.toArray(arguments).slice(1));

                _.extend( returnVariable, {
                    isDisabledWishlistButton: this.isDisabledWishlistButton
                ,   isLoggedIn: ProfileModel.getInstance().get('isLoggedIn') === 'T'
                });

                return returnVariable

            })

        });

    });
