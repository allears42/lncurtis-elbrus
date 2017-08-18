/*
	© 2017 LN Curtis
*/

define(
    'LoginRegister.Login.View.Extension'
    ,	[
        'LoginRegister.Login.View'

        ,	'underscore'

    ]
    ,	function(
        LoginRegisterLoginView

        , 	_

    )
    {
        'use strict';

        _.extend( LoginRegisterLoginView.prototype, {

            render: function ()
            {
                Backbone.View.prototype.render.apply(this, arguments);
                if (this.$containerModal && this.application.getConfig('checkoutApp.skipLogin'))
                {
                    this.$('[data-type="form-login-action"]').append('<br/><br/><br/><div class="pull-left">'+_('Want to create an Account first?').translate()+
                        '<a class="login-register-login-register-now" href="register" data-toggle="show-in-modal" data-type="register-now">'+_('Register Now').translate()+'</a></div>');
                    this.$('[data-action="forgot-password"]').attr('data-toggle', 'show-in-modal');
                }
            }

		,	redirect: function (context, response)
            {
                var url_options = _.parseUrlOptions(window.location.search)
                    ,	touchpoints = response.touchpoints
                    ,	isPasswordReset = url_options.passwdret
                    ,	self = this;

                // Track Login Event
                this.trackEvent(function ()
                {
                    // custom - parse for a redirect param and use that on success
                    // used for viewing order in account
                    // ex url : https://checkout.sandbox.netsuite.com/c.3880230/lncurtis-dev-vinson/checkout-local.ssp?is=login&login=T&n=2&lang=en_US&redirect=purchases/view/salesorder/1213320#login-register
                    if (url_options.acctredirect) {
                        window.location.href = touchpoints.customercenter + (url_options.acctredirect.indexOf('#') !== 0 ? "#" : "") + url_options.acctredirect;
                    }

                    else if (!isPasswordReset && (url_options.is === 'checkout' || url_options.origin === 'checkout'))
                    {
                        self.refreshApplication(response);
                    }
                    else
                    {
                        // if we know from which touchpoint the user is coming from
                        if (url_options.origin && touchpoints[url_options.origin])
                        {
                            // we save the URL to that touchpoint
                            var url = touchpoints[url_options.origin];
                            // if there is an specific hash
                            if (url_options.origin_hash)
                            {
                                // we add it to the URL as a fragment
                                url = _.addParamsToUrl(url, {fragment: url_options.origin_hash});
                            }

                            window.location.href = url;
                        }
                        else
                        {
                            //We've got to disable passwordProtectedSite and loginToSeePrices features if customer registration is disabled.
                            if(Configuration.getRegistrationType() !== 'disabled' && SC.getSessionInfo('passwordProtectedSite'))
                            {
                                window.location.href = touchpoints.home;
                            }
                            else
                            {
                                // otherwise we need to take it to the customer center
                                window.location.href = touchpoints.customercenter;
                            }
                        }
                    }
                });
            }

		,	getContext: _.wrap( LoginRegisterLoginView.prototype.getContext, function(fn)
            {
                var self = this
				,   returnVariable = fn.apply(self, _.toArray(arguments).slice(1))
				,	url_options = _.parseUrlOptions(window.location.search);

                _.extend(returnVariable , {
                    isRedirect: !!(url_options.is !== 'checkout' && url_options.origin !== 'checkout')
                });

                return returnVariable
            })

        });

    });
