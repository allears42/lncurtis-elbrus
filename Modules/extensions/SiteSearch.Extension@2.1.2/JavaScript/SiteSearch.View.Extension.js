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
            
            events: _.extend({}, SiteSearchView.prototype.events, {
                'blur .twitter-typeahead': 'resetHandle'
            })

        ,   hideSiteSearch: function (ev)
            {
                ev && ev.preventDefault();
                jQuery('[data-type="SiteSearch"]').slideUp();
                jQuery('[data-action="show-sitesearch"]').toggleClass('active');
                this.showSiteSearch()
            }

        ,	resetHandle: function ()
            {
                this.$('[data-type="search-reset"]').hide();
                this.itemsSearcherComponent.cleanSearch(true);
            }

        });
    });
