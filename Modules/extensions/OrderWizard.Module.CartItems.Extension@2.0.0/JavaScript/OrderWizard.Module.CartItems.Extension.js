/*
	© 2017 JHM Services
	Fix for total amount shown in item summary area
	Changes to UI defaults
*/

//@module OrderWizard.Module.CartItems
define(
	'OrderWizard.Module.CartItems.Extension'
,	[
	'OrderWizard.Module.CartItems'
	,	'Backbone.CollectionView'
	,	'Transaction.Line.Views.Cell.Navigable.View'
	
	,	'OrderWizard.Module.CartItems.Ship.Extension'

	,	'underscore'
	,	'Utils'
	]
,	function (
		OrderWizardModuleCartItems
	,	BackboneCollectionView
	,	TransactionLineViewsCellNavigableView
	
	,	OrderWizardModuleCartItemsShipExtension

	,	_
	)
{
	'use strict';

	_.extend(OrderWizardModuleCartItems.prototype, {
		childViews: _.extend({}, OrderWizardModuleCartItems.prototype.childViews, {
			'Items.Collection': function ()
			{
				return new BackboneCollectionView({
					collection: this.model.get('lines')
					,	childView: TransactionLineViewsCellNavigableView
					,	viewsPerRow: 1
					,	childViewOptions: {
						navigable: !this.options.hide_item_link
						
						,	detail1Title: _('Qty:').translate()
						,	detail1: 'quantity'
						
						,	detail2Title: _('Unit price:').translate()
						,	detail2: 'rate_formatted'
						
						,	detail3Title: _('Amount:').translate()
						// this is a bug - use amount_formatted which is the incorrect variagble
						,	detail3: 'total_formatted'
					}
				});
			}
		})
		
	,   getContext: _.wrap(OrderWizardModuleCartItems.prototype.getContext, function (fn) {
			var returnVariable = fn.apply(this, _.toArray(arguments).slice(1));
			
			_.extend(returnVariable, {
				//@property {Boolean} showOpenedAccordion
				// always collapse
				showOpenedAccordion: false// _.result(this.options || {}, 'showOpenedAccordion', false)
				//@property {Boolean} showHeaders
				// don't show headers
				,	showHeaders: false //!this.options.hideHeaders
			});
			
			return returnVariable;
		})
	});
	
	return {
		OrderWizardModuleCartItemsShipExtension: OrderWizardModuleCartItemsShipExtension
	}
});