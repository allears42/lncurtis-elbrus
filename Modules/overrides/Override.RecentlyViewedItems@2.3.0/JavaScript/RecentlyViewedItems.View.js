/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Cart
define('RecentlyViewedItems.View'
,	[
		'Backbone.CollectionView'
	,	'ItemRelations.RelatedItem.View'
	,	'RecentlyViewedItems.Collection'
	,	'SC.Configuration'
	,	'Tracker'

	,	'recently_viewed_items.tpl'
	,	'recently_viewed_row.tpl'
	,	'recently_viewed_cell.tpl'

	,	'jQuery'
	,	'Backbone'
	,	'underscore'
	,	'Utils'

	]
,	function (
		BackboneCollectionView
	,	ItemRelationsRelatedItemView
	,	RecentlyViewedItemsCollection
	,	Configuration
	,	Tracker

	,	recently_viewed_items_tpl
	,	recently_viewed_row_tpl
	,	recently_viewed_cell_tpl

	,	jQuery
	,	Backbone
	,	_
	)
{
	'use strict';
	
	
	return BackboneCollectionView.extend({

		initialize: function (options)
		{
			this.options = options;
		
			var application = this.options.application;
			
			if(application) {
				var is_sca_advance = application.getConfig('siteSettings.sitetype') === 'ADVANCED'
				,   layout = application.getLayout()
				,   self = this;
				
				self.collection = application.getConfig('siteSettings.sitetype') === 'ADVANCED' ? RecentlyViewedItemsCollection.getInstance() : new Backbone.Collection();
				
				BackboneCollectionView.prototype.initialize.call(this, {
					collection: self.collection
					, viewsPerRow: Infinity
					, cellTemplate: recently_viewed_cell_tpl
					, rowTemplate: recently_viewed_row_tpl
					, childView: ItemRelationsRelatedItemView
					, template: recently_viewed_items_tpl
					, childViewOptions: {
						showAddToCart: true
						, application: application
					}
				});
				
				
				if (is_sca_advance) {
					layout.once('afterAppendView', self.loadRelatedItem, self);
					layout.currentView && layout.currentView.once('afterCompositeViewRender', self.loadRelatedItem, self);
				}
				
				var windowResizeHandler = _.throttle(function () {
					if (_.getDeviceType(this.windowWidth) === _.getDeviceType(jQuery(window).width())) {
						return;
					}
					
					self.renderSlider();
					
					_.resetViewportWidth();
					
					this.windowWidth = jQuery(window).width();
					
				}, 1000);
				
				this._windowResizeHandler = _.bind(windowResizeHandler, this);
				
				jQuery(window).on('resize', this._windowResizeHandler);
				
			}

		}
		
	,   renderSlider: function ()
		{
			var self = this
				,   application = this.options.application
				,	carousel = this.$el.find('[data-type="carousel-items"]');
			
			if (_.isPhoneDevice() === false && application.getConfig('siteSettings.imagesizes')) {
				var img_min_height = _.where(application.getConfig('siteSettings.imagesizes'), {name: application.getConfig('imageSizeMapping.thumbnail')})[0].maxheight;
				
				carousel.find('.item-relations-related-item-thumbnail').css('minHeight', img_min_height);
			}
			
			if(this.collection.length > 1) {
				var sliderDefaults = Configuration.bxSliderDefaults;
				
				_.extend(sliderDefaults, {
					slideMargin: 20
					, pager: false
					, controls: true
					, infiniteLoop: false
					, slideWidth: 160
					, maxSlides: 5
					, hideControlOnEnd: true
				});
				if (_.getViewportWidth() < 992) {
					_.extend(sliderDefaults, {
						maxSlides: 4
					});
					
				}
				if (_.getViewportWidth() < 768) {
					_.extend(sliderDefaults, {
						maxSlides: 3
					});
				}
				if (_.getViewportWidth() < 480) {
					_.extend(sliderDefaults, {
						maxSlides: 1
						,   slideWidth: 340
					});
				}
				
				var screenWidth = _.getViewportWidth() > 1170 ? 1170 : _.getViewportWidth()
				,   slideWidth = Math.floor(screenWidth / sliderDefaults.maxSlides) - sliderDefaults.slideMargin - sliderDefaults.maxSlides;
				
				_.extend(sliderDefaults, {
					slideWidth: slideWidth
				});
				
				
				this.slider && this.slider.destroySlider();
				this.slider = _.initBxSlider(carousel, sliderDefaults);
				
				setTimeout(function ()
				{
					if(self.slider && self.slider.redrawSlider) self.slider.redrawSlider()
				}, 500)
				
			}
			else {
				this.slider && this.slider.destroySlider();
				this.slider = null;
			}
		}
		
	,	loadRelatedItem: function loadRelatedItem ()
		{
			var self = this
			,	application = this.options.application
			,	number_of_items_displayed = application.getConfig('recentlyViewedItems.numberOfItemsDisplayed');
			
			self.collection.promise && self.collection.promise.done(function ()
			{
				Tracker.getInstance().trackProductList(self.collection, 'Recently Viewed Items');
				self.collection = self.collection.first(number_of_items_displayed);
				self.render();
				self.renderSlider();
				
			});
		}
		
	,	destroy: function destroy ()
		{
			this._destroy();
			
			var	layout = this.options.application.getLayout();
			
			layout.off('afterAppendView', this.loadRelatedItems, this);
			layout.currentView && layout.currentView.off('afterCompositeViewRender', this.loadRelatedItems, this);
		}
	});
});
