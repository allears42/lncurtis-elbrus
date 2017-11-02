/*
	© 2017 LN Curtis
*/

define(
    'ProductList.BulkActions.View.Extension'
    ,	[
        'ProductList.BulkActions.View'

    ,	'underscore'

    ]
    ,	function(
        ProductListBulkActionsView

        , 	_

    )
    {
        'use strict';

        _.extend( ProductListBulkActionsView.prototype, {

        	getContext: _.wrap( ProductListBulkActionsView.prototype.getContext, function(fn)
                {
                    var self = this
                    ,   returnVariable = fn.apply(self, _.toArray(arguments).slice(1));

                    var model = self.options.model
                    ,	isAtLeastOneItemChecked = model.someCheckedItemsExist()
                    ,   numberAddable = model.numberItemsAddableToCart(true)
                    ,   numberRemovable = model.get('items').filter(function (product_list_item) {
                        return product_list_item.get('checked');
                    });
	
	                //console.log(isAtLeastOneItemChecked , model.canBeAddedToCart(true))
	                
                    _.extend( returnVariable , {
                        isRemovableEnabled: isAtLeastOneItemChecked
                    ,   numberRemovable: numberRemovable.length > 0 ? "("+ numberRemovable.length +")" : ""
                    ,	numberAddable: numberAddable > 0 ? "("+ numberAddable +")" : ""
                    ,   isAddToCartEnabled: isAtLeastOneItemChecked && numberAddable > 0

                    });

                    return returnVariable
                })

        });

    });
