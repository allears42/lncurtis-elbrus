/*
	© 2017 LN Curtis
	Custom extension logic for Cart.Confirmation.View.Extension
*/

define(
	'Cart.Detailed.View.Extension'
	, [
		'Cart.Detailed.View'
	, 	'Backbone.CompositeView'
	, 	'Backbone.FormView'
	,	'Backbone.CollectionView'
	, 	'Cart.Summary.View'
	,	'Cart.Lines.View'
	,	'Cart.Item.Summary.View'
	, 	'Cart.Item.Actions.View'
	,	'RecentlyViewedItems.View'

	, 	'GlobalViews.Message.View'

	, 	'Backbone'
	, 	'underscore'
	]
	, function (
		CartDetailedView
	, 	BackboneCompositeView
	, 	BackboneFormView
	,	BackboneCollectionView
	, 	CartSummaryView
	,	CartLinesView
	,	CartItemSummaryView
    , 	CartItemActionsView
	,	RecentlyViewedItemsView
	, 	GlobalViewsMessageView
	, 	Backbone
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
				// todo: is this event event fired anymore? 'itemAddedFromRelated'
				var self = this;
				this.model.on('itemAddedFromRelated', function () {
					self.showContent();
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
				jQuery(document).scrollTop(placeholder.offset().top - 40);
				
				// Re Enables all posible disableded buttons of the line or the entire view
				if (line) {
					line.find(':disabled').attr('disabled', false);
				}
				else {
					this.$(':disabled').attr('disabled', false);
				}
			}
			
			// override for custom handling of back ordeded and OOS items
			, updateItemQuantity: function (e) {
				var self = this
					, $line = null
					, $form = this.$(e.target).closest('form')
					, options = $form.serializeObject()
					, internalid = options.internalid
					, line = this.model.get('lines').get(internalid)
					, $input = $form.find('[name="quantity"]')
					, validInput = this.validInputValue($input[0]);
				
				if (!line || this.isRemoving) {
					return;
				}
				
				if (!validInput || options.quantity) {
					var new_quantity = parseInt(options.quantity, 10)
						, item = line.get('item')
						, min_quantity = item ? item.get('_minimumQuantity', true) : line.get('minimumquantity')
						, current_quantity = parseInt(line.get('quantity'), 10)
						// custom - get stock level
						, stock_level = item.get("_stock", true)
						, allowBackorders = item.get("_allowBackorders", true);
					
					// customize calculations around new quantity
					new_quantity = (new_quantity >= min_quantity && new_quantity) ? new_quantity : current_quantity;
					
					if (new_quantity > stock_level && !allowBackorders) {
						new_quantity = stock_level;
						self.showError("<span>Limited quantities, only " + stock_level + " available.</span>", this.$('#' + internalid + ' + .item-summary-line-2'), false);
					}
					
					$input.val(new_quantity);
					
					if (new_quantity !== current_quantity) {
						
						$line = this.$('#' + internalid);
						$input.val(new_quantity).prop('disabled', true);
						line.set('quantity', new_quantity);
						
						var invalid = line.validate();
						
						if (!invalid) {
							var update_promise = this.model.updateLine(line);
							
							this.disableElementsOnPromise(update_promise, '#' + internalid + ' button');
							
							update_promise.fail(function (jqXhr) {
								jqXhr.preventDefault = true;
								var result = JSON.parse(jqXhr.responseText);
								
								self.showError(result.errorMessage, $line, result.errorDetails);
								line.set('quantity', current_quantity);
							}).always(function () {
								$input.prop('disabled', false);
							});
						}
						else {
							var placeholder = this.$('#' + internalid + ' [data-type="alert-placeholder"]');
							placeholder.empty();
							
							_.each(invalid, function (value) {
								var global_view_message = new GlobalViewsMessageView({
									message: value
									, type: 'error'
									, closable: true
								});
								
								placeholder.append(global_view_message.render().$el.html());
							});
							
							$input.prop('disabled', false);
							line.set('quantity', current_quantity);
						}
					}
				}
			}
			
			, childViews: _.extend({}, CartDetailedView.prototype.childViews, {
				'Item.ListNavigable': function () {
					// add useLinePrice variable
					return new BackboneCollectionView({
						collection: this.model.get('lines')
						, viewsPerRow: 1
						, childView: CartLinesView
						, childViewOptions: {
							navigable: true
							, useLinePrice: true
							, application: this.application
							, SummaryView: CartItemSummaryView
							, ActionsView: CartItemActionsView
							, showAlert: false
						}
					});
				}
				
				, 'RecentlyViewed.Items': function () {
					// add child view options
					return new RecentlyViewedItemsView(
						{
							application: this.application
							, childViewOptions: {
							showAddToCart: true
						}
						});
				}
			})
			
		});
		
	});
