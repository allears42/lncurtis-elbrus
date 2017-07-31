/*
 © 2016 JHM Services Inc.
 User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
 provided, however, if you are an authorized user with a NetSuite account or log-in, you
 may use this code subject to the terms that govern your access and use.
 */

//@module FacetContent
define(
    'FacetContent.Router'
    ,	[
        'FacetContent.View'
    ,    'FacetContent.Model'

    ,	'Backbone'
    ]
    ,	function (
        FacetContentView
        ,   FacetContentModel
        ,	Backbone
    )
    {
        'use strict';

        // @lass FacetContent.Router @extends Backbone.Router
        return Backbone.Router.extend({

            routes: {
                'brands': 'brandsPage'
            }

            ,	initialize: function (Application)
            {
                this.application = Application;
            }

            // @method NewsletterPage dispatch the 'go to Newsletter page' route
            ,	brandsPage: function ()
            {
                var application = this.application
                ,   model = new FacetContentModel();

                model.fetch({
                    data: {},
                    reset: true,
                    killerId: application.killerId,
                    success: function (data)
                    {
                        var view = new FacetContentView({
                            'model': model
                        ,	'application': application
                        ,   'data': data
                        ,   'facet': "custitem_facets_brand"

                        });
                        
                        view.showContent();
                    }
                });

            }
        });
    });