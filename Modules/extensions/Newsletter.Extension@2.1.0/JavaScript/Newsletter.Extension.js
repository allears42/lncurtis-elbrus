/*
	© 2017 JHM Services
*/

// @module Newsletter
define(
	'Newsletter.Extension'
,   [
		'Newsletter'
	,	'Footer.View'
	,	'Newsletter.Model.Extension'
	,	'Newsletter.View'
	,	'Newsletter.Router'
	]
,   function (
		Newsletter
	,	FooterView
	,	NewsletterModelExtension
	,	NewsletterView
	,	NewsletterRouter
	)
{
	'use strict';

	_.extend(Newsletter, {
		//@method mountToApp
		//@param {ApplicationSkeleton} application
		//@return {Void}
		mountToApp: _.wrap(Newsletter.prototype.mountToApp, function mountToApp (fn, application)
		{
			fn.apply(this, _.toArray(arguments).slice(1));
			
			return new NewsletterRouter(application);
		})
	});
	
	//@class Newsletter @extend ApplicationModule
	return  {
		NewsletterModelExtension: NewsletterModelExtension
	
	};
});