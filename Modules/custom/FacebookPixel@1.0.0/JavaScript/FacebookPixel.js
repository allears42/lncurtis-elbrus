//@module FacebookPixel
(function (win)
{
	'use strict';

	//@class FacebookPixel @extends ApplicationModule
	define('FacebookPixel'
	,	[	'Tracker'
		,	'underscore'
		,	'jQuery'
		,	'Backbone'
		,	'Utils'
		,	'SC.Configuration'
		,	'Session'
		]
	,	function (
			Tracker
		,	_
		,	jQuery
		,	Backbone
		,	Utils
		,	Configuration
		,	Session
		)
	{
		var FacebookPixel = {

            promise: jQuery.Deferred().reject()

			//@method trackPageview
			//@param {String} url
			//@return {FacebookPixel}
		, 	trackPageview: function (url)
			{
				if (_.isString(url))
				{
                    fbq('track', 'PageView');
				}

				return this;
			}

            //@method trackAddToCart
            //@param {Transaction.Line.Model} line
            //@return {FacebookPixel}
            ,	trackAddToCart: function (line)
            {
                if (line)
                {
                    var data = {
                        content_ids: [line.get('item').get('itemid')],
                        content_type: 'product',
                        value: line.get('amount'),
                        currency: Session.get('currency.code', 'USD')
                    };

					fbq('track', 'AddToCart', data);
                }

                return this;
            }

            //@method trackInitiateCheckout
			//@return {FacebookPixel}
		,	trackInitiateCheckout: function ()
			{
	            fbq('track', 'InitiateCheckout');

                return this;
			}

            //@method trackAddPaymentInfo
            //@return {FacebookPixel}
            ,	trackAddPaymentInfo: function ()
            {
                fbq('track', 'AddPaymentInfo');

                return this;
            }

            //@method trackLead
            //@return {FacebookPixel}
            ,	trackLead: function ()
            {
                fbq('track', 'Lead');

                return this;
            }

	        //@method trackTransaction
			// Based on the created SalesOrder we trigger each of the analytics
			// ecommerce methods passing the required information
			// [Ecommerce Tracking](https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce)
			//@param {Tracker.Transaction.Model} @extends Backbone.Model transaction
			//@return {FacebookPixel|Void}
		,	trackTransaction: function (transaction)
			{
                var data = {
                    content_ids: [],
                    content_type: 'product',
                    value: transaction.get('subTotal'),
                    currency: Session.get('currency.code', 'USD')
                };

                transaction.get('products').each(function (product)
                {
                	data.content_ids.push(product.get('sku'));
                });

                fbq('track', 'Purchase', data);

				return this;
			}

            //@method trackProductView
            //@param {Product.Model} product
            //@return {FacebookPixel|Void}
            ,	trackProductView: function (product)
            {
                var item = product.getItem();
				var price = ((product.getPrice().price) ? product.getPrice().price : 0).toFixed(2)

				var data = {
					content_ids: [item.get('itemid')],
					content_type: 'product',
					value: price,
					currency: Session.get('currency.code', 'USD')
				};

                fbq('track', 'ViewContent', data);

                return this;
            }

            //@method trackEvent Track this actions: guest-checkout, sign-in, create-account, Reorder, add-to-cart, place-order
            //@param {TrackEvent} event
            //@return {FacebookPixel|Void}
            ,	trackEvent: function (event)
            {
            	/*
                if (event && event.category && event.action)
                {
                    var eventName = 'action'
                        ,	eventData = {
                        'event': eventName
                        ,	'data': {
                            'category': event.category
                            ,	'action': event.action
                            ,	'label': event.label
                            ,	'value': parseFloat(event.value) || 0
                            ,	'page': event.page || '/' + Backbone.history.fragment
                        }
                        ,	'eventCallback': event.callback
                    };

                    //Triggers a Backbone.Event so others can subscribe to this event and add/replace data before is send it to Google Tag Manager
                    Tracker.trigger(eventName, eventData, event);
                    this.pushData(eventData);
                }
*/

                return this;
            }

            //@method loadScript
            //@return {jQuery.Promise|Void}
            ,	loadScript: function ()
            {
            	if (!SC.isPageGenerator()) {
					this.promise = jQuery.getScript('https://connect.facebook.net/en_US/fbevents.js');
				}
                return this.promise;
            }

            //@method mountToApp
			//@param {ApplicationSkeleton} application
			//@return {Void}
		,	mountToApp: function (application)
			{
				// console.log('FacebookPixel#mountToApp');

				var tracking = this.tracking = application.getConfig('tracking.facebookPixel');

				// if track page view needs to be tracked
				if (tracking && tracking.pixelID)
				{
                    var n = win.fbq = function () {
                        n.callMethod ?
                            n.callMethod.apply(n, arguments) : n.queue.push(arguments)
                    };
                    if (!win._fbq) win._fbq = n;
                    n.push = n;
                    n.loaded = !0;
                    n.version = '2.0';
                    n.queue = [];

                    fbq('init', tracking.pixelID);

                    Tracker.getInstance().trackers.push(FacebookPixel);

                    this.loadScript();
				}
			}
		};

		return FacebookPixel;
	});
})(window);
