/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Cart
define('Cart.QuickAddToCart.View.Extension'
,	[
		'Cart.QuickAddToCart.View'
	,	'underscore'
	]
,	function (
		CartQuickAddToCartView
	,	_
	)
{
	'use strict';
	
	_.extend(CartQuickAddToCartView.prototype, {
		
		getContext: _.wrap(CartQuickAddToCartView.prototype.getContext, function (fn) {
			
			var returnVariable = fn.apply(this, _.toArray(arguments).slice(1))
				,   item = this.model.get('item');
			
			//console.log((customImage && customImage.value) ? customImage.value : item.get('_thumbnail').url, returnVariable);
			
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