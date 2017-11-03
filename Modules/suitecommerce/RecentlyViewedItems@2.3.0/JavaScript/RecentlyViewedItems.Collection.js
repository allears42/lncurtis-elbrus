/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module RecentlyViewedItems
define('RecentlyViewedItems.Collection'
,	[	'Singleton'
	,	'SC.Configuration'
	,	'Item.Collection'

	,	'jQuery'
	,	'underscore'
	,	'Utils'
	]
,	function (
		Singleton
	,	Configuration
	,	ItemCollection

	,	jQuery
	,	_
	)
{
	'use strict';
	// @class RecentlyViewedItems.Collection @extends Item.Collection
	return ItemCollection.extend({
			//@method initialize
			initialize: function ()
			{
				this.useCookie = Configuration.recentlyViewedItems && Configuration.recentlyViewedItems.useCookie;
				this.searchApiMasterOptions = Configuration.searchApiMasterOptions.Facets;

				// don't need to use this because we aren't fetching the items unless were calling an explicit fetch
				/*if (this.useCookie)
				{
					this.promise = this.loadItemsFromCookie();
				}
				else
				{
					this.promise = jQuery.Deferred().resolveWith(this);
				}*/
			}
			
			//@method addHistoryItem
		// why call the api each time when we can just load it from the cookie??
		,	addHistoryItem: function (item)
			{
				if (this.useCookie)
				{
					var self = this
					,   currentCookie = this.loadCookie()
					,   thisItem = item.get('internalid');

					
					console.log(currentCookie, thisItem);
					
					if (currentCookie.indexOf(thisItem) < 0) {
						var news_items = currentCookie + (currentCookie.length > 0 ? "," : "")+ thisItem;
						jQuery.cookie('recentlyViewedIds', news_items, {path: '/'});
					}
					
					/*this.promise.done(function ()
					{

						// If the item is already in the recently viewed, we remove it
						self.remove(item);

						// we add the item at the beginning of a collection
						self.unshift(item);

						if (self.useCookie)
						{
							var current_items = jQuery.cookie('recentlyViewedIds')
							,	news_items = _.union(self.pluck('internalid'), current_items);

							jQuery.cookie('recentlyViewedIds', news_items, {path: '/'});
						}
					});*/
				}

			}
			
		,   loadCookie: function () {
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
				
				return items_ids;
		}
			
			//@method loadItemsFromCookie
		,	loadItemsFromCookie: function ()
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


				if (items_ids)
				{
					return this.fetch({data:{id: items_ids}}, {silent: true});
				}
				else
				{
					return jQuery.Deferred().resolveWith(this);
				}
			}


	}, Singleton);

});