/*
	© 2017 LN Curtis
*/

define(
    'NavigationHelper.Extension'
    ,	[
        'NavigationHelper.Plugins.Standard.Extension'
    ]
    ,	function(
        NavigationHelperPluginsStandardExtension
    )
    {
        'use strict';

        return {
            NavigationHelperPluginsStandardExtension: NavigationHelperPluginsStandardExtension
        }

    });
