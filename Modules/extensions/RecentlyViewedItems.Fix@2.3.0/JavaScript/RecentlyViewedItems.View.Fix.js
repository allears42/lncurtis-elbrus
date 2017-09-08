/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Cart
define('RecentlyViewedItems.View.Fix'
,	[	'Backbone.CollectionView'
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
			var is_sca_advance = this.options.application.getConfig('siteSettings.sitetype') === 'ADVANCED'
			,	application = this.options.application
			,	layout = this.options.application.getLayout()
			,	self = this;
			
			self.collection = application.getConfig('siteSettings.sitetype') === 'ADVANCED' ? RecentlyViewedItemsCollection.getInstance() : new Backbone.Collection();
			
			BackboneCollectionView.prototype.initialize.call(this, {
				collection: self.collection
			,	viewsPerRow: Infinity
			,	cellTemplate: recently_viewed_cell_tpl
			,	rowTemplate: recently_viewed_row_tpl
			,	childView: ItemRelationsRelatedItemView
			,	template: recently_viewed_items_tpl
				,   childViewOptions: {
					showAddToCart: true
					,   application: application
				}
			});
			
			
			if (is_sca_advance)
			{
				layout.once('afterAppendView', self.loadRelatedItem, self);
				layout.currentView && layout.currentView.once('afterCompositeViewRender', self.loadRelatedItem, self);
			}
			
			var windowResizeHandler = _.throttle(function ()
			{
				if (_.getDeviceType(this.windowWidth) === _.getDeviceType(jQuery(window).width()))
				{
					return;
				}
				
				self.renderSlider();
				
				_.resetViewportWidth();
				
				this.windowWidth = jQuery(window).width();
				
			}, 1000);
			
			this._windowResizeHandler = _.bind(windowResizeHandler, this);
			
			jQuery(window).on('resize', this._windowResizeHandler);

		}
		
		,	loadRelatedItem: function loadRelatedItem ()
		{
			var self = this
			,	application = this.options.application
			,	number_of_items_displayed = application.getConfig('recentlyViewedItems.numberOfItemsDisplayed');
			
			self.collection.promise && self.collection.promise.done(function ()
			{
				Tracker.getInstance().trackProductList(self.collection, 'Recently Viewed Items');
				self.collection = collection.first(number_of_items_displayed);
				self.render();
				
				var carousel = self.$el.find('[data-type="carousel-items"]');
				
				if(_.isPhoneDevice() === false && application.getConfig('siteSettings.imagesizes'))
				{
					var img_min_height = _.where(application.getConfig('siteSettings.imagesizes'), {name: application.getConfig('imageSizeMapping.thumbnail')})[0].maxheight;
					
					carousel.find('.item-views-related-item-thumbnail').css('minHeight', img_min_height);
				}
				
				var sliderConfig = Configuration.bxSliderDefaults;
				_.initBxSlider(carousel, sliderConfig);
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
