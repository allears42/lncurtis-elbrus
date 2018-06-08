/*
	© 2017 LN Curtis
*/

define(
    'ItemRelations.Extension'
    ,	[
        'ItemRelations.Correlated.View.Extension'
    ,   'ItemRelations.RelatedItem.View.Extension'
    ,   'ItemRelations.Related.View.Extension'
    ,   'ItemRelations.Related.Collection.Extension'
    ]
    ,	function(
        ItemRelationsCorrelatedViewExtension
    ,   ItemRelationsRelatedItemViewExtension
    ,   ItemRelationsRelatedViewExtension
    ,   ItemRelationsRelatedCollectionExtension
    )
    {
        'use strict';

        return {
            ItemRelationsCorrelatedViewExtension: ItemRelationsCorrelatedViewExtension
        ,   ItemRelationsRelatedItemViewExtension: ItemRelationsRelatedItemViewExtension
        ,   ItemRelationsRelatedViewExtension: ItemRelationsRelatedViewExtension
        ,   ItemRelationsRelatedCollectionExtension: ItemRelationsRelatedCollectionExtension
        }

    });
