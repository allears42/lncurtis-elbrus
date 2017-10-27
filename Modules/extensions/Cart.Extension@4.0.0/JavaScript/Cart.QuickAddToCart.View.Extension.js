/*
	© 2017 JHM Services
	Add hideComparePrice to pass variable that allows us to hide the compare price on the PLP
	Add _url to return variable
*/

//@module Cart
define('Cart.QuickAddToCart.View.Extension'
,	[
		'Cart.QuickAddToCart.View'
	,	'ProductViews.Price.View'
	,	'underscore'
	]
,	function (
		CartQuickAddToCartView
	,	ProductViewsPriceView
	,	_
	)
{
	'use strict';
	
	_.extend(CartQuickAddToCartView.prototype, {
		initialize: _.wrap(CartQuickAddToCartView.prototype.initialize, function (fn, options) {
			fn.apply(this, _.toArray(arguments).slice(1));
			
			this.hideComparePrice = options.hideComparePrice || false;
		})
		
	,   childViews: _.extend({}, CartQuickAddToCartView.prototype.childViews, {
			
			'ProductViewsPrice.Price': function ()
			{
				return new ProductViewsPriceView({
					model: this.model
				,	origin: 'ITEMCELL'
				,   hideComparePrice: this.hideComparePrice
				});
			}
		})
		
	,   getContext: _.wrap(CartQuickAddToCartView.prototype.getContext, function (fn) {
			
			var returnVariable = fn.apply(this, _.toArray(arguments).slice(1))
			,   item = this.model.get('item');
			
			// console.log((customImage && customImage.value) ? customImage.value : item.get('_thumbnail').url, returnVariable);
			
			// add custom parameters to return variable
			_.extend(returnVariable, {
				url: item.get('_url')
			});
			
			// @class Cart.Confirmation.View.Context
			return returnVariable
		})
	});

});

//@class Cart.QuickAddToCart.View.Initialize.Options
//@property {Product.Model} model