/*
	© 2017 POS Supply
*/

// @module Item
define('Item.Model.Extension'
,	[
		'Item.Model'
	,	'SC.Configuration'
	,	'underscore'
	]
,	function (
        ItemModel
	,	Configuration
	,	_
	)
{
	'use strict';

	_.extend(ItemModel.prototype, {
	    
	    getVideos: function () {
	        
	        return this.get('_videos') || [];
        }
        
        , getImages: _.wrap(ItemModel.prototype.getImages, function (fn) {
            var images = fn.apply(this, _.toArray(arguments).slice(1))
            ,   videos = this.getVideos();
            
            //console.log(videos);
            if(images.length === 1 && images[0].url === Configuration.get('imageNotAvailable')) {
                return images;
            }
            else {
                // add videos onto the end of the images object
                return images.concat(videos)
            }
        })
    });
});
