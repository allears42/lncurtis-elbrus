/*
	© 2017 LN Curtis
*/

define(
    'RecentlyViewedItems.Collection.Fix'
    ,	[
        'RecentlyViewedItems.Collection'

    ,	'underscore'
    ,   'jQuery'
    ]
    ,	function(
        RecentlyViewedItemsCollection

    ,	_
    ,   jQuery
    )
    {
        'use strict';

        _.extend( RecentlyViewedItemsCollection.prototype, {

            loadItemsFromCookie: function ()
            {
                // create an array of ID items to get only the elements that are present in the cookie but are not present in memory
                var cookie_ids = jQuery.cookie('recentlyViewedIds') || [];

                if(typeof cookie_ids === 'string')
                {
                    cookie_ids = [cookie_ids.replace(/[\[\]]+/g,'')];
                }
                else if(!_.isArray(cookie_ids))
                {
                    cookie_ids = [cookie_ids];
                }

                var	items_ids = _.difference(cookie_ids, this.pluck('internalid')).join(',');

                // can't be longer than 36
                items_ids = items_ids.length > 36 ? items_ids.slice(0, 36) : items_ids;
	            // can't have a leading comma
	            if(items_ids.indexOf(",") === 0) items_ids = items_ids.replace(",", "");
	
				if (items_ids)
                {
                    return this.fetch({data:{id: items_ids}}, {silent: true});
                }
                else
                {
                    return jQuery.Deferred().resolveWith(this);
                }
            }

        });

    });
