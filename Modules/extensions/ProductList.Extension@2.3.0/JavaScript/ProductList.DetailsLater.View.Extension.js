/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ProductList
define('ProductList.DetailsLater.View.Extension'
	,	[
			'ProductList.DetailsLater.View'

		,	'underscore'
		]
	,	function(
            ProductListDetailsLaterView
		,	_
		)
{
	'use strict';

	// @class ProductList.DetailsLater.View.Extension @extends ProductList.DetailsLater.View

    _.extend(ProductListDetailsLaterView.prototype, {
        // @method addItemToCartHandler Add a particular item into the cart
        // we override this method to add the properties of the item to the model so that custom fields can be set based on item data
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
            ,   item_detail = selected_product_list_item.getItemForCart(selected_item_internalid, selected_product_list_item.get('quantity'), selected_item.itemoptions_detail, selected_product_list_item.getOptionsArray());
            
            //console.log(selected_item, 'selected_product_list_item', selected_product_list_item)
            
            _.each(Object.keys(selected_item), function (key) {
                item_detail.set(key, selected_item[key])
            });
    
            // normalize for matrix item (data thats stored on the parent has to be added b/c this is a child)
            if(selected_item.matrix_parent) {
        
                //console.log(selected_item.matrix_parent);
    
                item_detail.set('itemimages_detail', selected_item.matrix_parent['itemimages_detail']);
                item_detail.set('pagetitle2', selected_item.matrix_parent['pagetitle2']);
                item_detail.set('_pageHeader', selected_item.matrix_parent['pagetitle2']);
            }
            
            var	add_to_cart_promise = this.addItemToCart(item_detail)
            ,	whole_promise = jQuery.when(add_to_cart_promise, this.deleteListItem(selected_product_list_item)).then(jQuery.proxy(this, 'executeAddToCartCallback'));
            
            if (whole_promise)
            {
                this.disableElementsOnPromise(whole_promise, 'article[data-item-id="' + selected_item_internalid + '"] a, article[data-item-id="' + selected_item_internalid + '"] button');
            }
        }
    });
});
