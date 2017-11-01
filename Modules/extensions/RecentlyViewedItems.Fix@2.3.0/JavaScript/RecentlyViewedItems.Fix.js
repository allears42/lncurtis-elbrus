/*
	© 2017 LN Curtis
	
	Fixes for how recently viewed items get loaded
	and loading on page refresh / resize
*/

define(
	'RecentlyViewedItems.Fix'
,	[
		'RecentlyViewedItems.Collection.Fix'
	]
,	function(
        RecentlyViewedItemsCollectionFix
	)
{
	'use strict';
	
	return {
        RecentlyViewedItemsCollectionFix: RecentlyViewedItemsCollectionFix
	}

});
