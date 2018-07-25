define('ProductLine.Stock.Cart.View'
,   [
        'ProductLine.Stock.View'
    ,   'product_line_stock_cart.tpl'
    ]
,   function
    (
        ProductLineStockView 
    ,   product_line_stock_cart_tpl 
    ) 
{
    'use strict';
    
    return ProductLineStockView.extend({
        
        template: product_line_stock_cart_tpl

    ,   getContext: function ()
        {
            var item = this.model.get('item')
            ,   isBackorderable = item.get('_isBackorderable')
            ,   quantityAvailable
            ,   cartQuantity
            ,   inStockMessage;
    
            this.stock_info = this.model.getStockInfo();    
            inStockMessage = this.stock_info.inStockMessage;
    
            if(isBackorderable) {
    
                quantityAvailable = parseInt(item.get('quantityavailable'), 10);
                cartQuantity = parseInt(this.model.get('quantity'), 0);
    
                if(cartQuantity > quantityAvailable) {
                    
                    inStockMessage = 'Only ' + quantityAvailable + ' in stock. Remaining will be back ordered and ' +
                        'shipped to you once available.'
                }
            }
        
            //@class ProductLine.Stock.View.Context
            return {
                //@property {Boolean} showOutOfStockMessage
                showOutOfStockMessage: !!(!this.stock_info.isInStock && this.stock_info.showOutOfStockMessage)
                //@property {Item.Model.StockInfo} stockInfo
                ,	stockInfo: this.stock_info
                //@property {Item.Model|Transaction.Line.Model|Item.Model model
                ,	model: this.model
                //@property {Boolean} showInStockMessage
                ,	showInStockMessage: !(!this.stock_info.isInStock && this.stock_info.showOutOfStockMessage) && !!this.stock_info.showInStockMessage
                //@property {Boolean} isNotAvailableInStore
                ,	isNotAvailableInStore: this.stock_info.isNotAvailableInStore
                //@property {String} inStockMessage
                ,   inStockMessage: inStockMessage
            };
            //@class ProductLine.Stock.View
        }
    });
});