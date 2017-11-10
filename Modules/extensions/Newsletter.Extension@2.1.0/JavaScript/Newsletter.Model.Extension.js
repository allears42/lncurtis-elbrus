/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Newsletter
define(
	'Newsletter.Model.Extension'
,	[
		'Newsletter.Model'
	,	'underscore'
	,	'Utils'
	]
,	function (
		NewsletterModel
	,	_
	,	Utils
	)
{
	'use strict';

	_.extend(NewsletterModel.prototype, {
		
		validation: _.extend(NewsletterModel.prototype.validation, {
			firstName: [{
				required: true,
				msg: 'Enter your first name'
			}]
			,	lastName: [{
				required: true,
				msg: 'Enter your last name'
			}]
			,	zipcode: [{
				fn: _.validateZipCode
			}]
		})
		
		// @property {String} firstName The firstName of the subscriber
		,	firstName: ''
		
		// @property {String} lastName The lastName of the subscriber
		,	lastName: ''
	});
	
});