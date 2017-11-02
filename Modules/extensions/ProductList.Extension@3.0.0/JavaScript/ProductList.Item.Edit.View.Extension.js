/*
	© 2017 JHM Services
*/

// @module ProductList
define('ProductList.Item.Edit.View.Extension'
,	[	'ProductList.Item.Edit.View'
	//,	'ProductDetails.Options.Selector.Singles.View'
	
	,	'underscore'
	]
,	function (
		ProductListItemEditView
	//,	ProductDetailsOptionsSelectorSinglesView
	,	_
	)
{
	'use strict';

	_.extend(ProductListItemEditView.prototype, {
		/*childViews: _.extend({}, ProductListItemEditView.prototype.childViews, {
			'ItemDetails.Options.Single': function () {
				return new ProductDetailsOptionsSelectorSinglesView({
					model: this.model
					,	application: this.application
					,	show_pusher: false
					,	show_required_label: this.model.get('item').get('itemtype') === 'GiftCert'
				});
			}
		})*/
	});
	
});
