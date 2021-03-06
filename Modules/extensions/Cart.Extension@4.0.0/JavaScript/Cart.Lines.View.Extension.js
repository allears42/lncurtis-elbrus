/*
	© 2017 LN Curtis
*/

//@module Transaction.Line.Views
define('Cart.Lines.View.Extension'
,	[
		'Cart.Lines.View'
	,	'underscore'
	,	'ProductLine.Stock.Cart.View'
	,	'StateComplianceWarnings.View'
		
	]
,	function (
		CartLinesView
	,	_
	,	ProductLineStockCartView
	,	StateComplianceWarningsView
	)
{
	'use strict';

	_.extend(CartLinesView.prototype, {
		childViews: _.extend({}, CartLinesView.prototype.childViews, {
			
			'Item.Total.View': function ()
			{
				return new this.options.TotalView(_.extend({
					model: this.model
					,	application: this.options.application
				}, this.options.summaryOptions || {}));
			}

		,	'Product.Stock.Info': function ()
			{
				return new ProductLineStockCartView({
					model: this.model
				});
			}

		,	'StateWarnings.Icons': function()
            {
                return new StateComplianceWarningsView({
                    model: this.model
                })
            }
		})
	,   getContext: _.wrap(CartLinesView.prototype.getContext, function (fn) {
		
			var returnVar = fn.apply(this, _.toArray(arguments).slice(1))
			,   item = this.model.get('item')
			,   itemOptions = item.get('options') && item.get('options').models || []
			,   customImage = _.first(_.filter(itemOptions, function (option) {
				return option.get('cartOptionId') === "CUSTCOL_SC_ITEM_IMAGE"
			}))
			,   freeShip = _.first(_.filter(itemOptions, function (option) {
				return option.id === "CUSTCOL_WEB_FREE_SHIP"
			}));
			
			_.extend(returnVar, {
				imageUrl: (customImage && customImage.value) ? customImage.value : this.model.getThumbnail()
				,   freeGroundShipping: item.get('freeGroundShipping') || (freeShip && freeShip.value === "T")
			});
			
			return returnVar;
		})
	});
});

