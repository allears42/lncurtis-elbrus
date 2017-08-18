/*
	© 2017 LN Curtis
*/

define(
    'ItemRelations.Extension'
    ,	[
        'ItemRelations.Correlated.View.Extension'
    ]
    ,	function(
        ItemRelationsCorrelatedViewExtension
    )
    {
        'use strict';

        return {
            ItemRelationsCorrelatedViewExtension: ItemRelationsCorrelatedViewExtension
        }

    });
