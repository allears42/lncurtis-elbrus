/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module FacetContent
define(
	'FacetContent.Model'
,	[
        'Backbone.CachedModel'
    ,	'Session'
    ,	'Profile.Model'
    ,	'underscore'
	,	'Utils'
	]
,	function (
    BackboneCachedModel
    ,   Session
    ,	ProfileModel
    ,	_
	,	Utils
	)
{
	'use strict';

	// @class FacetContent.Model Validate and send user input data to the facet service
	// @extend Backbone.Model
	return BackboneCachedModel.extend({

		// @property {String} urlRoot
		urlRoot: function()
        {
            var profile = ProfileModel.getInstance()
            ,	url = _.addParamsToUrl(
                profile.getSearchApiUrl()
                ,	_.extend(
                    {}
                    ,	this.searchApiMasterOptions
                    ,	Session.getSearchApiParams()
                )
                ,	profile.isAvoidingDoubleRedirect()
            );

            url = url + "&limit=0&include=facets";
            return url;
        }
	});
});