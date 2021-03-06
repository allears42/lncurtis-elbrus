/*
	© 2017 LN Curtis
*/

define(
    'Home.View.Extension'
    ,	[
        'Home.View'
    ,   'SC.Configuration'
    ,   'Home.BestSellers.View'
    ,   'Home.BestSellers.Items.Model'

	,	'underscore'
	,	'Utils'

    ]
    ,	function(
        HomeView
    ,   Configuration
    ,   HomeBestSellersView
    ,   HomeBestSellersItemsModel

	, 	_
	,	Utils

    )
    {
        'use strict';

        _.extend( HomeView.prototype, {

            initialize: function ()
            {
                var self = this;
                this.windowWidth = jQuery(window).width();
                this.slides = Configuration.get('home.carouselImages', []);
                this.on('afterViewRender', function()
                {
                    if (self.slides.length > 1) {
                        _.initBxSlider(self.$('[data-slider]'), {
                            nextText: '<a class="home-gallery-next-icon"></a>'
                            , prevText: '<a class="home-gallery-prev-icon"></a>'
                        });
                    }
                });

                var windowResizeHandler = _.throttle(function ()
                {
                    if (_.getDeviceType(this.windowWidth) === _.getDeviceType(jQuery(window).width()))
                    {
                        return;
                    }
                    this.showContent();

                    _.resetViewportWidth();

                    this.windowWidth = jQuery(window).width();

                }, 1000);

                this._windowResizeHandler = _.bind(windowResizeHandler, this);

                jQuery(window).on('resize', this._windowResizeHandler);
            }

        ,   childViews: _.extend({}, HomeView.prototype.childViews, {

                'BestSellers': function() {
                    
                    var homeBestSellersItemsModel = new HomeBestSellersItemsModel()
                    ,   homeBestSellersItemsPromise = homeBestSellersItemsModel.fetch();
                    
                    return new HomeBestSellersView({
                        homeBestSellersItemsModel: homeBestSellersItemsModel
                    ,   homeBestSellersItemsPromise: homeBestSellersItemsPromise
                    });
                }
            })

		,	getContext: _.wrap( HomeView.prototype.getContext, function(fn)
			{
				var self = this
                ,   carouselImages = Configuration.get('home.carouselImages', []);

			return {
				// @property {String} imageResizeId
				imageHomeSize: Utils.getViewportWidth() < 480 ? '480' : 'homeslider'
				,   isDesktop: Utils.getViewportWidth() > 991
				,   isTablet: Utils.getViewportWidth() > 767
				// @property {Array} carouselImages
				,   carouselImages: carouselImages
			}
			})

        });

    });
