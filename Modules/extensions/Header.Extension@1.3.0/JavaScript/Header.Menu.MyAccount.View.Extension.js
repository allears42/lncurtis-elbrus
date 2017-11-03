/*
	© 2017 JHM Services
	Removing calls to load product lists
*/

// @module Header
define(
	'Header.Menu.MyAccount.View.Extension'
,	[
		'Header.Menu.MyAccount.View'
	,	'ProductList.Utils'
	,	'underscore'
	]
,	function(
		HeaderMenuMyAccountView
	,	ProductListUtils
	,	_
	)
{
	'use strict';

	_.extend(HeaderMenuMyAccountView.prototype, {
		initialize: function()
		{
			this.productListModule = ProductListUtils(this.options.application);
			
			this.isProductListEnabled = this.productListModule.isProductListEnabled();
			
			/*if (this.isProductListEnabled)
			{
				this.productListsPromise = this.productListModule.getProductListsPromise();
				
				this.product_list_collection = this.productListModule.getProductLists();
				
				var self = this;
				
				this.debounced_render = _.debounce(_.bind(this.render, this), 250);
				
				this.productListsPromise.done(function ()
				{
					_.each(self.product_list_collection.models, function (list)
					{
						list.get('items').on('add remove', function ()
						{
							self.debounced_render();
						}, this);
					}, this);
					
					self.debounced_render();
				});
				
				this.product_list_collection.on('add remove change:name', this.debounced_render);
			}
			else
			{*/
				this.productListsPromise = jQuery.Deferred();
			/*}*/
		}
	});
});