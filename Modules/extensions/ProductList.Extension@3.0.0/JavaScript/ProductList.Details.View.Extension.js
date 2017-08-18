/*
	© 2017 LN Curtis
*/

define(
    'ProductList.Details.View.Extension'
    ,	[
        'ProductList.Details.View'
    ,   'ProductList.Item.Edit.View'

    ,	'underscore'
    ,   'jQuery'

    ]
    ,	function(
        ProductListDetailsView
    ,   ProductListItemEditView

    , 	_
    ,   jQuery

    )
    {
        'use strict';

        _.extend( ProductListDetailsView.prototype, {

            addItemToCartHandler : function (e)
            {
                e.stopPropagation();
                e.preventDefault();

                var self = this
                    ,	selected_product_list_item_id = self.$(e.target).closest('article').data('id')
                    ,	selected_product_list_item = self.model.get('items').findWhere({
                        internalid: selected_product_list_item_id.toString()
                        })
                    ,	selected_item = selected_product_list_item.get('item')
                    ,	selected_item_internalid = selected_item.internalid
                    ,	item_detail = selected_product_list_item.getItemForCart(selected_item_internalid, selected_product_list_item.get('quantity'), selected_item.itemoptions_detail, selected_product_list_item.getOptionsArray());

                item_detail['custitem_sc_call_for_pricing'] = selected_item.custitem_sc_call_for_pricing;

                var isCallForPricing = selected_item.custitem_sc_call_for_pricing || false;

                // only add items that are not call for pricing
                if (!isCallForPricing){
                    var add_to_cart_promise = this.addItemToCart(item_detail)
                    ,	whole_promise = jQuery.when(add_to_cart_promise).then(jQuery.proxy(this, 'showConfirmationHelper', selected_product_list_item));

                    if (whole_promise)
                    {
                        this.disableElementsOnPromise(whole_promise, 'article[data-item-id="' + selected_item_internalid + '"] a, article[data-item-id="' + selected_item_internalid + '"] button');
                    }
                }

            }

        ,	_getSelection: function()
            {
                var items = []
                    ,	items_for_cart = []
                    ,	button_selector = [];

                //Filter items for bulk operation
                _.each(this.collection.models, function(pli)
                {
                    //irrelevant items: no-op
                    if (pli.get('checked') !== true)
                    {
                        return;
                    }

                    items.push(pli);

                    var item = pli.get('item')
                        ,	item_internal_id = item.internalid
                        ,	item_for_cart = pli.getItemForCart(item_internal_id, pli.get('quantity'), item.itemoptions_detail, pli.getOptionsArray())
                        ,   isCallForPricing = item.custitem_sc_call_for_pricing || false;

                    if (!isCallForPricing) {
                        items_for_cart.push(item_for_cart);
                        button_selector.push('article[data-item-id="' + item_internal_id + '"] a, article[data-item-id="' + item_internal_id + '"] button');
                    }
                });

                //items: backbone models representing selected items
                //items_for_cart: selected models ready to be inserted into a cart
                //button_selector: all the buttons that should be disabled when performing a batch operation
                return {
                    items: new ProductListItemCollection(items)
                ,	items_for_cart: items_for_cart
                ,	button_selector: button_selector
                };
            }

        ,	addItemsToCartBulkHandler: function(e)
            {
                e.preventDefault();

                var self = this
                    ,	selected_models = this._getSelection();

                //no items selected: no opt
                if (selected_models.items.length < 1)
                {
                    return;
                }

                var button_selector = selected_models.button_selector.join(',');

                _.each(selected_models.items_for_cart, function (item) {
                    var matchingItem = _.findWhere(selected_models.items, function (model) {
                        return model.get('item').get('internalid') === item.get('internalid')
                    });

                    if(matchingItem && matchingItem.get('item')) {
                        var itemModel = matchingItem.get('item');
                        _.each(Object.keys(itemModel), function (key) {
                            item.set(key, itemModel[key]);
                        });
                        // normalize for matrix item (data thats stored on the parent has to be added b/c this is a child)
                        if(itemModel.matrix_parent) {

                            item.set('itemimages_detail', itemModel.matrix_parent['itemimages_detail']);
                            item.set('pagetitle2', itemModel.matrix_parent['pagetitle2']);
                            item.set('_pageHeader', itemModel.matrix_parent['pagetitle2']);
                        }
                    }

                });

                //add items to cart
                var add_to_cart_promise = this.cart.addProducts(selected_models.items.models);

                add_to_cart_promise.then(function ()
                {
                    var list = self.model
                        , items = self._getSelection()
                        , message = items.items_for_cart.length && items.items_for_cart.length > 1
                        ?  _(Configuration.get('productList.itemsAddedToCartConfirmationText', '')).translate(selected_models.items_for_cart.length, list.get('internalid'), list.get('name'))
                        : _(Configuration.get('productList.itemAddedToCartConfirmationText', '')).translate(selected_models.items_for_cart.length, list.get('internalid'), list.get('name'));

                    self.unselectAll();
                    self.showConfirmationMessage(_(message).translate(list.get('internalid'), list.get('name')));
                    self.showConfirmationHelper();

                });

                if (add_to_cart_promise)
                {
                    this.disableElementsOnPromise(add_to_cart_promise, button_selector);
                }
            }

        ,	showConfirmationHelper: function (selected_item)
            {
                // this.showConfirmationMessage(_('Good! The items were successfully added to your cart. You can continue to <a href="#" data-touchpoint="viewcart">view cart and checkout</a>').translate());

                //selected item may be undefined
                if (_.isUndefined(selected_item) === true)
                {
                    return;
                }

                this.addedToCartView = new ProductListAddedToCartView({
                    application: this.application
                    ,	parentView: this
                    ,	item: selected_item
                });

                this.application.getLayout().showInModal(this.addedToCartView);
            }

        ,	askEditListItem : function (e)
            {
                e.stopPropagation();

                var product_list_itemid = this.$(e.target).closest('[data-id]').data('id')
                    ,	selected_item = this.model.get('items').get(product_list_itemid);

                this.editView = new ProductListItemEditView({
                    application: this.application
                ,	parentView: this
                ,	model: selected_item
                ,	title: _('Edit Item').translate()
                ,	confirm_edit_method: 'editListItemHandler'
                });

                this.application.getLayout().showInModal(this.editView);
            }

        });

    });
