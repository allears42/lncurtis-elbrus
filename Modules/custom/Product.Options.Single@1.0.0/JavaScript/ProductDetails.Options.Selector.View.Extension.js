/*
	© 2017 LN Curtis
	Filter out items with only one value to select
*/

// @module ProductDetails
define(
	'ProductDetails.Options.Selector.View.Extension'
	,	[
			'ProductDetails.Options.Selector.View'
		,   'ProductViews.Option.View'
		
		,   'Backbone.CollectionView'
		
		,	'SC.Configuration'
		,	'underscore'
	]
	,	function(
			ProductDetailsOptionsSelectorView
		,   ProductViewsOptionView
		
		,   BackboneCollectionView
		
		,	Configuration
		,	_
	)
	{
		'use strict';
		
		
		_.extend( ProductDetailsOptionsSelectorView.prototype, {
			initialize: _.wrap(ProductDetailsOptionsSelectorView.prototype.initialize, function (fn, options) {
				fn.apply(this, _.toArray(arguments).slice(1));
			})
			,   childViews: _.extend(ProductDetailsOptionsSelectorView.prototype.childViews,
			{
				'Options.Collection': function () {
					var options_to_render = this.model.getVisibleOptions()
						, customSortOrder = Configuration.get("itemOptionsSort");
					
					options_to_render = _.filter(options_to_render, function (option) {
						return option.get('values') && option.get('values').length > 2
					});
					options_to_render = _.sortBy(options_to_render, function (option) {
						var sort = _.find(customSortOrder, {itemOptionId: option.itemOptionId}) || '1000';
						return parseInt(sort.sortOrder) || 1000
					});
					
					return new BackboneCollectionView({
						collection: options_to_render
						, childView: ProductViewsOptionView
						, viewsPerRow: 1
						, childViewOptions: {
							line: this.model
							, item: this.model.get('item')
							, templateName: 'selector'
							, show_required_label: this.options.show_required_label
						}
					});
				}
			})
			
		});
	});