/*
	© 2017 LN Curtis
*/

define(
    'ItemsSearcher.Extension'
    ,	[
        'ItemsSearcher.Item.View.Extension'
    ,   'ItemsSearcher.View.Extension'
    ]
    ,	function(
        ItemsSearcherItemViewExtension
    ,   ItemsSearcherViewExtension
    )
    {
        'use strict';

        return {
            ItemsSearcherItemViewExtension: ItemsSearcherItemViewExtension
        ,   ItemsSearcherViewExtension: ItemsSearcherViewExtension
        }

    });
