/*
	© 2017 LN Curtis
*/

//@module Transaction.Line.Views
define('Cart.Lines.View.BackOrders'
,	[
		'Cart.Lines.View'
	,	'underscore'
	]
,	function (
		CartLinesView
	,	_
	)
{
	'use strict';

	_.extend(CartLinesView.prototype, {
		getContext: _.wrap(CartLinesView.prototype.getContext, function (fn) {
			
			var returnVariable = fn.apply(this, _.toArray(arguments).slice(1))
				,   stock_level = this.model.get('item').get('_stock')
				,   current_quantity = this.model.get('quantity')
				,   allowBackorders = this.model.get('item').get('_isBackorderable', true);
			
			//console.log(stock_level, current_quantity, !allowBackorders && stock_level > 0);
			
			_.extend(returnVariable, {
				//@property {Boolean} showBackorderMessage
				showBackorderMessage: !allowBackorders && stock_level > 0
				//@property {String} backorderMessage
			,   backOrderMessage: _.translate('Limited quantities, only $(0) available.', stock_level)
				//@property {Boolean} showBackorderMessage
			,   showOverQuantityMessage: !allowBackorders && current_quantity > stock_level && stock_level > 0
				//@property {String} backorderMessage
			,   overQuantityMessage: _.translate('Limited quantities, only $(0) available. Please adjust the quantity in your cart.', stock_level)
			});
			
			return returnVariable;
		})
	});
});

