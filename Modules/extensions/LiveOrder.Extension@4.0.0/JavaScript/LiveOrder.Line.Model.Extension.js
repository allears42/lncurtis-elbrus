/*
	© 2017 LN Curtis
*/

define(
    'LiveOrder.Line.Model.Extension'
    ,	[
        'LiveOrder.Line.Model'

	,	'underscore'

    ]
    ,	function(
        LiveOrderLineModel

        , 	_

    )
    {
        'use strict';

        _.extend( LiveOrderLineModel.prototype, {

            createFromProduct: _.wrap(LiveOrderLineModel.prototype.createFromProduct, function(fn, product )
            {
            	// run createFromProduct and get the returned line.
            	var line = fn.apply(this, _.toArray(arguments).slice(1))
	            ,   item = product.get('item');
	
	            product.get('options').each(function (product_option)
	            {
		            var line_option = line.get('options').findWhere({cartOptionId: product_option.get('cartOptionId')});
		            
		            // set additional properties on the item that we use
                    var image = _.first(item.get('_images'))
		            ,   imageURL = image.url
		            ,   itemTitle = item.get('_pageHeader')
		            ,   itemSku = item.get('_sku')
		            ,	custitem_web_free_ship = item.get('custitem_web_free_ship');
		
		            imageURL = imageURL.replace(/ /g, '%20') + "?resizeid=2&resizeh=200&resizew=200";
		
		            // set the item thumbnail value
		            // don't pass if its somehow set to an image not available
		
		            _.extend( line_option.attributes, {
			
			            'custcol_sc_item_image': (imageURL.indexOf('no_image_available') > -1) ? '' : imageURL
			            ,   'custcol_sc_item_title': itemTitle
			            ,   'custcol_sc_item_sku': itemSku
			            ,   'custcol_web_free_ship': custitem_web_free_ship ? 'T' : 'F'
			
		            });
		
	            });

                return line;
            })

        });

    });
