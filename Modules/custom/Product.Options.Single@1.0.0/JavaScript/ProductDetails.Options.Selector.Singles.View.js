/*
	© 2017 LN Curtis
	Single options display differently
*/

// @module ProductDetails
define('ProductDetails.Options.Selector.Singles.View'
	,	[
			'ProductDetails.Options.Selector.View'
		,   'ProductViews.Option.View'
		
		,	'Backbone.CollectionView'
		
		,	'product_details_options_single_selector.tpl'
		
		,	'SC.Configuration'
		,	'underscore'
	]
	,	function (
			ProductDetailsOptionsSelectorView
		,   ProductViewsOptionView
		
		,   BackboneCollectionView
		
		,   product_details_options_single_selector_tpl
		
		,   Configuration
		,   _
	)
	{
		'use strict';
		
		return ProductDetailsOptionsSelectorView.extend({
			
			template: product_details_options_single_selector_tpl
			
		,   childViews: {
				'Options.Collection.Single': function ()
				{
					var options_to_render = this.model.getVisibleOptions()
						,   customSortOrder = Configuration.get("itemOptionsSort");
					
					options_to_render = _.filter(options_to_render, function (option) {
						return option.get('values') && option.get('values').length <= 2
					});
					options_to_render = _.sortBy(options_to_render, function (option) {
						var sort = _.find(customSortOrder, {itemOptionId: option.itemOptionId}) || '1000';
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
			}
		});
	});