/*
	© 2017 JHM Services
	Custom messaging shown on shipping address
*/

//@module Address
define(
	'Address.Edit.Fields.View.Extension'
,	[	'Address.Edit.Fields.View'

	,	'SC.Configuration'

	,	'Backbone'
	,	'underscore'
	,	'jQuery'
	]
,	function (
		AddressEditFieldsView

	,	Configuration

	,	Backbone
	,	_
	,	jQuery
	)
{
	'use strict';
	
	_.extend(AddressEditFieldsView.prototype, {
		events: _.extend({}, AddressEditFieldsView.prototype.events, {
		'click [data-action="show-shipping-info"]': 'showShippingRestrictionInfo'
		})
		
	,   getContext: _.wrap(AddressEditFieldsView.prototype.getContext, function (fn) {
			var returnVariable = fn.apply(this, _.toArray(arguments).slice())
				,   self = this;
			
			_.extend(returnVariable, {
				showShippingMessage: this.manage === "shipaddress-"
			});
			
			return returnVariable;
		})
			
	// @method showSecureInfo Shows
	,	showShippingRestrictionInfo : function()
		{
			var view = new Backbone.View({application: this.options.application})
			,	self = this;
			
			view.title = _('States We Can\'t Ship To').translate();
			view.render = function ()
			{
				this.$el.html(_(Configuration.get('restrictedShipping.message')).translate());
				return this;
			};
			
			view.showInModal();
		}
	});

});
