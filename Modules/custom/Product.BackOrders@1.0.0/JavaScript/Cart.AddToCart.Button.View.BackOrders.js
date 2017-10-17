/*
	© 2017 LN Curtis
*/

// @module Cart
define(
	'Cart.AddToCart.Button.View.BackOrders'
,	[
		'Cart.AddToCart.Button.View'
	,	'LiveOrder.Model'
	,	'LiveOrder.Line.Model'
	,	'Cart.Confirmation.Helpers'

	,	'cart_add_to_cart_button.tpl'

	,	'Backbone'
	,	'underscore'
	,	'Utils'
	]
,	function (
		CartAddToCartButtonView
	,	LiveOrderModel
	,	LiveOrderLineModel
	,	CartConfirmationHelpers

	,	cart_add_to_cart_button_tpl

	,	Backbone
	,	_
	,	Utils
	)
{
	'use strict';

	_.extend(CartAddToCartButtonView.prototype, {
		addToCart: function addToCart (e)
		{
			e.preventDefault();
			
			var self = this
			,	cart_promise;
			
			if (!this.model.areAttributesValid(['options','quantity'], self.getAddToCartValidators()))
			{
				return;
			}
			
			// add quantity check
			//console.log(this.model, this.model.isNew(), this.model.get('source'))
			var item = this.model.get('item')
			,   childs = self.model.getSelectedMatrixChilds();
			
			
			if(childs && childs.length === 1) item = childs[0];
			
			var stock_level = item.get('_stock')
			,   new_quantity = item.get('quantity')
			,   allow_backorders = item.get('_isBackorderable')
			,   lineForItemInCart = Utils.findItemInCart(item, self.cart)
			,   cart_quantity = lineForItemInCart && lineForItemInCart.get('quantity') || 0;
			
			//console.log(this.model, allow_backorders, lineForItemInCart, cart_quantity, stock_level, new_quantity);
			
			if(!allow_backorders) {
				// DO CHECK
				if(cart_quantity + new_quantity > stock_level) {
					return;
				}
			}
			
			// end quantity check
			
			if (!this.model.isNew() && this.model.get('source') === 'cart')
			{
				cart_promise = this.cart.updateProduct(this.model);
				cart_promise.done(function ()
				{
					self.options.application.getLayout().closeModal();
				});
			}
			else
			{
				var line = LiveOrderLineModel.createFromProduct(this.model);
				cart_promise = this.cart.addLine(line);
				CartConfirmationHelpers.showCartConfirmation(cart_promise, line, self.options.application);
			}
			
			cart_promise.fail(function (jqXhr)
			{
				var error_details = null;
				try
				{
					var response = JSON.parse(jqXhr.responseText);
					error_details = response.errorDetails;
				}
				finally
				{
					if (error_details && error_details.status === 'LINE_ROLLBACK')
					{
						self.model.set('internalid', error_details.newLineId);
					}
				}
				
			});
			
			this.disableElementsOnPromise(cart_promise, e.target);
			return false;
		}
	});
});
