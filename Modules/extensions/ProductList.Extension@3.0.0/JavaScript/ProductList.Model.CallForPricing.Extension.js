/*
	© 2017 LN Curtis
*/

define(
    'ProductList.Model.CallForPricing.Extension'
    ,	[
        'ProductList.Model'

    ,	'underscore'

    ]
    ,	function(
        ProductListModel

    , 	_

    )
    {
        'use strict';

        _.extend( ProductListModel.prototype, {

			// filter call for pricing items
            numberItemsAddableToCart: function(only_checked_items)
            {
                var items = !_.isUndefined(only_checked_items) ? new Backbone.Collection(this.get('items').filter(function (product_list_item) {
                        return product_list_item.get('checked');
                    }))
                    : this.get('items');

                if(!!items) {
                    var addable = _.filter(items.models, function (item) {
                        return item.get('item').custitem_sc_call_for_pricing === false;
                    });
                    return addable.length;
                }
                return 0;
            }

        ,	canBeAddedToCart: function(only_checked_items)
            {
                var items = !_.isUndefined(only_checked_items) ?
                    new Backbone.Collection(this.get('items').filter(function (product_list_item)
                    {
                        return product_list_item.get('checked');
                    })) :
                    this.get('items');


                return items.length && this.getOutOfStockItems(items).length === 0 && this.getNotPurchasableItemsDueToMinimumQuantity(items).length === 0 && this.numberItemsAddableToCart(only_checked_items) > 0;
            }

        });

    });
