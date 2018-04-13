/*
	© 2017 JHM Services
	Native code for getting images ignores loading by swatch - goes straight to media
*/

// @module Product
define('Product.Model.Extension'
,	[	'Product.Model'
	,	'ProductLine.Common.Image'
	,	'ProductLine.Common'
	,	'PluginContainer'
	,	'SC.Configuration'

	,	'underscore'
	,	'Backbone'
	,	'Utils'
	,	'jQuery'
	]
,	function (
		ProductModel
	,	ProductLineCommonImage
	,	ProductLineCommon
	,	PluginContainer
	,	Configuration

	,	_
	,	Backbone
	,	Utils
	,	jQuery
	)
{
	'use strict';

	_.extend(ProductModel.prototype, {
		getImages: function getImages ()
		{
			//console.log('product model');
			var self = this
			,   item = this.get('item')
			,	item_images_detail = item.get('itemimages_detail') || {};
			
			//item_images_detail = item_images_detail.media || item_images_detail;
			
			var image_filters = Configuration.get('productline.multiImageOption', [])
			,	images_container = this.filterImages(item_images_detail, image_filters)
			,	result = Utils.imageFlatten(images_container)
			,   filterFound = false;
			
			// look to see if the filter (option) is found and if it has a value set.
			_.each(image_filters, function (image_filter) {
				var selected_option_filter = self.get('options').findWhere({cartOptionId: image_filter});

				if(selected_option_filter &&
						selected_option_filter.get('value') &&
						selected_option_filter.get('value').label &&
						item_images_detail.hasOwnProperty(selected_option_filter.get('value').label.replace(/\s\/\s/g, '-').replace(/\s&\s/g, '-').replace(/ /g, '-'))) {
					filterFound = true;
				}
			});
			
			if(!filterFound && item_images_detail.media) {
				images_container = this.filterImages(item_images_detail.media, image_filters);
				result = Utils.imageFlatten(images_container) ;
			}
			
			//console.log('getImages', image_filters, images_container, filterFound, result);

			return result.length ? result : [{
				url: Utils.getAbsoluteUrlOfNonManagedResources(Configuration.get('imageNotAvailable', 'img/no_image_available.jpeg'))
				,	altimagetext: item.get('_name')
			}];
		}
	});
	
	_.extend(ProductLineCommonImage, {
		// doesn't account for spaces in keys - they are turned into DASHSES
		filterImages: function filterImages (item_images_detail, image_option_filters)
		{
			var self = this
				,	images_container = item_images_detail
				,	selected_option_filter;
			
			_.each(image_option_filters, function (image_filter)
			{
				selected_option_filter = self.get('options').findWhere({cartOptionId: image_filter});
				
				//if the option/dimension has a value set
				if (selected_option_filter && selected_option_filter.get('value') && selected_option_filter.get('value').label)
				{
					var label = selected_option_filter.get('value').label.toLowerCase().replace(/\s\/\s/g, '-').replace(/\s&\s/g, '-').replace(/ /g, '-');
					
					_.each(images_container, function(value, key)
					{
						if (key.toLowerCase() === label)
						{
							images_container = value;
						}
					});
				}
			});
			
			return images_container;
		}
	});
	
	
	// add to product model
	ProductModel.prototype = _.extend(ProductModel.prototype, ProductLineCommonImage);

});
