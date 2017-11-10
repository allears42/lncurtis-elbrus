/*
	© 2017 LN Curtis
*/

define(
    'ItemRelations.Correlated.View.Extension'
    ,	[
        'ItemRelations.Correlated.View'
	,	'ItemRelations.Correlated.Collection'
	,	'ItemRelations.RelatedItem.View'
	,	'Backbone.CollectionView'
	,	'SC.Configuration'

	,	'item_relations_correlated.tpl'
	,	'item_relations_row.tpl'
	,	'item_relations_cell.tpl'

	,	'underscore'

    ]
    ,	function(
        ItemRelationsCorrelatedView
	,	ItemRelationsCorrelatedCollection
	,	ItemRelationsRelatedItemView
	,	BackboneCollectionView
	,	Configuration

	,	item_relations_correlated_tpl
	,	item_relations_row_tpl
	,	item_relations_cell_tpl

	, 	_

    )
    {
        'use strict';

        _.extend( ItemRelationsCorrelatedView.prototype, {

            initialize: function ()
            {
                var is_sca_advanced = Configuration.get('siteSettings.sitetype') === 'ADVANCED'
                    ,	collection = is_sca_advanced ? new ItemRelationsCorrelatedCollection({itemsIds: this.options.itemsIds}) : new Backbone.Collection()
                    ,	layout = this.options.application.getLayout()
                    ,	self = this;

                // custom code to filter out "undefined" models
                collection.models = _.filter(collection.models, function (model) {
                    return model && model.get('_id') && model.get('_id') > 0;
                });
                collection.length = collection.models.length;

                BackboneCollectionView.prototype.initialize.call(this, {
                    collection: collection
                    ,	viewsPerRow: Infinity
                    ,	cellTemplate: item_relations_cell_tpl
                    ,	rowTemplate: item_relations_row_tpl
                    ,	childView: ItemRelationsRelatedItemView
                    ,	template: item_relations_correlated_tpl
                });

                if (is_sca_advanced)
                {
                    layout.once('afterAppendView', self.loadRelatedItems, self);
                    layout.currentView && layout.currentView.once('afterCompositeViewRender', self.loadRelatedItems, self);
                }
            }

        });

    });
