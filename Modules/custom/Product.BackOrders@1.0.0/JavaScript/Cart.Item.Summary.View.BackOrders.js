/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Cart
define('Cart.Item.Summary.View.BackOrders'
,	[
		'Cart.Item.Summary.View'
	,	'LiveOrder.Model'
	,	'Backbone'
	,	'underscore'
	]
,	function (
		CartItemSummaryView
	,	LiveOrderModel
	,	Backbone
	,	_
	)
{
	'use strict';
	
	_.extend(CartItemSummaryView.prototype, {
		   getContext: _.wrap(CartItemSummaryView.prototype.getContext, function (fn) {
			
			var returnVariable = fn.apply(this, _.toArray(arguments).slice(1))
			,   stock_level = this.model.get('item').get('_stock')
		   ,    current_quantity = this.model.get('quantity')
			,   allowBackorders = this.model.get('item').get('_isBackorderable', true);
			
		    console.log(stock_level, current_quantity, !this.allowBackorders && current_quantity > stock_level);
			
			_.extend(returnVariable, {
				//@property {String} showMawQuantity
				showMawQuantity: !allowBackorders
				//@property {String} maxQuantity
				, maxQuantity: stock_level
				//@property {String} allowedQuantity
				, allowedQuantity: current_quantity
			});
			
			return returnVariable;
		})
		
		// @method addQuantity Add 1 to the quantity field
		// @param {jQuery.Event} e
		// @return {Void}
		,	addQuantity: function (e)
		{
			e.preventDefault();
			
			var $element = this.$(e.target)
			,	quantity_input = $element.parent().find('input')
			,	old_value = quantity_input.val()
			,	new_val = parseFloat(old_value) + 1
			,   allowBackorders = this.model.get('item').get('_isBackorderable', true)
			,   stock_level = this.model.get('item').get('_stock');
			
			// check for stock levels based on backorder behavior
			if(new_val > stock_level && !allowBackorders) {
				new_val = stock_level;
			}
			
			quantity_input.val(new_val);
			quantity_input.change();
		}
	});
});
