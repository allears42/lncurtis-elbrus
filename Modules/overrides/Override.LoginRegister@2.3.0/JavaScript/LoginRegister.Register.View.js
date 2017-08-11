/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module LoginRegister
define('LoginRegister.Register.View'
,	[
		'login_register_register.tpl'

	,	'SC.Configuration'
	,	'Account.Register.Model'
	,	'LoginRegister.Utils'
	,	'Tracker'
	,	'Profile.Model'
	,	'LiveOrder.Model'
    ,	'GlobalViews.Message.View'

	,	'Backbone.FormView'
	,	'Backbone'
	,	'underscore'
	,	'Utils'
	]
,	function (
		register_tpl

	,	Configuration
	,	AccountRegisterModel
	,	LoginRegisterUtils
	,	Tracker
	,	ProfileModel
	,	LiveOrderModel
    ,	GlobalViewsMessageView

	,	BackboneFormView
	,	Backbone
	,	_
	)
{
	'use strict';

	// @clasd LoginRegister.Register.View @extend Backbone.View
	return Backbone.View.extend({

		template: register_tpl

    ,   attributes: {
            'id': 'register'
        }

	,	events: {
			'submit form': 'saveForm'
		}

	,	bindings: {
			'[name="firstname"]': 'firstname'
		,	'[name="lastname"]': 'lastname'
		,	'[name="company"]': 'company'
		,	'[name="email"]': 'email'
		,	'[name="password"]': 'password'
		,	'[name="password2"]': 'password2'
		}

	,	initialize: function (options)
		{
			this.options = options;
			this.application = options.application;
			this.parentView = options.parentView;

			this.model = options.model || new AccountRegisterModel();
			// on save we redirect the user out of the registration page
			// as we know there hasn't been an error
			this.model.on('save', _.bind(this.redirect, this));

			BackboneFormView.add(this);
		}

		// @method trackEvent tracks the 'create-account' event using the global Tracker instance
		// @param {Function} callback
	,	trackEvent: function (callback)
		{
			Tracker.getInstance().trackEvent({
				category: 'create-account'
			,	action: 'click'
			,	value: 1
			,	callback: callback
			});
		}

		// @method redirect redirects the user after successful account registration taking into account redirect (origin and origin_hash) parameters.
		// @param {Object} response the http response data object result of calling the account-register service.
	,	redirect: function (context, response)
		{
			var url_options = _.parseUrlOptions(window.location.search)
			,	touchpoints = response.touchpoints
			,	application = this.application
                ,   self = this;


            if (url_options.is && url_options.is === 'checkout')
			{
				var profile_model = ProfileModel.getInstance();

				response.user && profile_model.set(response.user);
				response.cart && LiveOrderModel.getInstance().set(response.cart);
				response.address && profile_model.get('addresses').reset(response.address);
				response.creditcard && profile_model.get('creditcards').reset(response.creditcard);

				// Track Guest Checkout Event
				this.trackEvent(function ()
				{
					application.Configuration.currentTouchpoint = 'checkout';
					Backbone.history.navigate('', { trigger: true });
				});
			}
			else
			{
				// Track Login Event
				this.trackEvent(function ()
				{
					// if we know from which touchpoint the user is coming from
					if (url_options.origin && touchpoints[url_options.origin])
					{
						// we save the url to that touchpoint
						var url = touchpoints[url_options.origin];
						// if there is an specific hash
						if (url_options.origin_hash)
						{
							// we add it to the url as a fragment
							url = _.addParamsToUrl(url, {fragment: url_options.origin_hash});
						}

						window.location.href = url;
					}
					else
					{
                        //ss: pulled out messaging for now until we determine a reliable way to confirm if the account exists and is being auto logged in
                        var global_view_message = new GlobalViewsMessageView({
                            message: _.translate('You have already registered with LNCurtis.com. We\'re logging you in.')
                            ,	type: 'warning'
                            ,	closable: false
                        })
                        , el = self.$('.login-register-register-form [data-type="alert-placeholder"]');

                        //el.append(global_view_message.render().$el.html());
						//We've got to disable passwordProtectedSite and loginToSeePrices features if customer registration is disabled.
						if(Configuration.getRegistrationType() !== 'disabled' && SC.getSessionInfo('passwordProtectedSite'))
						{
							//setTimeout(function() {
                                window.location.href = touchpoints.home;
                            //}, 1500);
						}
						else
						{
                            // otherwise we need to take it to the customer center
                            // custom: handle acctredirect parameter
                            if (url_options.acctredirect) {
                                setTimeout(function() {
                                    window.location.href = touchpoints.customercenter + (url_options.acctredirect.indexOf('#') !== 0 ? "#" : "") + url_options.acctredirect;
                                }, 10);
                            }
                            else
                                //setTimeout(function() {
                                window.location.href = touchpoints.customercenter;
                            //}, 1500);

                        }
					}
				});
			}
		}

		// @method getContext @return {LoginRegister.Register.View.Context}
	,	getContext: function ()
		{
			var url_options = _.parseUrlOptions(window.location.search)
                , subscribeText = Configuration.get('newsletter.optInText', 'Please sign me up for Curtis offers, promotions and news');

			//@class LoginRegister.Register.View.Context
			return {
				// @property {Boolean} showCompanyField
				showCompanyField: SC.ENVIRONMENT.siteSettings.registration.showcompanyfield === 'T'
				// @property {Boolean} isCompanyFieldRequire
			,	isCompanyFieldRequire: SC.ENVIRONMENT.siteSettings.registration.companyfieldmandatory === 'T'
				// @property {Boolean} isEmailSubscribeChecked
			,	isEmailSubscribeChecked: this.options.isEmailSubscribeChecked
				// @property {String} siteName
			,	siteName: SC.ENVIRONMENT.siteSettings.displayname
				// @property {Boolean} showFormFieldsOnly
			,	showFormFieldsOnly: this.options.showFormFieldsOnly || false
				// @property {Boolean} isRedirect
			,	isRedirect: !!(url_options.is !== 'checkout' && url_options.origin !== 'checkout')
				// @property {Boolean} hasAutoFocus
			,	hasAutoFocus: url_options.is === 'register' && _.isDesktopDevice()
            ,   subscribeText: subscribeText
			};
		}
		// @class LoginRegister.Register.View

	});
});