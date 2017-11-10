/*
	© 2017 LN Curtis
*/

define(
    'ItemRelations.Extension'
    ,	[
        'ItemRelations.Correlated.View.Extension'
    ,   'ItemRelations.RelatedItem.View.Extension'
    ,   'ItemRelations.Related.View.Extension'
    ]
    ,	function(
        ItemRelationsCorrelatedViewExtension
    ,   ItemRelationsRelatedItemViewExtension
    ,   ItemRelationsRelatedViewExtension
    )
    {
        'use strict';

        return {
            ItemRelationsCorrelatedViewExtension: ItemRelationsCorrelatedViewExtension
        ,   ItemRelationsRelatedItemViewExtension: ItemRelationsRelatedItemViewExtension
        ,   ItemRelationsRelatedViewExtension: ItemRelationsRelatedViewExtension
        }

    });
