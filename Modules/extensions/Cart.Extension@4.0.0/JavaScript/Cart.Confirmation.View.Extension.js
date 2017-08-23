/*
	© 2017 LN Curtis
	Custom extension logic for Cart.Confirmation.View.Extension
*/

define(
	'Cart.Confirmation.View.Extension'
	, [
		'Cart.Confirmation.View'
		, 'Transaction.Line.Views.Price.View'
		, 'Backbone.CompositeView'
		
		, 'underscore'
	]
	, function (CartConfirmationViewExtension
		, TransactionLineViewsPriceView
		, BackboneCompositeView
		, _) {
		'use strict';
		
		_.extend(CartConfirmationViewExtension.prototype, {
			
			 getContext: _.wrap(CartConfirmationViewExtension.prototype.getContext, function (fn) {
			 
				var returnVariable = fn.apply(this, _.toArray(arguments).slice(1))
				,   item = this.model.get('item')
				,   itemOptions = item.get('options')
				,   customImage = _.first(_.filter(itemOptions, function (option) {
					return option && option.id === "CUSTCOL_SC_ITEM_IMAGE"
				}));
				
				// add custom parameters to return variable
				_.extend(returnVariable, {
					image: (customImage && customImage.value) ? customImage.value : item.get('_thumbnail').url
				});
				
				// @class Cart.Confirmation.View.Context
				return returnVariable
			})
		});
	});
