define('Item.KeyMapping.Videos'
, [
    'underscore',
    'Utils',
    'SC.Configuration'
], function (
    _,
    Utils,
    Configuration
) {
    'use strict';
    
	Configuration.itemKeyMapping = Configuration.itemKeyMapping || {};
	
	_.extend(Configuration.itemKeyMapping, {
		
		_videos: function (item) {
			
			var videos = item.get('custitem_storevideos')
				,   videoString = videos && videos.length > 0 ? videos.split(/\r?\n/g) : []
				,   videoObjArr = []
				,   MAXWIDTH = 430
				,   vidWidth = Utils.getViewportWidth() >= MAXWIDTH ? MAXWIDTH : Utils.getViewportWidth() - 40;
			
			if (item.application && item.application.getLayout().$containerModal) vidWidth = 335;
			
			_.each(videoString, function (vid) {
				var $elem = $(vid)
					,   h = parseInt($elem.attr('height'))
					,   w = parseInt($elem.attr('width'))
					,   r = h/w;
				
				if(w > MAXWIDTH){
					$elem.attr('width', vidWidth);
					$elem.attr('height', Math.floor(vidWidth*r))
				}
				
				console.log($elem.prop('outerHTML'));
				videoObjArr.push($elem.prop('outerHTML'))
			});
			
			console.log(videoObjArr);
			return videoObjArr;
		}
	});
});