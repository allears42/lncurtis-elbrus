/*
	© 2017 LN Curtis
	SuitePromotions Patch
*/

define(
	'Cart.Promocode.List.Item.View.Extension'
	,	[
		'Cart.Promocode.List.Item.View'
	,   'underscore'
	]
	,	function(
		CartPromocodeListItemView
	,   _
	)
	{
		'use strict';
		
		_.extend(CartPromocodeListItemView.prototype, {
			
			getContext: _.wrap(CartPromocodeListItemView.prototype.getContext, function (fn)
			{
				var returnVariables = fn.apply(this, _.toArray(arguments).splice(1));
				
				var code = this.model.get('code')
				,   hide_autoapply_promo = (!_.isUndefined(this.model.get('isautoapplied')))
					? this.model.get('applicabilityreason') === 'DISCARDED_BEST_OFFER' || (this.model.get('isautoapplied') && this.model.get('applicabilitystatus') === 'NOT_APPLIED')
					: false;
				
				_.extend(returnVariables, {
					showPromo: !!code && !hide_autoapply_promo,
					isEditable: !this.options.isReadOnly && !this.model.get('isautoapplied')
				});
				
				return returnVariables;
			})
		});
		
	});
