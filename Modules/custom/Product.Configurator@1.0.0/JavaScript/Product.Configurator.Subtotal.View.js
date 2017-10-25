/*
    © 2017 LN Curtis
 */

//@module Product.Configurator
define(
	'Product.Configurator.Subtotal.View'
	,	[
			'product_configurator_subtotal.tpl'
		,   'Backbone'
		,   'underscore'
	]
	,	function (
			product_configurator_subtotal_tpl
		,   Backbone
		,   _
	)
	{
		'use strict';
		
		return Backbone.View.extend({
			
			template: product_configurator_subtotal_tpl
			
		,   initialize: function (options) {
				this.options = options;
				this.application = options.application;
				this.subtotal = _.formatCurrency(options.subtotal);
				this.model = options.model;
				this.selectedAdditionalItems = options.selectedAdditionalItems;
			}
			
			// these are triggers that the paren view will listen to and dispatch the events
			// to keep all handling in parent builder view
		,   events: {
				'click [data-action="add-all-to-cart"]': 'addAllToCart'
			}
			
		,   setTotal: function (selectedProducts)
			{
				console.log('setTotal', selectedProducts)
				var self = this
				,   selectedItems = []
				,   price = this.model.get('item').getPrice().price;
				
				var total = _.reduce(selectedProducts.models, function (memo, item) {
					var price = item && item.getPrice().price || 0
					,   qty = item.get('quantity');
					
					console.log(price, qty);
					
					return memo + (price * qty);
				}, 0);
				
				this.subtotal = _.formatCurrency(total+price);
				
				console.log(this.subtotal)
				
				this.render();
			}
			
		,   setAddToCartSuccess: function () {
				
				var $button = this.$el.find('[data-type="add-all-to-cart"]');
				
				$button.text('Added to Cart');
				if(SC.ENVIRONMENT.jsEnvironment === 'browser') {
					setTimeout(function () {
						$button.text('Checkout')
					}, 1600);
				}
			}
			
		,   getContext: function() {
				return {
					subtotal: this.subtotal
				}
				
			}
		});
		
	});