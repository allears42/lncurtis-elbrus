/*
	© 2017 LN Curtis
*/

// @module Product Configurator
define('Product.Configurator.Model'
,	[	'Backbone.CachedModel'
	,	'Item.Collection'
	,	'Session'

	,	'underscore'
	,	'Utils'
	]
,	function (
		BackboneCachedModel
	,	ItemCollection
	,	Session

	,	_
	)
{
	'use strict';

	var original_fetch = BackboneCachedModel.prototype.fetch;

	// @class Facets.Model @extends Backbone.CachedModel
	// Connects to the search api to get all the items and the facets
	// A Model Contains a Collection of items and the list of facet groups with its values
	return ItemCollection.extend({

		url: function()
		{
			var url = _.addParamsToUrl(
				'/api/items'
			,	_.extend(
					{}
				,	Session.getSearchApiParams()
				, {
						fieldset: 'configurator'
					}
				)
			);

			return url;
		}

	,	initialize: function (options)
		{
			this.itemsIds = _.isArray(options.itemsIds) ? _.sortBy(options.itemsIds, function (id) {return id;}) : [options.itemsIds];
			
			// Listen to the change event of the items and converts it to an ProductCollection
			this.on('change:items', function (model, items)
			{
				if (!(items instanceof ItemCollection))
				{
					// NOTE: Compact is used to filter null values from response
					model.set('items', new ItemCollection(_.compact(items)));
				}
			});
		}
		

		// @method fetch overrides fetch so we make sure that the cache is set to true, so we wrap it
	,	fetch: function (options)
		{
			options = options || {};

			options.cache = true;

			return original_fetch.apply(this, arguments);
		}
		
		//@method fetchItems @return {jQuery.Deferred}
		,	fetchItems: function ()
		{
			return this.fetch({data:{id: this.itemsIds.join(',')}});
		}
		
		,	parse: function (response)
		{
			var original_items = _.compact(response.items) || []
			,	items = {};
			
			if(response.items ){
				_.each(original_items, function (related_item)
				{
					items[related_item.internalid] = related_item;
				});
				
				return _.toArray(items);
			}
			
			return response;
			
		}
	}

,	{
		mountToApp: function (application)
		{
		}
	});
});
