/*
	© 2017 LN Curtis
*/

// @module Product.Configurator
define('Product.Configurator.AdditionalProducts.View'
	,	[	'Backbone.CollectionView'
		,	'Product.Configurator.AdditionalProduct.View'
		,	'Product.Configurator.Model'
		,	'SC.Configuration'
		
		,	'additional_product_cell.tpl'
		,	'additional_product_items.tpl'
		,	'additional_product_row.tpl'
		
		,	'jQuery'
		,	'Backbone'
		,	'underscore'
		,	'Utils'
	]
	,	function (
		BackboneCollectionView
		,	ItemRelationsRelatedItemView
		,	ProductConfiguratorModel
		,	Configuration
		
		,	additional_product_cell_tpl
		,	additional_product_items_tpl
		,	additional_product_row_tpl
		
		,	jQuery
		,	Backbone
		,	_
	)
	{
		'use strict';
		
		// @class ItemRelations.Related.View @extends Backbone.CollectionView
		return BackboneCollectionView.extend({
			
			initialize: function (options)
			{
				var is_sca_advance = this.options.application.getConfig('siteSettings.sitetype') === 'ADVANCED'
				,	collection = is_sca_advance ? new ProductConfiguratorModel({itemsIds: this.options.itemsIds}) : new Backbone.Collection()
				,	layout = this.options.application.getLayout()
				,	self = this;
				
				BackboneCollectionView.prototype.initialize.call(this, {
					collection: collection
					,	viewsPerRow: Infinity
					,	cellTemplate: additional_product_cell_tpl
					,	rowTemplate: additional_product_row_tpl
					,	childView: ItemRelationsRelatedItemView
					,	template: additional_product_items_tpl
					,   childViewOptions: {
							productsTitle: options.additionalProductsTitle						}
				});
				
				if (is_sca_advance)
				{
					layout.once('afterAppendView', self.loadItems, self);
				}
			}
			
		,	loadItems: function loadRelatedItem ()
			{
				var self = this;
				
				self.collection.fetchItems().done(function ()
				{
					self.render();
					
				});
			}
			
		,	destroy: function destroy ()
			{
				this._destroy();
				
				var	layout = this.options.application.getLayout();
				
				layout.off('afterAppendView', this.loadItems, this);
				layout.currentView && layout.currentView.off('afterCompositeViewRender', this.loadItems, this);
			}
		});
	});
