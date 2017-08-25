/*
	© 2017 LN Curtis
*/

define(
    'SiteSearch.View.Extension'
    ,	[
        'SiteSearch.View'

        ,	'underscore'
    ]
    ,	function(
        SiteSearchView

        ,	_
    )
    {
        'use strict';

        _.extend( SiteSearchView.prototype, {

            hideSiteSearch: function (ev)
            {
                ev && ev.preventDefault();
                jQuery('[data-type="SiteSearch"]').slideUp();
                jQuery('[data-action="show-sitesearch"]').toggleClass('active');
                this.showSiteSearch()
            }

        });
    });
