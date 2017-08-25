/*
	© 2017 LN Curtis
*/

define(
	'RecentlyViewedItems.Extension'
,	[
		'RecentlyViewedItems.Collection.Extension'
	,	'RecentlyViewedItems.View.Extension'
	]
,	function(
        RecentlyViewedItemsCollectionExtension
	,	RecentlyViewedItemsViewExtension
	)
{
	'use strict';
	
	return {
        RecentlyViewedItemsCollectionExtension: RecentlyViewedItemsCollectionExtension
	,	RecentlyViewedItemsViewExtension:RecentlyViewedItemsViewExtension
	}

});
