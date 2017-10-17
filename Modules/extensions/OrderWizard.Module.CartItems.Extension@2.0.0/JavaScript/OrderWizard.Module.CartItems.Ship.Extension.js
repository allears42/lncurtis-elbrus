/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module OrderWizard.Module.CartItems
define(
	'OrderWizard.Module.CartItems.Ship.Extension'
,	[
		'OrderWizard.Module.CartItems.Ship'
	,	'Backbone.CollectionView'
	,	'Transaction.Line.Views.Cell.Navigable.View'

	,	'underscore'
	,	'Utils'
	]
,	function (
		OrderWizardModuleCartItemsShip
	,	BackboneCollectionView
	,	TransactionLineViewsCellNavigableView
	,	_
	)
{
	'use strict';

	_.extend(OrderWizardModuleCartItemsShip.prototype, {
		childViews: _.extend({}, OrderWizardModuleCartItemsShip.prototype.childViews, {
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
		
		,   getContext: _.wrap(OrderWizardModuleCartItemsShip.prototype.getContext, function (fn) {
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
	})
	
});
