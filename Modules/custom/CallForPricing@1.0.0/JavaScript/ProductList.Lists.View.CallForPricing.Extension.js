/*
	© 2017 LN Curtis
*/

define(
    'ProductList.Lists.View.CallForPricing.Extension'
    ,	[
        'ProductList.Lists.View'
    ,   'LiveOrder.Model'
    ,   'ProductList.AddedToCart.View'
    ,   'ProductList.Model'
    ,	'SC.Configuration'
    ,	'underscore'

    ]
    ,	function(
        ProductListListsView
    ,   LiveOrderModel
    ,   ProductListAddedToCartView
    ,   ProductListModel
    , 	Configuration
    , 	_

    )
    {
        'use strict';

        _.extend( ProductListListsView.prototype, {

            title: _('Product Lists').translate()

	        // filter Call for Pricing items
        ,   addListToCart: function (list)
            {
                // collect the items data to add to cart
                var lines_to_add = []
                    ,	self = this
                    ,	not_purchasable_items_count = 0;

                list.get('items').each(function (pli)
                {
                    var store_item = pli.get('item')
                        , matrix_parent = store_item.matrix_parent || store_item
                        , isCallForPricing = matrix_parent.custitem_sc_call_for_pricing || false;

                    if (store_item.ispurchasable && !isCallForPricing)
                    {
                        var cart_item_detail = pli.getItemForCart(store_item.internalid, pli.get('quantity'), store_item.itemoptions_detail, pli.getOptionsArray());

                        lines_to_add.push(cart_item_detail);
                    }
                    else
                    {
                        not_purchasable_items_count ++;
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
		                    confirmMessage =  _(Configuration.get('productList.itemsAddedToCartConfirmationText', '')).translate(add_items.length, list.get('internalid'), list.get('name'));
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

        });

    });
