/*
	© 2017 LN Curtis
*/

define(
    'ErrorManagement.Extension'
    ,	[
        'ErrorManagement.PageNotFound.View.Extension'
    ]
    ,	function(
        ErrorManagementPageNotFoundViewExtension
    )
    {
        'use strict';

        return {
            ErrorManagementPageNotFoundViewExtension: ErrorManagementPageNotFoundViewExtension
        }

    });
