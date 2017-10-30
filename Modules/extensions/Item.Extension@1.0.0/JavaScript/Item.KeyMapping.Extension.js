define('Item.KeyMapping.Extension'
, [
    'underscore',
    'Utils',
    'SC.Configuration',
    'Categories'
]
, function (
    _,
    Utils,
    Configuration,
    Categories
) {
    'use strict';
    
    Configuration.itemKeyMapping = Configuration.itemKeyMapping || {};
    
    _.extend(Configuration.itemKeyMapping, {
	    _defaultCategory: 'defaultcategory_detail'
	   
	    // use default category to build bread crumbs
    ,   _breadcrumb: function (item)
	    {
		    var breadcrumb = [];
		
		    // From defaultcategory_detail
		    var tokens = item.get('_defaultCategory')
		    ,   defaultcategoryPath = _.compact(_.pluck(tokens, 'url')).join('/')
		    ,   breadcrumbString = "";
		
		    if (tokens && tokens.length >= 3) {
		    	tokens.splice(3,tokens.length-1)
		    }
		    
		    _.each(tokens, function (token, index)
		    {
		    	var href = breadcrumbString + "/" + (token.url.length > 0 ? token.url : token.label);
			    if(token.label.toLowerCase() !== "home") {
				    breadcrumb.push({
					    href: href.toLowerCase(),
					    text: token.label
				    });
				
				    breadcrumbString += "/" + (token.url.length > 0 ? token.url : token.label);
			    }
		    });
		
		    breadcrumb.push({
			    href: item.get('_url'),
			    text: item.get('_name')
		    });
		    
		    return breadcrumb;
	    }
	    
    ,   quantityAvailable: function (item)
	    {
	    	var matrixParent = item.get('_matrixParent');
		    // If this item is a child of a matrix return the quantity of the parent
		    if (matrixParent && matrixParent.get('internalid'))
		    {
			    return item.get('_matrixParent').get('quantityavailable');
		    }
		    // Other ways it will use the URL component or a default /product/ID
		    return item.get('quantityavailable');
		    
	    }

	,   _comparePriceAgainst: function (item)
		{
			var prices = item.get('_priceDetails');

			// debugger;

			if (prices)
			{
				//The priceschedule is the array containing the quantity range and the price
				if (prices.priceschedule)
				{
					//The index 0 will be the case when the quantity is greater than 0 and lower than prices.priceschedule[0].maximumquantity
					return prices.priceschedule[0].price;
				}
				/*else
				 {
				 return prices.onlinecustomerprice;
				 }
				 }
				 else
				 {*/
				//This is the default price, equivalent to onlinecustomerprice but without taking into account the amount of items into the cart
				//This value returns the 'Base Price'
				return item.get('pricelevel1');
			}
		}

		// @property {String} _comparePriceAgainstFormated This method a formatted version of the method _comparePriceAgainst
	,   _comparePriceAgainstFormated: function (item)
		{
			var prices = item.get('_priceDetails');

			if (prices)
			{
				if (prices.priceschedule)
				{
					return prices.priceschedule[0].price_formatted;
				}
				/*else
				 {
				 return prices.onlinecustomerprice_formatted;
				 }
				 }
				 else
				 {*/
				return item.get('pricelevel1_formatted');
			}
		}
		
    ,   onlinematrixpricerange: "onlinematrixpricerange"
	   
    ,   isMatrixPriceRange: function (item)
	    {
		    if (item.get("onlinematrixpricerange")) {
		    	var prices = item.get("onlinematrixpricerange").split(" ");
		    	if (prices[0] !== prices[1]) return true;
		    }
		    
		    return false;
	    }
	    
    ,   getMatrixPriceRange: function (item)
	    {
		    if (item.get("onlinematrixpricerange")) {
		    	var prices = item.get("onlinematrixpricerange").split(" ");
			    if (prices[0] !== prices[1]) return {min: prices[0],  min_formatted: "$" + parseFloat(prices[0]).toFixed(2)
				    , max: prices[1],  max_formatted: "$" + parseFloat(prices[1]).toFixed(2)};
		    }
		    
		    return {};
	    }
	
	    // @property {String} _thumbnail Object containing the url and the altimagetext of the thumbnail
    ,   _thumbnail: function (item)
	    {
		    var item_images_detail = item.get('itemimages_detail') || {}
		    
		    // <-- custom code to allow for default color swatch to be set.
	        ,   defaultColor = item.get('custitem_default_color') && item.get('custitem_default_color').toUpperCase().replace(/ /g, '').replace(/\//g, '') || ''
		    ,   defaultImage = defaultColor && defaultColor.length > 0 ? item_images_detail[defaultColor] : {};
		
		    if(defaultImage && defaultImage.urls) {
			    var images = Utils.imageFlatten(defaultImage);
			    return images[0];
		    }
		    // ---> otherwise set image as normal
		    
		    
		    // If you generate a thumbnail position in the itemimages_detail it will be used
		    if (item_images_detail.thumbnail)
		    {
			    if (_.isArray(item_images_detail.thumbnail.urls) && item_images_detail.thumbnail.urls.length)
			    {
				    return item_images_detail.thumbnail.urls[0];
			    }
			
			    return item_images_detail.thumbnail;
		    }
		    // otherwise it will try to use the storedisplaythumbnail
		    if (SC.ENVIRONMENT.siteType && SC.ENVIRONMENT.siteType === 'STANDARD' && item.get('storedisplaythumbnail'))
		    {
			    return {
				    url: item.get('storedisplaythumbnail')
				    ,	altimagetext: item.get('_name')
			    };
		    }
		    // No images huh? carry on
		
		    var parent_item = item.get('_matrixParent');
		    // If the item is a matrix child, it will return the thumbnail of the parent
		
		    if (parent_item && parent_item.get('internalid'))
		    {
			    return parent_item.get('_thumbnail');
		    }
		
		    var images = Utils.imageFlatten(item_images_detail);
		    // If you using the advance images features it will grab the 1st one
		    if (images.length)
		    {
			    return images[0];
		    }
		
		    // still nothing? image the not available
		    return {
			    url:  Utils.getAbsoluteUrlOfNonManagedResources(Configuration.get('imageNotAvailable'))
			    ,	altimagetext: item.get('_name')
		    };
	    }
	    
	    // @property {Boolean} _allowBackordersOld
	    // this doesn't work anymore because matrix parents don't seem to be tracked on a fully configured item...
    ,	_allowBackorders: function (item) {
		    var allowBackOrders = ['Allow back orders with no out-of-stock message', 'Allow back orders but display out-of-stock message', '- Default -']
		    ,   noBackorders = ['Disallow back orders but display out-of-stock message', 'Remove item when out-of-stock']
		    ,   oosBehavior = item.get('outofstockbehavior');
		
		    var parent = item.get('_matrixParent');
		    console.log(parent, item, item.getPosibleOptions());
		    if (parent.get('internalid'))
		    {
			    oosBehavior = parent.get('outofstockbehavior')
		    }
		
		    console.log(oosBehavior);
		    if( noBackorders.indexOf(oosBehavior) > -1) {
			
			    return false
		    }
		    
		    return true;
	    }
	
    ,   _isCallForPricing: 'custitem_sc_call_for_pricing'
	   
    ,   mfgPartNo: 'custitem_mfg_part_no'
	   
    ,   freeGroundShipping: 'custitem_web_free_ship'
	    
	    // @property {String} sizechart Object containing the url and the altimagetext of the sizechart
    ,   _sizechart: function (item)
	    {
		    var item_images_detail = item.get('itemimages_detail') || {};
		
		    // If you generate a sizechart position in the itemimages_detail it will be used
		    if (item_images_detail.sizechart)
		    {
			    if (_.isArray(item_images_detail.sizechart.urls) && item_images_detail.sizechart.urls.length)
			    {
				    return item_images_detail.sizechart.urls[0];
			    }
			
			    return item_images_detail.sizechart;
		    }
		
		
		    var parent_item = item.get('_matrixParent');
		    // If the item is a matrix child, it will return the thumbnail of the parent
		    if (parent_item && parent_item.get('internalid'))
		    {
			    return parent_item.get('_sizechart');
		    }
		
	    }
	
    });

});