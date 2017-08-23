/*
	© 2017 LN Curtis
*/

define(
    'LoginRegister.Register.View.Extension'
    ,	[
        'LoginRegister.Register.View'
	,	'LiveOrder.Model'
	,	'Profile.Model'
	,	'GlobalViews.Message.View'
	,	'SC.Configuration'

	,	'underscore'

    ]
    ,	function(
        LoginRegisterRegisterView
	,	LiveOrderModel
	, 	ProfileModel
	,	GlobalViewsMessageView
	,	Configuration

	, 	_

    )
    {
        'use strict';

        _.extend( LoginRegisterRegisterView.prototype, {

            redirect: function (context, response)
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
                            ,   el = self.$('.login-register-register-form [data-type="alert-placeholder"]');

                            //el.append(global_view_message.render().$el.html());
                            //We've got to disable passwordProtectedSite and loginToSeePrices features if customer registration is disabled.
                            if(Configuration.getRegistrationType() !== 'disabled' && SC.ENVIRONMENT.siteSettings.siteloginrequired==='T')
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

		,	getContext: _.wrap( LoginRegisterRegisterView.prototype.getContext, function(fn)
            {
                var self = this
                ,   returnVariable = fn.apply(self, _.toArray(arguments).slice(1))
                , 	subscribeText = Configuration.get('newsletter.optInText', 'Please sign me up for Curtis offers, promotions and news');

                _.extend(returnVariable , {
                    subscribeText: subscribeText
                });

                return returnVariable
            })

        });

    });
