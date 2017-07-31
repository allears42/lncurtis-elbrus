/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Wizard
define('Wizard.Router.OOSMessage'
,	[	'Wizard.Router'
	,	'underscore'
	,	'jQuery'
	,	'Utils'
	]
,	function (
		WizardRouter
	,	_
	,	jQuery
	)
{
	'use strict';

	_.extend(WizardRouter.prototype, {
		
		// @method processErrorMessage Fix errors message that contains anchors HTML to correctly point to URLs
		// that are not handle by the navigation helper
		// @param {String} error_message
		// @return {String}
		processErrorMessage: function (error_message)
		{
			var $error = jQuery('<div>').append(error_message);
			//$error.find('a').attr('data-navigation', 'ignore-click');
			
			return $error.html();
		}
	});
});
