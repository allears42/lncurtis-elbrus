/*
 © 2016 NetSuite Inc.
 User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
 provided, however, if you are an authorized user with a NetSuite account or log-in, you
 may use this code subject to the terms that govern your access and use.
 */

// @module Header
define(
    'LinkHierarchy.Images.View'
    , [
            'link_image_list.tpl'
        ,	'SC.Configuration'

        ,	'Backbone'
        ,	'Backbone.CompositeView'
        ,	'underscore'
        ,	'jQuery'
    ]
    ,	function(

        	header_menu
        ,	Configuration

        ,	Backbone
        ,	BackboneCompositeView
        ,	_
        ,	jQuery

    )
    {
        'use strict';

        //@class LinkHierarchy.Images.View @extends Backbone.View
        return Backbone.View.extend({

            template: header_menu

            ,	initialize: function (options)
            {
                this.configurationObject = options.childViewOptions.configurationObject;
                this.headerText = options.childViewOptions.headerText;
                var self = this;
                BackboneCompositeView.add(this);
            }

            // @method getContext @return {Header.Sidebar.View.Context}
            ,	getContext: function()
            {
                var self = this
                , linkData = Configuration.get(self.configurationObject, []);

                _.sortBy(linkData, function (entry) {
                    return parseInt(entry.sortOrder) || 1000
                });
                // navigation hierarchy bindings.
                _.each(linkData, function (entry)
                {
                    if (!entry) {
                        return;
                    }

                    entry.imageURL = _.getAbsoluteUrl(entry.imageURL);
                    if (entry.classnames)
                    {
                        entry.class += ' ' + entry.classnames;
                    }

                    //todo: map URL to absolute URL?

                });


                // @class Header.Sidebar.View.Context
                return {
                    // @property {Array<NavigationData>} navigationItems
                    categories: linkData || []
                    , showHeaderText: this.headerText && this.headerText.length > 0
                    , headerText: this.headerText
                };
            }
        });

    });
