/*
	© 2017 LN Curtis
*/

define(
	'Profile.Extension'
,	[
		'Profile.EmailPreferences.View.Extension'
	,	'Profile.Information.View.Extension'

	]
,	function(
        ProfileEmailPreferencesViewExtension
	,	ProfileInformationViewExtension
	)
{
	'use strict';
	
	return {
        ProfileEmailPreferencesViewExtension: ProfileEmailPreferencesViewExtension
	,	ProfileInformationViewExtension: ProfileInformationViewExtension
	}

});
