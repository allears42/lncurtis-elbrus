/*
    © 2017 Satellite Commerce
    Implment display_in_site filtering
 */

//@module Session.Extension
define(
	'Session.Extension'
,	[
        'Session'
    ,   'underscore'
	]
,	function (
        Session
    ,   _
	)
{
	'use strict';

	if (!Session._getSearchApiParams) {
	    Session._getSearchApiParams = Session.getSearchApiParams;
        Session.getSearchApiParams = _.wrap(Session._getSearchApiParams, function (fn)
        {
            var returnVariable = fn.apply(this, _.toArray(arguments).slice(1));

            // Add custitem_display_in_site facet to options based on current site
            var siteid = SC && SC.ENVIRONMENT && SC.ENVIRONMENT.siteSettings && SC.ENVIRONMENT.siteSettings.siteid || '';

            if (siteid === 2) {
                _.extend(returnVariable, { 'custitem_display_in_site': 'LNCurtis.com'});
            }
            else if (siteid === 3) {
                _.extend(returnVariable, { 'custitem_display_in_site': 'CurtisBlueLine.com' });
            }

            return returnVariable;
        });
    }
});