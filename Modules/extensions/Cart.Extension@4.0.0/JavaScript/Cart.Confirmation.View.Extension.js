/*
	© 2017 LN Curtis
	Custom extension logic for Cart.Confirmation.View.Extension
*/

define('Cart.Confirmation.View.Extension'
	, [
		'Cart.Confirmation.View'
		, 'underscore'
	]
	, function (
		CartConfirmationView
		, _
	) {
		'use strict';
		
		_.extend(CartConfirmationView.prototype, {
			
			 getContext: _.wrap(CartConfirmationView.prototype.getContext, function (fn) {
			 
				var returnVariable = fn.apply(this, _.toArray(arguments).slice(1))
				,   item = this.model.get('item')
				,   itemOptions = item.get('options')
				,   customImage = _.first(_.filter(itemOptions, function (option) {
					return option && option.id === "CUSTCOL_SC_ITEM_IMAGE"
				}));
				
				//console.log((customImage && customImage.value) ? customImage.value : item.get('_thumbnail').url, returnVariable);
				
				// add custom parameters to return variable
				_.extend(returnVariable, {
					image: (customImage && customImage.value) ? customImage.value : item.get('_thumbnail').url
				});
				
				// @class Cart.Confirmation.View.Context
				return returnVariable
			})
		});
	});
