/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module ItemViews
define(
	'ItemRelations.RelatedItem.View.Extension'
,	[
		'ItemRelations.RelatedItem.View'
	,	'Product.Model'
	,	'Cart.QuickAddToCart.View'

	,	'underscore'
	]
,	function (
		ItemRelationsRelatedItemView
	,	ProductModel
	,	CartQuickAddToCartView
	,	_
	)
{
	'use strict';

	_.extend(ItemRelationsRelatedItemView.prototype, {
		childViews: _.extend({}, ItemRelationsRelatedItemView.prototype.childViews, {
			'Cart.QuickAddToCart': function ()
			{
				var product = new ProductModel({
					item: this.model
					,	quantity: this.model.get('_minimumQuantity', true)
				});
				
				return new CartQuickAddToCartView({
					model: product
					,	application: this.options.application
				});
			}
		})
	})
});

//@class ItemViews.RelatedItem.View.Initialize.Options
//@property {Item.Model} model