/*
 © 2017 JHM Services Inc.
 User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
 provided, however, if you are an authorized user with a NetSuite account or log-in, you
 may use this code subject to the terms that govern your access and use.
 */

//@module LinkHierarchy
define(
    'LinkHierarchy.Router'
    ,	[
        'LinkHierarchy.CMSPage.View'
        ,	'SC.Configuration'
        ,	'Backbone'
        ,   'underscore'
    ]
    ,	function (
            LinkHierarchyCMSPageView
        ,	Configuration
        ,	Backbone
        ,  _
    )
    {
        'use strict';

        // @lass LinkHierarchy.Router @extends Backbone.Router
        return Backbone.Router.extend({
            initialize: function (Application)
            {
                this.application = Application;

                var self = this
                , customRoutes = Configuration.get("linkHierarchy.links",[])
                , excluded = Configuration.get("linkHierarchy.excludeModules", "");

                if (customRoutes){
                    this.routes = {};
                    _.each(customRoutes, function (customRoute) {
                        // if there is a link and there is a menu on page set, take the route and send it through our module
                        var routePath = customRoute.href && customRoute.href.replace("/", "") || ''
                        , normalizedRoute = customRoute.menuOnPage && customRoute.menuOnPage.replace("-", "") || '';
                        if (routePath.length > 0 && normalizedRoute.length > 0 && excluded.indexOf(routePath) < 0)
                        {
                            self.routes[routePath] = normalizedRoute;
                            self.route(routePath, normalizedRoute);
                            self.route(customRoute.href, normalizedRoute);
                        }
                    });
                }
            }

            // NOTE: rouges need to match with the enum for the Configuration value for menuOnPage

            // @method helpcenter page dispatch the 'go to helpcenter page' route
            ,	helpcenter: function ()
            {
                //console.log('helpcenter');
                var application = this.application;

                var view = new LinkHierarchyCMSPageView({
                    'application': application
                    , 'menuTag': 'help-center'

                });
                view.showContent();

            }

            // @method customerservice page dispatch the 'go to customerservice page' route
            ,	customerservice: function ()
                {
                    //console.log('customerservice');
                    var application = this.application;

                    var view = new LinkHierarchyCMSPageView({
                        'application': application
                        , 'menuTag': 'customer-service'

                    });
                    view.showContent();
                }

            // @method government page dispatch the 'go to government page' route
            ,	government: function ()
                {
                    //console.log('government');
                    var application = this.application;

                    var view = new LinkHierarchyCMSPageView({
                        'application': application
                        , 'menuTag': 'government'

                    });
                    view.showContent();
                }

            // @method curtiscare page dispatch the 'go to government page' route
            ,	curtiscare: function ()
                {
                    //console.log('curtis-care');
                    var application = this.application;

                    var view = new LinkHierarchyCMSPageView({
                        'application': application
                        , 'menuTag': 'curtis-care'

                    });
                    view.showContent();
                }
        });
    });