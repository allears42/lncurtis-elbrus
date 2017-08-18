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

            createFromProduct: function( product )
            {
                var line = new LiveOrderLineModel(product.toJSON())
                    ,	item = product.get('item')
                    ,	item_images_detail = item.get('itemimages_detail')
                    ,	is_matrix_item = !!item.get('_matrixChilds').length;

                if (_.isEqual(item_images_detail, {}) && item.get('_matrixParent').get('internalid') && item.get('_matrixParent').get('itemimages_detail'))
                {
                    item_images_detail = item.get('_matrixParent').get('itemimages_detail');
                }

                line.set('item', product.getItem().clone(), {silent:true});
                line.get('item').set('itemimages_detail', item_images_detail, {silent:true});
                line.get('item').set('itemid', item.get('itemid'), {silent:true});
                line.set('rate_formatted', product.getPrice().price_formatted, {silent:true});

                product.get('options').each(function (product_option)
                {
                    var line_option = line.get('options').findWhere({cartOptionId: product_option.get('cartOptionId')});
                    line_option.attributes = _.extend({}, product_option.attributes, line_option.attributes);

                    //todo@shelby: is this correct for the migration of: "LiverOrder.Model@3.0.0 from Vinson?

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

                if (is_matrix_item)
                {
                    line.get('item').set('matrix_parent', product.get('item'));
                }

                return line;
            }

        });

    });
