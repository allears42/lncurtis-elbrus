/*
 © 2017 JHM Services
 Adds additional search restriction to quick add typeahead. Adds facet - call for pricing - and only displays items
 that have a value of true.
 */

define('QuickAdd.Extension'
,   [
        'QuickAdd.View'
    ,	'ItemsSearcher.View'
    ,	'QuickAdd.Item.View'
    ,   'Backbone.FormView'
    ,   'Backbone.CompositeView'
    ,	'QuickAdd.Model'
    ,	'quick_add_item.tpl'
    ,   'SC.Configuration'
    ,	'Transaction.Line.Views.Options.Selected.View'
    ,	'ProductViews.Price.View'
    ,	'ProductLine.Stock.View'
    ,	'QuickAdd.ItemsSearcher.Plugins'
    ,	'Transaction.Line.Model'
    ,	'ProductLine.Sku.View'
    ,   'underscore'
    ]
,   function
    (
        QuickAddView
    ,	ItemsSearcherView
    ,	QuickAddItemView
    ,   BackboneFormView
    ,   BackboneCompositeView
    ,	QuickAddModel
    ,	quick_add_item_tpl
    ,   Configuration
    ,	TransactionLineViewsOptionsSelectedView
    ,	ProductViewsPriceView
    ,	ProductLineStockView
    ,	QuickAddItemsSearcherPlugins
    ,	TransactionLineModel
    ,	ProductLineSkuView
    ,   _
    )
{
    'use strict';

    _.extend(QuickAddView.prototype, {

        initialize: function ()
        {
            this.itemsSearcherComponent = new ItemsSearcherView({
                placeholderLabel: _('Enter SKU or Item Name').translate()
                ,	showBackorderables: this.options.showBackorderable
                ,   minLength: Configuration.get('typeahead.minLength', 3)
                ,	maxLength: Configuration.get('searchPrefs.maxLength', 0)
                ,	limit: Configuration.get('typeahead.maxResults', 10)
                ,	sort: Configuration.get('typeahead.sort','relevance:asc')
                ,	highlight: Configuration.get('typeahead.highlight', true)
                ,	componentId: 'quickaddSearch'
                ,	componentName: 'quickaddSearch'
                ,	showMenuOnClick: true
                ,	showSeeAll: false
                // ,   additionalSearchParamsObj: {custitem_sc_call_for_pricing: false}
                ,	collectionOptions:
                {
                    searcherAPIConfiguration: 'searchApiMasterOptions.itemsSearcher'
                }
                ,	itemView: QuickAddItemView
                ,	itemViewOptions:
                {
                    template: quick_add_item_tpl
                ,	childViews: {
                        'Item.Options': function (options)
                        {
                            return function ()
                            {
                                return new TransactionLineViewsOptionsSelectedView({
                                    model: options.model
                                });
                            };
                        }
                        ,	'Item.Price': function (options)
                        {
                            return function ()
                            {
                                return new ProductViewsPriceView({
                                    model: options.model
                                });
                            };
                        }
                        ,	'Item.Stock': function (options)
                        {
                            return function ()
                            {
                                return new ProductLineStockView({
                                    model: options.model
                                });
                            };
                        }
                        ,	'Item.Sku': function (options)
                        {
                            return function ()
                            {
                                return new ProductLineSkuView({
                                    model: options.model
                                });
                            };
                        }
                    }
                }
            ,	getItemDisplayName: function (item, query)
                {
                    return item ? item.getSku() : query;
                }
            });
            this.itemsSearcherComponent.postItemsSuggestionObtained.install(QuickAddItemsSearcherPlugins.flatItemsMatrixResult);

            this.model = new QuickAddModel();
            this.model.setItemQuantityGetter(this.options.getItemQuantitySet);

            this.itemsSearcherComponent.on('itemSelected', this.onItemSelected, this);
            this.itemsSearcherComponent.on('keyUp', this.showReset, this);
            this.itemsSearcherComponent.on('keyDown', this.cleanSearchOnEnter, this);

            var original_save_form = this.saveForm;
            BackboneCompositeView.add(this);
            BackboneFormView.add(this);
            this.saveForm = original_save_form;
        }
    });
});