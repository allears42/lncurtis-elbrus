// @module ItemRelations
define('ItemRelations.Related.Collection.Extension'
,	[	'ItemRelations.Related.Collection'

	,	'jQuery'
	,	'underscore'
	,	'Utils'
	]
,	function (
		ItemRelationsRelatedCollection

	,	jQuery
	,	_
	)
{
	'use strict';
	_.extend(ItemRelationsRelatedCollection.prototype, {
		
		parse: function (response) {
            var original_items = _.compact(response.items) || []
                ,	self = this
                ,	items = {};

            _.each(_.pluck(original_items, 'relateditems_detail'), function (related_items)
            {
                _.each(related_items, function (related_item)
                {
                    if (related_item && !_.contains(self.itemsIds, related_item.internalid) && !items[related_item.internalid])
                    {
                        items[related_item.internalid] = related_item;
                    }
                });
            });

            return _.toArray(items);
		}
	});
});
