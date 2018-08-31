/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ProductDetails
define(
	'ProductDetails.ImageGallery.Video.View'
,	[
		'ProductDetails.ImageGallery.View'
	,	'product_details_image_gallery_video.tpl'
    ,	'Utilities.ResizeImage'
	
    ,	'Item.KeyMapping.Videos'
    ,	'Item.Model.Extension'
    ,	'Product.Model.Video.Extension'

	,	'SC.Configuration'
	,	'underscore'
	]
,	function (
        ProductDetailsImageGalleryView
	,	product_details_image_gallery_video_tpl
	,	resizeImage
    
    ,   ItemKeyMappingVideos
    ,   ItemModelExtension
    ,   ProductModelVideoExtension

	,	Configuration
	,	_
	)
{
	'use strict';

    // @class ProductDetails.ImageGallery.View.Extension @extends ProductDetails.ImageGallery.View
	_.extend(ProductDetailsImageGalleryView.prototype, {
	    template: product_details_image_gallery_video_tpl
        
    ,   initialize: _.wrap(ProductDetailsImageGalleryView.prototype.initialize, function(fn, options) {
			
            fn.apply(this, _.toArray(arguments).slice(1));
			
			this.fallBack = Configuration.get('videoThumbFallback', '/images/video.png');
            
        })
        
        ,   initZoom: function () {
            // do nothing
        }
        
        // @method buildSliderPager @param {Number}slide_index
        ,	buildSliderPager: function (slide_index)
        {
            var image = this.images && this.images[slide_index];
            
            if(image && image.isVideo) {
                return "<img src='"+Configuration.get('videoThumbFallback', '/images/video.png')+"' alt='play video' class='bx-video-fallback' />"
            }
            else {
	            return '<img src="' + resizeImage(image.url, 'tinythumb') + '" alt="' + image.altimagetext + '">';
            }
        }
    });
	
	return {
        ItemKeyMappingVideos: ItemKeyMappingVideos
    ,   ItemModelExtension: ItemModelExtension
	// ,   ProductModelVideoExtension: ProductModelVideoExtension
    }

});
