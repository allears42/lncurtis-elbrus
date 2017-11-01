/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Cart
define(
	'Cart.AddToCart.Button.View.Extension'
,	[
		'Cart.AddToCart.Button.View'
		
	,	'LiveOrder.Line.Model'
	,	'Cart.Confirmation.Helpers'
	
	,	'underscore'
	,	'Utils'
	]
,	function (
		CartAddToCartButtonView
		
	,	LiveOrderLineModel
	,	CartConfirmationHelpers
	
	,	_
	)
{
	'use strict';

	_.extend(CartAddToCartButtonView.prototype, {
		
		addToCart: _.wrap(CartAddToCartButtonView.prototype.addToCart, function (fn, e) {
			e.preventDefault();
			
			var self = this
			,	cart_promise;
			
			if (!this.model.areAttributesValid(['options','quantity'], self.getAddToCartValidators()))
			{
				return;
			}
			
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
				
				if(location.href.indexOf('cart') > -1) {
					if(SC.ENVIRONMENT.jsEnvironment === "browser") {
						setTimeout(function () {
							jQuery('html, body').animate({scrollTop: '0px'}, 300);
						}, 500);
					}
					
				}
				else {
					CartConfirmationHelpers.showCartConfirmation(cart_promise, line, self.options.application);
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
		})
	});
});

//@class Cart.AddToCart.Button.View.Initialize.Options
//@property {Product.Model} model This view is only capable of adding new PRODUCTs into the cart.
//If you need to add something else please convert it into a Product.Model.
//
