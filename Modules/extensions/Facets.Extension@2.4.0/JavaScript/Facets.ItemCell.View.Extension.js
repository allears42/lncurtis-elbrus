/*
	© 2017 LN Curtis
	
	
	Add hideComparePrice to pass variable that allows us to hide the compare price on the PLP
*/

define(
    'Facets.ItemCell.View.Extension'
    ,	[
            'Facets.ItemCell.View'
        ,   'ProductViews.Price.View'
        ,   'ProductLine.Stock.View'
        ,   'Product.Model'
        ,   'Cart.QuickAddToCart.View'
        ,   'SC.Configuration'
    
        ,	'underscore'

    ]
    ,	function(
            FacetsItemCellView
        ,   ProductViewsPriceView
        ,   ProductLineStockView
        ,   ProductModel
        ,   CartQuickAddToCartView
        ,   Configuration
        , 	_
        
    )
    {
        'use strict';

        _.extend( FacetsItemCellView.prototype, {
			childViews: _.extend({}, FacetsItemCellView.prototype.childViews, {
                'ItemViews.Stock': function()
                {
                    return new ProductLineStockView({
	                    model: this.model
	                    , origin: "FACET_CELL"
	                    , application: this.application
                    });
                }
				// override to pass custom showComparePrice var
			,	'Cart.QuickAddToCart': function ()
				{
					var product = new ProductModel({
						item: this.model
                    ,	quantity: this.model.get('_minimumQuantity', true)
					});
					
					return new CartQuickAddToCartView({
						model: product
					,	application: this.options.application
					,   hideComparePrice: true
					});
				}

            ,   'Bestseller.Price': function ()
                {
                    return new ProductViewsPriceView({
                        model: this.model
                    ,	origin: 'ITEMCELL_SEARCH'
                    });
                }

            })

        ,	getContext: _.wrap( FacetsItemCellView.prototype.getContext, function(fn) {
                // check for back order status and if the item allows back orders
                var self = this
                ,   returnVariable = fn.apply(self, _.toArray(arguments).slice(1))
                ,   stock_level = this.model.get("_stock", true) || 0
                ,   allowBackorders = this.model.get("_isBackorderable", true)
                ,   set_max_quantity = stock_level > 0 && !allowBackorders;
                
                _.extend(returnVariable ,{
                    seoURL: window.location.protocol + '//' + window.location.hostname + this.model.get('_url')
                ,	storeDescription: this.model.get('storedescription')
                ,	setMaxQuantity: set_max_quantity
                ,	maxQuantity: stock_level
            
                });
        
                return returnVariable
            })

        });
    });
