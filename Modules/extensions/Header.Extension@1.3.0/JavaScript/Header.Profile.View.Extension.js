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
                    // @property {Boolean} showLoadingMenu
                    ,	showLoadingMenu: is_loading
                    // @property {Boolean} showMyAccountMenu
                    ,	showMyAccountMenu: !!this.options.showMyAccountMenu
                    // @property {String} displayName
                    ,	displayName: profile.get('firstname') || profile.get('companyname')
                    // @property {Boolean} showLogin
                    ,	showLogin: Configuration.getRegistrationType() !== 'disabled'
                    // @property {Boolean} showRegister
                    ,	showRegister: Configuration.getRegistrationType() === 'optional' || Configuration.getRegistrationType() === 'required'
                };
            }

        });

    });
