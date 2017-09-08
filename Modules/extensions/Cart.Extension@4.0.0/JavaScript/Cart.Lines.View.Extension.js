/*
	© 2017 LN Curtis
*/

//@module Transaction.Line.Views
define('Cart.Lines.View.Extension'
,	[
		'Cart.Lines.View'
	,	'underscore'
	]
,	function (
		CartLinesView
	,	_
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
		})
	});
});

