/*
	© 2017 LN Curtis
*/

define(
    'Profile.EmailPreferences.View.Extension'
    ,	[
        'Profile.EmailPreferences.View'
    ,   'GlobalViews.Message.View'

    ,   'underscore'
    ]
    ,	function(
        ProfileEmailPreferencesView
    ,   GlobalViewsMessageView

    ,   _
    )
    {
        'use strict';

        _.extend( ProfileEmailPreferencesView.prototype, {

            showSuccess: function ()
            {
                if (this.$savingForm)
                {
                    this.showContent();
                    var global_view_message = new GlobalViewsMessageView({
                        message: _('Email Preferences successfully saved.').translate()
                        ,	type: 'success'
                        ,	closable: true
                    });

                    this.$('[data-type="alert-placeholder"]').append(global_view_message.render().$el.html());
                }
            }

        ,   getContext: _.wrap( ProfileEmailPreferencesView.prototype.getContext, function(fn)
            {
                var returnVariable = fn.apply(this, _.toArray(arguments).slice(1))
                ,   subscribeText = Configuration.get('newsletter.optInText', 'Please sign me up for Curtis offers, promotions and news');

                _.extend( returnVariable,
                {
                	campaignSubscriptions: false // !!(Configuration.get('siteSettings.campaignsubscriptions') && campaign_subscriptions.length)
                ,   subscribeText: subscribeText
                });

                return returnVariable

            })

        })

    });
