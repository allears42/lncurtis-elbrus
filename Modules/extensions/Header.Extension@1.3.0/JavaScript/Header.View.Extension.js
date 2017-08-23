/*
	© 2017 LN Curtis
*/

define(
    'Header.View.Extension'
    ,	[
        'Header.View'
	,	'Header.Logo.View'
	,	'LinkHierarchy.View'
	,	'SC.Configuration'

	,	'underscore'
    ]
    ,	function(
        HeaderView
	,	HeaderLogoView
	,	LinkHierarchyView
	,	Configuration

	, 	_
    )
    {
        'use strict';

        _.extend( HeaderView.prototype, {

        	verifyShowSiteSearch: function ()
            {
                /*
                var hash = Backbone.history.getFragment() || '';
                hash = hash.indexOf('?') === -1 ? hash : hash.substring(0, hash.indexOf('?'));
                var is_home = hash === '' || hash === '/';

                if (is_home)
				{
					this.showSiteSearch(null, true);
				}
				else
				{
					// This hide sitesearch when navigate
					this.hideSiteSearch();
				}
				*/

                if (_.getDeviceType() === 'phone'){
                    this.hideSiteSearch();
                }
            }

		,	childViews: _.extend( HeaderView.prototype.childViews,
			{
                'Header.Logo': function()
                {
                    // adding seoURL
                    this.options.seoURL = window.location.protocol + '//' + window.location.hostname;
                    return new HeaderLogoView(this.options);
                }

			,	'HelpLinks': function()
				{
					return new LinkHierarchyView({
						childViewOptions: {
							configurationObject: "header.helpLinks"
						}
					});
				}

			})

		,	getContext: _.wrap( HeaderView.prototype.getContext, function(fn)
			{
                var self = this
				,   returnVariable = fn.apply(self, _.toArray(arguments).slice(1));

                _.extend(returnVariable , {
						catalogsLink : Configuration.get("header.catalogsLink", "#")
					,   agenciesLink : Configuration.get("header.agenciesLink", "#")
					,   telephone : Configuration.get("header.telephone", "#")
					,   contactLink : Configuration.get("header.contactLink", "#")
					,   contactText : Configuration.get("header.contactText", "#")
					,   customerServiceHours : Configuration.get("header.customerServiceHours", "#")

            	});

                return returnVariable

        	})
    	});
    });
