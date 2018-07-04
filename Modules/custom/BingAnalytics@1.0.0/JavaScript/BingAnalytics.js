/*
	© 2018 JHM Services
*/

//@module BingAnalytics
(function (win, name)
{
	'use strict';

	console.log('IN BING ANALYTICS MODULE --------------');
	// win.GoogleAnalyticsObject = name;
	// win[name] = win[name] || function ()
	// {
	// 	(win[name].q = win[name].q || []).push(arguments);
	// };
	// win[name].l = 1 * new Date();



	//@class BingAnalytics @extends ApplicationModule
	// ------------------
	// Loads google analytics script and extends application with methods:
	// * trackPageview
	// * trackEvent
	// * trackTransaction
	// Also wraps layout's showInModal
	define('BingAnalytics'
	,	[	'Tracker'
		,	'underscore'
		,	'jQuery'
		,	'Backbone'
		,	'Utils'
		,	'SC.Configuration'
		]
	,	function (
			Tracker
		,	_
		,	jQuery
		,	Backbone
		,	Utils
		,	Configuration
		)
	{
		var BingAnalytics = {
			
			//@method doCallback Indicates if this module do a callback after some particular events
			//@return {Boolean}
			// doCallback: function()
			// {
			// 	return !win[name].q;
			// }

			//@method trackPageview
			//@param {String} url
			//@return {BingAnalytics}
			trackPageview: function (url)
			{
				if (_.isString(url))
				{
					win[name] = win[name] || [];
					win[name].push({'ea': 'page_view', 'el': url});
				}

				return this;
			}

			//@method trackEvent
			//@param {TrackEvent} event
			//@return {BingAnalytics}
		,	trackEvent: function (event)
			{
				// console.log('TRACK EVENT ----------------------');
				if (event && event.category && event.action)
				{
					win[name] = win[name] || [];
					win[name].push({'ea': event.action, 'el': event.category});
				}

				return this;
			}

			//@method addItem
			//@param {Object<String:id,String:name>} item
			//@return {BingAnalytics}
		,	addItem: function (item)
			{
				// console.log('TRACK ADD ITEM ----------------------');
				if (item && item.id)
				{
					win[name] = win[name] || [];
					win[name].push({'ea': 'add_to_cart', 'el': item.id});

				}

				return this;
			}

			//@method addTrans
			//@param {Object} transaction
			//@return {BingAnalytics}
		// ,	addTrans: function (transaction)
		// 	{
		// 		console.log('TRACK ADD TRANS ----------------------');
		// 		if (transaction && transaction.id)
		// 		{
		// 			win[name] = win[name] || [];
		// 			win[name].push({'ea': 'add_transaction', 'el': transaction.id});
		// 		}
        //
		// 		return this;
		// 	}

			//@method trackTrans
			//@return {BingAnalytics}
		// ,	trackTrans: function (transaction)
		// 	{
		// 		console.log('TRACK TRACK TRANS ----------------------');
        //
		// 		if(transaction && transaction.id) {
		// 			win[name] = win[name] || [];
		// 			win[name].push({'ea': 'add_transaction', 'el': transaction.id});
		// 		}
        //
        //
		// 		return this;
		// 	}

			//@method trackTransaction
			// Based on the created SalesOrder we trigger each of the analytics
			// ecommerce methods passing the required information
			// [Ecommerce Tracking](https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce)
			//@param {Tracker.Transaction.Model} @extends Backbone.Model transaction
			//@return {BingAnalytics|Void}
		// ,	trackTransaction: function (transaction)
		// 	{
		// 		console.log('TRACK TRACK TRANSACTION ----------------------');
		// 		var transaction_id = transaction.get('confirmationNumber');
        //
		// 		BingAnalytics.addTrans({
		// 			id: transaction_id
		// 		,	revenue: transaction.get('subTotal')
		// 		,	shipping: transaction.get('shippingCost') + transaction.get('handlingCost')
		// 		,	tax: transaction.get('taxTotal')
		// 		,	currency: SC.ENVIRONMENT.currentCurrency && SC.ENVIRONMENT.currentCurrency.code || ''
        //
		// 		,	page: '/' + Backbone.history.fragment
		// 		});
        //
		// 		transaction.get('products').each(function (product)
		// 		{
		// 			BingAnalytics.addItem({
		// 				id: transaction_id
		// 			,	affiliation: Configuration.get('siteSettings.displayname')
		// 			,	sku: product.get('sku')
		// 			,	name: product.get('name')
		// 			,	category: product.get('category') || ''
		// 			,	price: product.get('rate')
		// 			,	quantity: product.get('quantity')
		// 			});
		// 		});
        //
		// 		return BingAnalytics.trackTrans();
		// 	}

		,	trackTransaction: function(transaction)
			{
				// console.log('ENTER TRACK TRANSACTION ---------------');

				var subtotal = transaction.get('total');

				win[name] = win[name] || [];
				win[name].push({'gv': subtotal, 'ea': 'purchase', 'el' : 'purchase', 'ev' : subtotal, 'gc': 'USD'});
				// console.log('UETQ: ', win[name]);
			}

			//@method setAccount
			//@param {SC.Configuration} config
			//@return {Void}
		,	setAccount: function (config)
			{
				if(!config)
				{
					return this;
				}
				var domainName = Utils.isCheckoutDomain() ? config.domainNameSecure : config.domainName;

				if (_.isString(config.propertyID) && _.isString(domainName))
				{
					this.propertyID = config.propertyID;
					this.ti = config.propertyID;
					this.domainName = domainName;

					var f, n, i;
					win[name] = win[name] || [], f = function() {
						var o = {
							ti: config.propertyID
						};
						o.q = win[name], win[name] = new UET(o), win[name].push("pageLoad")
					}, n = document.createElement('script'), n.src = '//bat.bing.com/bat.js', n.async = 1, n.onload = n.onreadystatechange = function() {
						var s = this.readyState;
						s && s !== "loaded" && s !== "complete" || (f(), n.onload = n.onreadystatechange = null)
					}, i = document.getElementsByTagName('script')[0], i.parentNode.insertBefore(n, i);
				}

				return this;
			}

			//@method loadScript
			//@return {jQuery.Promise|Void}
		,	loadScript: function (config)
			{
				// console.log('CHECKPOINT 1 ---------------------');
				return !SC.isPageGenerator() && jQuery.getScript('//bat.bing.com/bat.js');
				// if(SC.ENVIRONMENT.jsEnvironment === 'browser') {
				// 	console.log('CHECKPOINT 2 ---------------------');
				// 	jQuery.getScript('//bat.bing.com/bat.js');
				// 	this.setAccount(config);
				// }
			}

			//@method mountToApp
			//@param {ApplicationSkeleton} application
			//@return {Void}
		,	mountToApp: function (application)
			{
				// we get the account and domain name from the configuration file
				// var tracking = application.getConfig('tracking.bingAnalytics');
				// TODO: Test only
				var tracking = {
					propertyID: '13000038'
				,	domainName: 'http://sb-lncurtis.jhmservices.net/'
				,	domainNameSecure: 'https://checkout.sandbox.netsuite.com/c.3880230_SB2/lncurtis-dev-elbrus/checkout.ssp'
				};

				// if track page view needs to be tracked
				if (tracking && tracking.propertyID)
				{
					BingAnalytics.setAccount(tracking);

					Tracker.getInstance().trackers.push(BingAnalytics);

					// the analytics script is only loaded if we are on a browser
					// application.getLayout().once('afterAppendView', jQuery.proxy(BingAnalytics, 'loadScript'));
					// application.getLayout().once('afterAppendView', jQuery.proxy(BingAnalytics, 'loadScript', tracking));
				}
			}
		};

		return BingAnalytics;
	});
})(window, 'uetq');
