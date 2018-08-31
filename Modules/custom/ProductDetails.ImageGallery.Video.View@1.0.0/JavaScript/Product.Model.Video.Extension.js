/*
	© 2017 POS Supply
*/

// @module Item
define('Product.Model.Video.Extension'
,	[
		'Product.Model'
	,	'SC.Configuration'
	,	'Utils'
	,	'underscore'
	]
,	function (
        ProductModel
	,	Configuration
	,	Utils
	,	_
	)
{
	'use strict';

	_.extend(ProductModel.prototype, {

        /**
		 * Had to override original getImages method, and this extension broke. Added this functionality to other
		 * extension. See Product.Extension > Product.ModuleExtension
         */
        // getVideos: function () {
	     //    return this.get('item').get('_videos') || [];
        // }
        //
        // , getImages: _.wrap(ProductModel.prototype.getImages, function (fn) {
        //
        //     var images = fn.apply(this, _.toArray(arguments).slice(1))
        //     ,   videos = this.getVideos();
        //
        //     //console.log('getImages', videos, images.concat(videos));
        //     if(images.length === 1 && images[0].url === Configuration.get('imageNotAvailable')) {
        //         return images.concat(videos);
        //     }
        //     else {
        //         // add videos onto the end of the images object
        //         return images.concat(videos)
        //     }
        // })
    });
});
