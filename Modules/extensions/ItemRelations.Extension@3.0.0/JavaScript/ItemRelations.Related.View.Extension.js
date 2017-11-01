/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ItemRelations
define('ItemRelations.Related.View.Extension'
,	[	'ItemRelations.Related.View'
	,	'Backbone.CollectionView'
	,	'ItemRelations.RelatedItem.View'
	,	'ItemRelations.Related.Collection'
	,	'SC.Configuration'
	,	'Tracker'

	,	'item_relations_related.tpl'
	,	'item_relations_row.tpl'
	,	'item_relations_cell.tpl'

	,	'jQuery'
	,	'Backbone'
	,	'underscore'
	,	'Utils'
	]
,	function (
		ItemRelationsRelatedView
	,	BackboneCollectionView
	,	ItemRelationsRelatedItemView
	,	ItemRelationsRelatedCollection
	,	Configuration
	,	Tracker

	,	item_relations_related_tpl
	,	item_relations_row_tpl
	,	item_relations_cell_tpl

	,	jQuery
	,	Backbone
	,	_
	)
{
	'use strict';
	_.extend(ItemRelationsRelatedView.prototype, {
		
		initialize: function (options) {
			
			this.options = options;
			
			var is_sca_advance = this.options.application.getConfig('siteSettings.sitetype') === 'ADVANCED'
				, collection = is_sca_advance ? new ItemRelationsRelatedCollection({itemsIds: this.options.itemsIds}) : new Backbone.Collection()
				, layout = this.options.application.getLayout()
				, self = this;
			
			BackboneCollectionView.prototype.initialize.call(this, {
				collection: collection
				, viewsPerRow: Infinity
				, cellTemplate: item_relations_cell_tpl
				, rowTemplate: item_relations_row_tpl
				, childView: ItemRelationsRelatedItemView
				, template: item_relations_related_tpl
				, childViewOptions: {
					showAddToCart: true
					, application: this.options.application
				}
			});
			
			if (is_sca_advance) {
				layout.once('afterAppendView', self.loadRelatedItem, self);
				layout.currentView && layout.currentView.once('afterCompositeViewRender', self.loadRelatedItem, self);
			}
		}
	});
});
