define(
	'CustomerServiceForm.Router'
,	[
	 	'AjaxRequestsKiller'
 	,	'CustomerServiceForm.View'
	,	'Backbone'
	,	'underscore'
	,	'jQuery'
	,	'Utils'
	]
,	function (
		AjaxRequestsKiller
	,	View
	,	Backbone
	,	_
	,	jQuery
	)
{
	'use strict';

	return Backbone.Router.extend({

		routes:
		{
			'contact-us-customer-service': 'showCustomerServiceForm'
		}

	,	initialize: function (application)
		{
			this.application = application;
		}

	,	showCustomerServiceForm: function (options)
		{
			//console.log('CustomerServiceForm.Router#showCustomerServiceForm');

			var view = new View({
				application: this.application
			});
			view.showContent();
		}

	});
});
