/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Cart
define('Cart.Confirmation.Helpers.Extension'
,	[
		'Cart.Confirmation.Helpers'
	,	'LiveOrder.Model'
	,	'Cart.Confirmation.View'

	,	'Utils'
	,	'jQuery'
	,	'underscore'
	]
,	function
	(
		CartConfirmationHelpers
	,	LiveOrderModel
	,	CartConfirmationView
	

	,	Utils
	,	jQuery
	,	_
	)
{
	'use strict';

	_.extend(CartConfirmationHelpers, {
		_showOptimisticCartConfirmation: function _showOptimisticCartConfirmation (cart_promise, line, application)
		{
			//moved to outside as its used outside if/else
			var cart_model = LiveOrderModel.getInstance();
			
			// search the item in the cart to merge the quantities
			if (LiveOrderModel.loadCart().state() === 'resolved')
			{
				
				var /*cart_model = LiveOrderModel.getInstance()
					,	*/cart_line = cart_model.findLine(line);
				
				if (cart_line)
				{
					if (line.get('source') !== 'cart')
					{
						cart_line.set('quantity', cart_line.get('quantity') + parseInt(line.get('quantity'), 10));
					}
					else
					{
						cart_line.set('quantity', line.get('quantity'));
					}
					
					cart_promise.fail(function ()
					{
						cart_line.set('quantity', cart_line.previous('quantity'));
					});
					
					line = cart_line;
				}
				else
				{
					cart_model.get('lines').add(line, {at:0});
					
					cart_promise.fail(function ()
					{
						cart_model.get('lines').remove(line);
					});
				}
			}
			
			var view = new CartConfirmationView({
				application: application
				,	model: line
			});
			
			cart_promise.done(function ()
			{
				view.model = cart_model.getLatestAddition();
				view.render();
			});
			
			view.showInModal();
		}
	});
});