define('Home.BestSellers.View'
,   [
        'Backbone'
    ,   'Backbone.CollectionView'
    ,   'Facets.ItemCell.View'
    ,   'Item.Collection'
    ,   'facets_facet_browse.tpl'
    ,   'facets_items_collection.tpl'
    ,   'facets_items_collection_view_cell.tpl'
    ,   'facets_items_collection_view_row.tpl'
    ,   'best_sellers_item.tpl'
    ,   'best_sellers.tpl'
    ,   'facets_item_cell_grid.tpl'
    ,   'jQuery'
    ]
,   function
    (
        Backbone
    ,   BackboneCollectionView
    ,   FacetsItemCellView
    ,   ItemCollection
    ,   facets_facet_browse_tpl
    ,   facets_items_collection_tpl
    ,   facets_items_collection_view_cell_tpl
    ,   facets_items_collection_view_row_tpl
    ,   best_sellers_item_tpl
    ,   best_sellers_tpl
    ,   facets_item_cell_grid_tpl
    ,   jQuery
    )
{
    'use strict';

    return Backbone.View.extend({

        template: best_sellers_tpl

    ,   initialize: function(options)
        {
            var self = this;

            this.homeBestSellersItemsModel = options.homeBestSellersItemsModel;
            this.homeBestSellersItemsPromise = options.homeBestSellersItemsPromise;

            jQuery.when(this.homeBestSellersItemsPromise).then(function() {
                self.render();
            });
        }

    ,   childViews:
        {
            'BestSellersItemsView': function() {

                var self = this
                    ,   collection = new ItemCollection(self.homeBestSellersItemsModel.get('items'));

                collection.comparator = function(model) {return model.get('bestsellerSort')};
                collection.sort();

                return new BackboneCollectionView({
                    childView: FacetsItemCellView
                ,   childTemplate: best_sellers_item_tpl
                // ,   collection: new ItemCollection(self.homeBestSellersItemsModel.get('items'))
                    ,   collection: collection
                ,   viewsPerRow: 4
                ,   cellTemplate: facets_items_collection_view_cell_tpl
                ,   rowTemplate: facets_items_collection_view_row_tpl
                ,   template: facets_items_collection_tpl
                // ,   comparator: function(model) {return model.get('bestsellerSort')}
                });
            }
        }
    });
});