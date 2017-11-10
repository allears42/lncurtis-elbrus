/*
	© 2017 LN Curtis
*/

//@module ProductDetails
define(
	'ProductDetails.Full.View.Configurator'
,	[
		'ProductDetails.Full.View'
	,	'Product.Configurator.AdditionalProducts.View'
	,	'Product.Configurator.Subtotal.View'
	,	'Product.Configurator.AddToCart.Button.View'
	,	'Product.Configurator.FieldConfig'
	
	,	'product_details_full_configurator.tpl'
	
	,   'ProductViews.Option.View'
	,   'Cart.Confirmation.Helpers'
	
	,   'Item.Collection'
	,   'Product.Model'
	,   'LiveOrder.Model'
	,   'LiveOrder.Line.Model'
	
	,	'Backbone.CollectionView'
	,	'SC.Configuration'
	,	'underscore'
	,	'jQuery'

	]
,	function (
		ProductDetailsFullView
	,	ProductConfiguratorAdditionalProductsView
	,	ProductConfiguratorSubtotalView
	,	ProductConfiguratorAddToCartButtonView
	,	ProductConfiguratorFieldConfig
	
	,	product_details_full_configurator_tpl
	
	,   ProductViewsOptionView
	,   CartConfirmationHelpers
	
	,   ItemCollection
	,   ProductModel
	,   LiveOrderModel
	,   LiveOrderLineModel
	
	,	BackboneCollectionView
	,	Configuration
	,	_
	)
{
	'use strict';

	_.extend(ProductDetailsFullView.prototype, {
		
		initialize: _.wrap(ProductDetailsFullView.prototype.initialize, function (fn) {
			fn.apply(this, _.toArray(arguments).slice(1));
			
			if(this.model.getItem().get('internalid') === 531962) {
				this.template = product_details_full_configurator_tpl;
				
				this.customSortOrder = Configuration.get("itemOptionsSort");
			
				this.cart = LiveOrderModel.getInstance();
				
				this.tooltips = Configuration.get('configurator.tooltips');
				
				this.additionalProductsConfig = this.getAdditionalProducts();
				this.setAdditionalProductsView();
				
				this.subtotalView = new ProductConfiguratorSubtotalView({
					application: this.application
					, model: this.model
					, selectedAdditionalItems: []
					, subtotal: this.model.get('item').getPrice().price || 0
				});
				
				this.selectedAdditionalItems = new ItemCollection();
				
				this.mainActionViewInstance = new ProductConfiguratorAddToCartButtonView({
					application: this.options.application
					,	model: this.model
				});
			}
			
		})
		
	,   events: _.extend({}, ProductDetailsFullView.prototype.events, {
			'blur .product-configurator-additional-quantity-input': 'quantityChanged'
		})
		
	,   getAdditionalProducts: function () {
			var additionalProductsConfig = Configuration.get('configurator.additionalProducts', [])
			,   thisProduct = this.model.get('item').get('internalid')
			,   areasForThisProduct = {};
			
			if(_.isArray(additionalProductsConfig) ) {
				areasForThisProduct = _.first(_.filter(additionalProductsConfig, function (config) {
					return config.configuratorProductIDs.indexOf(thisProduct) > -1;
				}));
			}
			else {
				if(additionalProductsConfig.configuratorProductIDs.indexOf(thisProduct) > -1) {
					areasForThisProduct = additionalProductsConfig
				}
			}
			
			console.log(areasForThisProduct);
			return areasForThisProduct;
			
		}
		
	,   setAdditionalProductsView: function () {
			
			this.additionalProductsView = new ProductConfiguratorAdditionalProductsView({
				application: this.application
				, itemsIds: this.additionalProductsConfig.productIDs
				, additionalProductsTitle: this.additionalProductsConfig.sectionTitle
				, additionalProductsToottip: this.additionalProductsConfig.tooltip
			});
			
			this.additionalProductsView.on('sync', this.additionalProductsLoaded, this);
			
			// todo: handle multiple sets of additional products
		}
		
	,   quantityChanged: function (evt) {
			var self = this
			,   $elem = jQuery(evt.target)
			,   itemID = $elem.data('item-id');
			
			// look if the selected item is already in the collection
			var selectedItem = _.find(this.selectedAdditionalItems.models, function (model) {
				console.log('selectedItem', model.get('item').get('internalid'), itemID);
				return model.get('item').get('internalid') === parseInt(itemID);
			});
			
			if(selectedItem) {
				console.log('selectedItem found');
				selectedItem.set('quantity', parseInt($elem.val()));
			}
			else {
				
				var itemModel = _.find(this.additionalProductsView.collection.models, function (model) {
					console.log(model.get('internalid'), itemID);
					return model.get('internalid') === parseInt(itemID);
				});
				
				var productModel = new ProductModel({
					item: itemModel
					, quantity: parseInt($elem.val())
				});
				
				self.selectedAdditionalItems.add(productModel);
			}
			this.subtotalView.setTotal(self.selectedAdditionalItems)
		}
		
	,   selectorView: function (options) {
			var self = this
			,   options_to_render = _.sortBy(options, function (option) {
				var sort = _.find(self.customSortOrder, {itemOptionId: option.itemOptionId}) || '1000';
				option.tooltip = _.find(self.tooltips, function (tip) {
					return tip.fieldID.toLowerCase() === option.get('cartOptionId').toLowerCase();
				});
				
				return parseInt(sort.sortOrder) || 1000
			});
			
			return new BackboneCollectionView({
				collection: options_to_render
				,	childView: ProductViewsOptionView
				,	viewsPerRow: 1
				,	childViewOptions: {
					line: this.model
					,	item: this.model.get('item')
					,	templateName: 'selector'
					,	show_required_label: this.options.show_required_label
				}
			});
		}
		
	,   childViews: _.extend({}, ProductDetailsFullView.prototype.childViews, {
			'ProductConfigurator.Options.General': function () {
				return this.selectorView(ProductConfiguratorFieldConfig.getGeneralOptions(this.model.getVisibleOptions()));
			}
		,   'ProductConfigurator.Options.Sizing': function ()
			{
				return this.selectorView(ProductConfiguratorFieldConfig.getSizingOptions(this.model.getVisibleOptions()));
			}
		,   'ProductConfigurator.Options.FrontPatch': function () {
				return this.selectorView(ProductConfiguratorFieldConfig.getFrontPatchOptions(this.model.getVisibleOptions()));
			}
		,   'ProductConfigurator.Options.RearPatch': function () {
				return this.selectorView(ProductConfiguratorFieldConfig.getBackPatchOptions(this.model.getVisibleOptions()));
			}
		,   'ProductConfigurator.Options.NameStrip': function () {
				return this.selectorView(ProductConfiguratorFieldConfig.getNameStripOptions(this.model.getVisibleOptions()));
			}
		,   'AdditionalProducts': function () {
				return this.additionalProductsView;
			}
		,   'Configurator.Subtotal': function () {
				return this.subtotalView;
			}
			
		,   'MainActionView': function ()
			{
				return this.mainActionViewInstance && this.mainActionViewInstance;
			}
			
		,   'ProductConfigurator.Options': function () {
				var options_to_render = ProductConfiguratorFieldConfig.excludeCustomOptions(this.model.getVisibleOptions());
				// get the singles
				options_to_render = _.filter(options_to_render, function (option) {
					return option.get('values') && option.get('values').length > 2
				});
				return this.selectorView(options_to_render);
			}
			
		,   'ProductConfigurator.Options.Singles': function () {
				var options_to_render = ProductConfiguratorFieldConfig.excludeCustomOptions(this.model.getVisibleOptions());
				// get the singles
				options_to_render = _.filter(options_to_render, function (option) {
					return option.get('values') && option.get('values').length <= 2
				});
				return this.selectorView(options_to_render);
			}
		})
		
	,   additionalProductsLoaded: function () {
			this.additionalProductsView.setElement(this.$('[data-view="AdditionalProducts"]')).delegateEvents().render();
			
		}
		
	,   getContext: _.wrap(ProductDetailsFullView.prototype.getContext, function (fn) {
			var returnVar = fn.apply(this, _.toArray(arguments).slice(1));
			
			if(this.additionalProductsConfig) {
				_.extend(returnVar, {
					sectionTitle: this.additionalProductsConfig.sectionTitle
					, tooltip: this.additionalProductsConfig.tooltip
				});
			}
			
			return returnVar;
			
		})
	});

});
