/*
	© 2017 LN Curtis
*/

define(
    'ProductDetails.Base.View.Extension'
    ,	[
        'ProductDetails.Base.View'
    ,   'ProductDetails.Full.View'
		
    ,   'LiveOrder.Model'
    ,   'ProductDetails.ImageGallery.View'
    ,   'ProductLine.Stock.View'

    ,	'Backbone'
    ,	'underscore'
    ]
    ,	function(
        ProductDetailsBaseView
    ,   ProductDetailsFullView
    
    ,   LiveOrderModel
    ,   ProductDetailsImageGalleryView
    ,   ProductLineStockView

    ,	Backbone
    ,	_
    )
    {
        'use strict';

        ProductDetailsFullView.prototype.optionBindEventByType = {
	        //@class ProductDetails.Base.View.OptionBinding This class associated an option type with the event used to set the option's value
	        // @extend Dictionary<String, String>
	        'select': 'change'
	        ,	'text': 'blur'
	        ,	'date': 'change'
        };
        
        _.extend( ProductDetailsBaseView.prototype, {

            events: _.extend({}, ProductDetailsBaseView.prototype.events, {
                'contextmenu img': 'preventContextMenu'
            })
	
        ,   preventContextMenu: function (e)
	        {
		        e.preventDefault();
		        console.error('You\'re attempting to access an image that is copyrighted by LNCurtis.com');
		        return false;
	        }

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
	        
		,   getContext: _.wrap(ProductDetailsBaseView.prototype.getContext, function (fn) {
		        var returnVariable = fn.apply(this, _.toArray(arguments).slice(1))
		        ,   isCallForPricing = this.model.get('item').get('_isCallForPricing');
		
		        _.extend(returnVariable, {
					isCallForPricing: isCallForPricing
		        ,   origin: document.location.origin
		        });
		
		        return returnVariable;
            })

        });
    });
