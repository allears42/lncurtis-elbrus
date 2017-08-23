/*
	© 2017 LN Curtis
*/

define(
    'Header.Profile.View.Extension'
    ,	[
        'Header.Profile.View'
	,	'Profile.Model'

	,	'underscore'

    ]
    ,	function(
        HeaderProfileView
	,	ProfileModel

	, 	_

    )
    {
        'use strict';

        _.extend( HeaderProfileView.prototype, {

            getContext: function()
            {
                var profile = ProfileModel.getInstance()
				,	is_loading = !_.getPathFromObject(Configuration, 'performance.waitForUserProfile', true) && ProfileModel.getPromise().state() !== 'resolved'
				,	is_loged_in = (profile.get('isLoggedIn') === 'T' /*|| profile.get('isRecognized') === 'T'*/) && profile.get('isGuest') === 'F';

                // @class Header.Profile.View.Context
                return {
                    // @property {Boolean} showExtendedMenu
                    showExtendedMenu: !is_loading && is_loged_in
                    // @property {Boolean} showLoginMenu
                    ,	showLoginMenu: !is_loading && !is_loged_in
                };
            }

        });

    });
