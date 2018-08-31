/*
	© 2017 LN Curtis
*/

define(
    'ProductList.Model.CallForPricing.Extension'
    ,	[
        'ProductList.Model'
    ,	'Backbone'
    ,	'underscore'

    ]
    ,	function(
        ProductListModel
    , 	Backbone
    , 	_

    )
    {
        'use strict';

        _.extend( ProductListModel.prototype, {

			// filter call for pricing items
            numberItemsAddableToCart: function(only_checked_items)
            {
                var items = (!_.isUndefined(only_checked_items) && only_checked_items != null )? new Backbone.Collection(this.get('items').filter(function (product_list_item) {
                        return product_list_item.get('checked');
                    }))
                    : this.get('items');
	            
                if(!!items) {
                    var addable = _.filter(items.models, function (item) {
                        return item.get('item').get('custitem_sc_call_for_pricing') === false;
                    });
	
                    return addable.length;
                }
                return 0;
            }

            /**
             * When we are displaying the product list page (not product list detail), if ANY item in the list is a
             * CFP (call for pricing) item, we don't want to allow the user to add the list to the cart. This method
             * checks to see if any items are CFP, and if so, it returns false; if not, it returns true.
             * @param items
             * @returns {boolean}
             */
        ,   hasCFPItems: function(items)
            {
                var hasCFPItemsFlag = false;

                if(!!items) {
                    hasCFPItemsFlag = _.some(items.models, function(item) {
                        return item.get('item').get('custitem_sc_call_for_pricing') == true;
                    });
                }

                return hasCFPItemsFlag;
            }

        ,	canBeAddedToCart: function(only_checked_items, reject_if_cfp_items_in_list)
            {
                var items
                ,   canBeAddedFlag
                ,   hasCFPItems;

                items = (!_.isUndefined(only_checked_items) && only_checked_items != null)?
                    new Backbone.Collection(this.get('items').filter(function (product_list_item)
                    {
                        return product_list_item.get('checked');
                    })) :
                    this.get('items');

                canBeAddedFlag =
                    items.length
                    && this.getOutOfStockItems(items).length === 0
                    && this.getNotPurchasableItemsDueToMinimumQuantity(items).length === 0
                    && this.numberItemsAddableToCart(only_checked_items) > 0;

                if(!_.isUndefined(reject_if_cfp_items_in_list) && reject_if_cfp_items_in_list) {

                    hasCFPItems = this.hasCFPItems(items);
                    canBeAddedFlag = (canBeAddedFlag == true) && (!hasCFPItems);
                }

                return canBeAddedFlag;
            }

        });

    });
