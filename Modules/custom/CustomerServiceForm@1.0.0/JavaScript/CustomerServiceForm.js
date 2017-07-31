
define(
	'CustomerServiceForm'
,	[
		'SC.Configuration'
	,	'CustomerServiceForm.Router'

	,	'underscore'
	,	'Utils'
	]
,	function (
		Configuration
	,	Router

	,	_
	)
{
	'use strict';

	var Module = function()
	{
		// Is Case functionality available for this application?
		var isCaseManagementEnabled = function ()
		{
			return SC && SC.ENVIRONMENT && SC.ENVIRONMENT.casesManagementEnabled;
		};

		var mountToApp = function (application)
		{
			return new Router(application);
		};

		return {
			Router: Router
		,	isEnabled: isCaseManagementEnabled
		,	mountToApp: mountToApp
		};
	}();

	return Module;
});