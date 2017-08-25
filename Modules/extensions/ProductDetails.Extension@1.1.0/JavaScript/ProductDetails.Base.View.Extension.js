/*
	© 2017 LN Curtis
*/

define(
    'ProductDetails.Base.View.Extension'
    ,	[
        'ProductDetails.Base.View'
    ,   'LiveOrder.Model'
    ,   'ProductDetails.Options.Selector.View'
    ,   'ProductDetails.ImageGallery.View'
    ,   'ProductLine.Stock.View'

    ,	'underscore'
    ]
    ,	function(
        ProductDetailsBaseView
    ,   LiveOrderModel
    ,   ProductDetailsOptionsSelectorView
    ,   ProductDetailsImageGalleryView
    ,   ProductLineStockView

    ,	_
    )
    {
        'use strict';

        _.extend( ProductDetailsBaseView.prototype, {

            showModalPageHeader: true

        ,   events: _.extend( ProductDetailsBaseView.prototype.events,
            {
                'click [data-action="print-page"]': 'triggerPrint'
            ,   'click [data-action="show-size-chart"]': 'showSizeChart'
            ,   'contextmenu img': 'preventContextMenu'
            })

        ,   initialize: _.wrap( ProductDetailsBaseView.prototype.initialize, function(fn)
            {
                fn.apply(this, _.toArray(arguments).slice(1));
                this.cart = LiveOrderModel.getInstance();

            })

        ,   childViews: _.extend( ProductDetailsBaseView.prototype.childViews,
            {
                'Product.ImageGallery': function ()
                {
                    // fix for missing alt image tags
                    var item = this.model
                    ,   images = this.model.get('_images', true);

                    images = _.each(images, function (image, index) {
                        if (image.altimagetext.length < 1)
                        {
                            // replace any double quotes with ascii symbol.
                            image.altimagetext = "Image " + index + 1 + " of " + item.get('_name').replace(/"/g, "&#34;")
                        }
                    });

                    return new ProductDetailsImageGalleryView({
                            model:this.model
                        ,   images: images
                        ,   videos: this.model.get('_videos', true)
                        ,   origin: this.inModal ? 'PDPQUICK' : 'PDPFULL'
                    });
                }

                ,	'Product.Stock.Info': function ()
                    {
                        return new ProductLineStockView({
                            model: this.model
                        ,   origin: "PDP_DETAIL"
                        ,   application: this.application
                        });
                    }
            })

        ,   preventContextMenu: function (e)
            {
                e.preventDefault();
                console.error('You\'re attempting to access an image that is copyrighted by LNCurtis.com');
                return false;
            }

        });
    });
