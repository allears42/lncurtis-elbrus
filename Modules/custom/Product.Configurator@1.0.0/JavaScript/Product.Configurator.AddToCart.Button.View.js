/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Cart
define(
	'Product.Configurator.AddToCart.Button.View'
,	[
		'Cart.AddToCart.Button.View'
	,	'LiveOrder.Model'
	,	'LiveOrder.Line.Model'
	,	'Cart.Confirmation.Helpers'

	,	'product-configurator_add_to_cart_button.tpl'

	,	'Backbone'
	,	'underscore'
	,	'Utils'
	]
,	function (
		CartAddToCartButtonView
	,	LiveOrderModel
	,	LiveOrderLineModel
	,	CartConfirmationHelpers

	,	product_configurator_add_to_cart_button_tpl

	,	Backbone
	,	_
	)
{
	'use strict';

	//@class Cart.AddToCart.Button.View @extend Backbone.View
	return CartAddToCartButtonView.extend({

		//@property {Function} template
		template: product_configurator_add_to_cart_button_tpl

	,	events: {
			'click [data-type="add-all-to-cart"]': 'addToCart'
		}

		// @method addToCart Updates the Cart to include the current model
		// also takes care of updating the cart if the current model is already in the cart
		// @param {jQuery.Event} e
		// @return {Boolean}
	,	addToCart: function addToCart (e)
		{
			console.log('addToCart')
			e.preventDefault();

			var self = this
			,	cart_promise
			,   additonal_items_promise;

			if (!this.model.areAttributesValid(['options','quantity'], self.getAddToCartValidators()))
			{
				console.log('not valid');
				return;
			}

			if (!this.model.isNew() && this.model.get('source') === 'cart')
			{
 				cart_promise = this.cart.updateProduct(this.model);
				
 				if(this.selectedAdditionalItems.models.length > 0) {
					// add the other items
				    additonal_items_promise = this.cart.addProducts(this.selectedAdditionalItems.models);
				   
				    additonal_items_promise.then(function () {
						self.subtotalView.setAddToCartSuccess();
						CartConfirmationHelpers.showCartConfirmation(cart_promise, line, self.options.application);
					});
				}
				
 				cart_promise.done(function ()
 				{
 					self.options.application.getLayout().closeModal();
 				});
			}
			else
			{
				var line = LiveOrderLineModel.createFromProduct(this.model);
				cart_promise = this.cart.addLine(line);
				
				if(this.selectedAdditionalItems.models.length > 0) {
					// add the other items
					additonal_items_promise = this.cart.addProducts(this.selectedAdditionalItems.models);
					
					additonal_items_promise.then(function () {
						self.subtotalView.setAddToCartSuccess();
						CartConfirmationHelpers.showCartConfirmation(cart_promise, line, self.options.application);
					});
				}
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

//@class Cart.AddToCart.Button.View.Initialize.Options
//@property {Product.Model} model This view is only capable of adding new PRODUCTs into the cart.
//If you need to add something else please convert it into a Product.Model.
//
