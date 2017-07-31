/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// MenuFromFacet.js
// -------------
// Utility Class to handle the Categories tree
define('FacetContent'
,	[
        'FacetContent.Router'
    ,   'SC.Configuration'
	,	'underscore'
	]
,	function (
        FacetContentRouter
    ,   Configuration
	,	_
	)
{
	'use strict';

	return {

    mountToApp: function (application) {
        return new FacetContentRouter(application);
        }
	};
});
