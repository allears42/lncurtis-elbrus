/*
	© 2017 LN Curtis
*/

define(
    'ProductDetails.Options.Selector.View.Extension'
    ,	[
        'ProductDetails.Options.Selector.View'
    ,   'ProductViews.Option.View'
    ,   'Backbone.CollectionView'
    ,	'underscore'
    ]
    ,	function(
        ProductDetailsOptionsSelectorView
    ,   BackboneCollectionView
    ,   ProductViewsOptionView
    ,	_
    )
    {
        'use strict';

        _.extend( ProductDetailsOptionsSelectorView.prototype, {

            childViews: _.extend( ProductDetailsOptionsSelectorView.prototype.childViews,
            {

                'Options.Collection': function ()
                {

                    var options_to_render = this.model.getPosibleOptions()
                    ,   customSortOrder = Configuration.get("itemOptionsSort");

                    options_to_render = _.chain(options_to_render)
                        .filter(options_to_render, function (option) {
                                return option.values && option.values.length > 2 })
                        .sortBy(options_to_render, function (option) {
                                var sort = _.find( customSortOrder, {itemOptionId: option.itemOptionId}) || '1000';
                                return parseInt(sort.sortOrder) || 1000 })
                        .value();

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
            })

        });
    });
