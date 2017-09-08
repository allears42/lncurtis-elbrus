/*
	© 2017 LN Curtis
*/

define(
    'ItemRelations.Extension'
    ,	[
        'ItemRelations.Correlated.View.Extension'
    ,   'ItemRelations.RelatedItem.View.Extension'
    ]
    ,	function(
        ItemRelationsCorrelatedViewExtension
    ,   ItemRelationsRelatedItemViewExtension
    )
    {
        'use strict';

        return {
            ItemRelationsCorrelatedViewExtension: ItemRelationsCorrelatedViewExtension
        ,   ItemRelationsRelatedItemViewExtension: ItemRelationsRelatedItemViewExtension
        }

    });
