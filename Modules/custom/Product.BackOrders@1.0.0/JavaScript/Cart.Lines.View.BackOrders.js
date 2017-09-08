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
				,   allowBackorders = this.model.get('item').get('_allowBackorders', true);
			
			console.log(stock_level, current_quantity);
			
			
			_.extend(returnVariable, {
				//@property {Boolean} showBackorderMessage
				showBackorderMessage: !allowBackorders && current_quantity > stock_level && stock_level > 0
				//@property {String} backorderMessage
				, backorderMessage: _.translate('Limited quantities, only $(0) available. Please adjust the quantity in your cart.', stock_level)
			});
			
			return returnVariable;
		})
	});
});

