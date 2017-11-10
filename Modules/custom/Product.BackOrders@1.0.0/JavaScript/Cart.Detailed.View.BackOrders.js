/*
	© 2017 LN Curtis
	Custom extension logic for Cart.Detailed.View.Extension
*/

define(
	'Cart.Detailed.View.BackOrders'
	, [
		'Cart.Detailed.View'
	, 	'RecentlyViewedItems.View'
	, 	'Backbone'
	, 	'underscore'
	]
	, function (
		CartDetailedView
	, 	RecentlyViewedItemsView
	, 	Backbone
	, 	_
	)
	{
		'use strict';
		
		_.extend( CartDetailedView.prototype, {
			// override for custom handling of back ordered and OOS items
			updateItemQuantity: function (e) {
				
				var self = this
				,   $line = null
				,   $form = this.$(e.target).closest('form')
				,   options = $form.serializeObject()
				,   internalid = options.internalid
				,   line = this.model.get('lines').get(internalid)
				,   $input = $form.find('[name="quantity"]')
				,   validInput = this.validInputValue($input[0]);
				
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
						, allowBackorders = item.get("_isBackorderable", true);
					
					// customize calculations around new quantity
					new_quantity = (new_quantity >= min_quantity && new_quantity) ? new_quantity : current_quantity;
					
					if (new_quantity > stock_level && !allowBackorders) {
						new_quantity = stock_level;
						self.showError("<span>Only " + stock_level + " available. We've adjusted the quantity for you.</span>", this.$('#' + internalid + ' .cart-lines-table-middle-secondary'), false);
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
				'RecentlyViewed.Items': function () {
					// add child view options
					return new RecentlyViewedItemsView(
					{
						application: this.application
					,   childViewOptions: {
							showAddToCart: true
						}
					});
				}
			})
			
		});
		
	});
