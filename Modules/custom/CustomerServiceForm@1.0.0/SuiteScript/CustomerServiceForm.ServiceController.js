// CustomerServiceForm.ServiceController.js
// ----------------
// Service to register an email as a newsletter subscriptor
define(
	'CustomerServiceForm.ServiceController'
,	[
		'ServiceController'
	,	'CustomerServiceForm.Model'
	]
,	function(
		ServiceController
	,	FormModel
	)
	{
		'use strict';

		return ServiceController.extend({

			name:'CustomerServiceForm.ServiceController'

		,	options: {

			}

		,	post: function ()
			{
				return FormModel.sendCase(this.data);
			}
		});
	}
);