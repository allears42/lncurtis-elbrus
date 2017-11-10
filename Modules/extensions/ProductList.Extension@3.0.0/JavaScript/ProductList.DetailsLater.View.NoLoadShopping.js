/*
	© 2017 JHM Services
	Don't load in shopping
*/

// @module ProductList
define('ProductList.DetailsLater.View.NoLoadShopping'
	,	[
			'ProductList.DetailsLater.View'
		,	'LiveOrder.Model'
		,	'Backbone.CompositeView'

		,	'underscore'
		]
	,	function(
		ProductListDetailsLaterViewNoLoadShopping
		,	LiveOrderModel
		,	BackboneCompositeView

		,	_
		)
{
	'use strict';

	_.extend(ProductListDetailsLaterViewNoLoadShopping.prototype, {
		initialize: function(options)
		{
			//this.loadProductList();
			BackboneCompositeView.add(this);
			
			this.options = options;
			this.application = options.application;
			this.cart = LiveOrderModel.getInstance();
			
			this.model.on('change', this.render, this);
			
			this.model.get('items').on('add remove change reset', this.render, this);
			
			// remove call to load product list unless in my account
			//this.promise = this.loadProductList();
			
		}
	});
});