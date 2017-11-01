/*
	© 2017 LN Curtis
	Custom extension logic for Cart.Detailed.View.Extension
*/

define(
	'Cart.Detailed.View.Extension'
	, [
		'Cart.Detailed.View'
	,	'Backbone.CollectionView'
	,	'Cart.Lines.View'
	,	'Cart.Item.Summary.View'
	, 	'Cart.Item.Actions.View'
	,	'Cart.Item.Total.View'
	
	,	'RecentlyViewedItems.View'

	, 	'GlobalViews.Message.View'

	, 	'SC.Configuration'
	, 	'Backbone'
	, 	'Utils'
	, 	'underscore'
	]
	, function (
		CartDetailedView
	,	BackboneCollectionView
	,	CartLinesView
	,	CartItemSummaryView
    , 	CartItemActionsView
	,	CartItemTotalView
	
	,	RecentlyViewedItemsView
	, 	GlobalViewsMessageView
	
	, 	Configuration
	, 	Backbone
	, 	Utils
	, 	_
	)
	{
		'use strict';
		
		_.extend( CartDetailedView.prototype, {
			
			events: _.extend({}, CartDetailedView.prototype.events, {
				'click [data-action="print-page"]': 'triggerPrint'
			})
			
			, initialize: _.wrap(CartDetailedView.prototype.initialize, function (fn, options) {
				fn.apply(this, _.toArray(arguments).slice(1));
				
				
				// custom handling for items added from related
				var self = this;
				
				this.model.on('change', function () {
					jQuery(document).scrollTop(0);
				}, this);
				
				
				// custom handling for window resize event
				this.windowWidth = jQuery(window).width();
				var windowResizeHandler = _.throttle(function () {
					if (_.getDeviceType(self.windowWidth) === _.getDeviceType(jQuery(window).width())) {
						return;
					}
					
					if (Backbone.history.getFragment() === "cart") {
						self.showContent();
					}
					
					_.resetViewportWidth();
					
					self.windowWidth = jQuery(window).width();
					
				}, 1000);
				this._windowResizeHandler = _.bind(windowResizeHandler, this);
				jQuery(window).on('resize', this._windowResizeHandler);
				
			})
			
			// @method initPlugins
			// initialize plugins
			, initPlugins: function initPlugins() {
				if (Configuration.get('siteSettings.sitetype') === 'ADVANCED' && this.model.get('lines').length > 0) {
					this.$('[data-action="sticky"]').scStickyButton();
				}
				
				Utils.initBxSlider(this.$('[data-type="carousel-items"]'), Configuration.get('bxSliderDefaults'));
			}
			
			// add destroy handler to remove resize events when view is destroyed
			, destroy: function () {
				Backbone.View.prototype.destroy.apply(this, arguments);
				jQuery(window).off('resize', this._windowResizeHandler);
			}
			
			// custom event to print cart page
			, triggerPrint: function (e) {
				window.print();
			}
			
			// @method showError
			, showError: function showError(message, line, error_details) {
				var placeholder;
				
				this.hideError();
				
				if (line) {
					// if we detect its a rolled back item, (this i an item that was deleted
					// but the new options were not valid and was added back to it original state)
					// We will move all the references to the new line id
					if (error_details && error_details.status === 'LINE_ROLLBACK') {
						var new_line_id = error_details.newLineId;
						
						line.attr('id', new_line_id);
						
						line.find('[name="internalid"]').attr({
							id: 'update-internalid-' + new_line_id
							, value: new_line_id
						});
					}
					
					console.log(line);
					
					placeholder = line.find('[data-type="alert-placeholder"]');
					this.hideError(line);
				}
				else {
					// don't show errors on all lines
					placeholder = this.$('[data-type="alert-placeholder-main"]');
					this.hideError();
				}
				
				// Finds or create the placeholder for the error message
				if (!placeholder.length) {
					placeholder = jQuery('<div/>', {'data-type': 'alert-placeholder'});
					this.$el.prepend(placeholder);
				}
				
				var global_view_message = new GlobalViewsMessageView({
					message: message
					, type: 'error'
					, closable: true
				});
				
				// Renders the error message and into the placeholder
				placeholder.append(global_view_message.render().$el.html());
				
				// custom - scroll to error
				jQuery(document).scrollTop(placeholder.offset().top - 150);
				
				// Re Enables all posible disableded buttons of the line or the entire view
				if (line) {
					line.find(':disabled').attr('disabled', false);
				}
				else {
					this.$(':disabled').attr('disabled', false);
				}
			}
			
			, childViews: _.extend({}, CartDetailedView.prototype.childViews, {
				'Item.ListNavigable': function () {
					return new BackboneCollectionView({
						collection: this.model.get('lines')
						, viewsPerRow: 1
						, childView: CartLinesView
						, childViewOptions: {
							navigable: true
							, application: this.application
							, SummaryView: CartItemSummaryView
							, ActionsView: CartItemActionsView
							, TotalView: CartItemTotalView
							, showAlert: false
						}
					});
				}
			})
			
		});
		
	});
