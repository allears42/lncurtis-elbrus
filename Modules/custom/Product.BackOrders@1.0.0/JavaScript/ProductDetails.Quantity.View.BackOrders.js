/*
	© 2017 LN Curtis
*/

// @module ProductDetails
define(
	'ProductDetails.Quantity.View.BackOrders'
,	[
		'ProductDetails.Quantity.View'

	,	'LiveOrder.Model'
	,	'Utils'
	,	'underscore'
	]
,	function (
		ProductDetailsQuantityView

	,	LiveOrderModel
	,	Utils
	,	_
	)
{
	'use strict';
	
	_.extend(ProductDetailsQuantityView.prototype, {
		
		initialize: _.wrap(ProductDetailsQuantityView.prototype.initialize, function (fn, options) {
			fn.apply(this, _.toArray(arguments).slice(1));
			
			var self = this;
			self.isLoading = true;
			self.cart = LiveOrderModel.getInstance();
			self.lineForItemInCart = null;
			self.cart_quantity = 0;
			
			LiveOrderModel.loadCart().done(function ()
			{
				self.isLoading = false;
				self.checkForItemInCart();
			
				self.render();
			});
			
			this.model.on('change', this.modelOptionsChanged, this);
		})
		
	,   events: _.extend({}, ProductDetailsQuantityView.prototype.childViews, {
			// override this event
			'click [data-action="updateQuantity"]': 'setQuantity'
			// new events
		,	'blur [data-action="changeQuantity"]': 'updateQuantity'
		})
		
	,   checkForItemInCart: function () {
			var self = this
			,   item = self.model.get('item')
			,   childs = self.model.getSelectedMatrixChilds();
			
			//console.log(childs)
			
			if(childs && childs.length === 1) item = childs[0];
			
			self.lineForItemInCart = Utils.findItemInCart(item, self.cart);
			self.cart_quantity = self.lineForItemInCart && self.lineForItemInCart.get('quantity') || 0;
		}
		
		// @method setQuantity Increase the product's Quantity by 1
		// @param {jQuery.Event} e
		// @return {Void}
	,	setQuantity: function setQuantity (e)
		{
			e.preventDefault();
			
			var value = parseInt(this.$(e.currentTarget).data('value'), 10)
			,	$input_quantity = this.$('[name="quantity"]')
			,	old_value = parseInt($input_quantity.val(), 10)
			,	new_quantity = old_value + value;
			
			if(!this.allowBackorders) this.checkForAllowableQuantity(new_quantity, $input_quantity);
			else {
				$input_quantity.val(new_quantity);
				this.model.set('quantity', new_quantity);
			}
		}
		
		// custom handling for items with no back orders allowed
		// check the items quantity in cart and selected quantity and confirm that the amount selected can be met
		// if not, update the field to contain the allowable quantity
	,	updateQuantity: function setQuantity (e)
		{
			e.preventDefault();
			
			var new_quantity = parseInt(this.$(e.currentTarget).val(), 10)
			,	$input_quantity = this.$('[name="quantity"]');
			
			if(!this.allowBackorders) this.checkForAllowableQuantity(new_quantity, $input_quantity);
			else {
				$input_quantity.val(new_quantity);
				this.model.set('quantity', new_quantity);
			}
		}
		
	,   checkForAllowableQuantity: function (new_quantity, $input_quantity)
		{
			if(!this.isLoading) {
				if (_.isNull(this.lineForItemInCart)) {
					this.checkForItemInCart();
					this.reconcileQuantity();
				}
				
				var allowed_quantity = (this.stock_level - this.cart_quantity < 0) ? 0 : this.stock_level - this.cart_quantity;
				
				if(new_quantity > allowed_quantity) {
					new_quantity = allowed_quantity;
				}
				
				$input_quantity.val(new_quantity);
				this.model.set('quantity', new_quantity);
				
			}
		}
		
	,   modelOptionsChanged: function () {
			this.reconcileQuantity();
			this.render();
		}
		
	,   reconcileQuantity: function () {
			
			var item = this.model.get('item')
			,   childs = this.model.getSelectedMatrixChilds();
			if(childs && childs.length === 1) item = childs[0];
			
			this.backorderMessage = "";
			this.allowBackorders = item.get('_isBackorderable', true);
			
			
			this.stock_level = this.lineForItemInCart ? this.lineForItemInCart.get('item').get("_stock", true) : item.get('quantityAvailable');
			
			if (this.cart_quantity > 0) {
				this.backorderMessage = _.translate('Limited quantities, only $(0) available. You have $(1) in your cart.', this.stock_level, this.cart_quantity);
			}
			else {
				this.backorderMessage = _.translate('Limited quantities, only $(0) available.', this.stock_level);
			}
		}
		
	,   getContext: _.wrap(ProductDetailsQuantityView.prototype.getContext, function (fn) {
			this.reconcileQuantity();
			
			var returnVariable = fn.apply(this, _.toArray(arguments).slice(1))
			, current_quantity = this.model.get('quantity')
			, set_max_quantity = this.stock_level > 0 && !this.allowBackorders
			, allowed_quantity = (this.stock_level - this.cart_quantity <= 0) ? 0 : this.stock_level - this.cart_quantity;
			
			
			if(!this.allowBackorders && current_quantity > allowed_quantity) {
				current_quantity = allowed_quantity;
			}
			
			_.extend(returnVariable, {
				//@property {String} showMawQuantity
				showMawQuantity: set_max_quantity
				//@property {String} maxQuantity
				, maxQuantity: allowed_quantity
				//@property {Boolean} showBackorderMessage
				, showBackorderMessage: !this.allowBackorders
				//@property {String} backorderMessage
				, backorderMessage: this.backorderMessage
				//@property {String} allowedQuantity
				, allowedQuantity: current_quantity
			});
			
			return returnVariable;
		})
	});
});
