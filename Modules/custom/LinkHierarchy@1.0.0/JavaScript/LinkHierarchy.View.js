/*
 © 2016 NetSuite Inc.
 User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
 provided, however, if you are an authorized user with a NetSuite account or log-in, you
 may use this code subject to the terms that govern your access and use.
 */

// @module Header
define(
    'LinkHierarchy.View'
    , [
            'link_menu_flyout.tpl'
        ,   'link_menu_pushable.tpl'
        ,	'SC.Configuration'

        ,	'Backbone'
        ,	'Backbone.CompositeView'
        ,	'underscore'
        ,	'jQuery'
        ,	'Utils'
    ]
    ,	function(

        	menu_tpl
        ,	menu_pushable
        ,	Configuration

        ,	Backbone
        ,	BackboneCompositeView
        ,	_
        ,	jQuery
        ,   Utils

    )
    {
        'use strict';

        //@class LinkHierarchy.View @extends Backbone.View
        return Backbone.View.extend({

            template: menu_tpl

            ,	events: {
                'mouseenter [data-toggle="categories-menu"]': 'menuOpen'
                ,	'mouseleave [data-toggle="categories-menu"]': 'menuClose'
                ,	'click [data-toggle="categories-menu"]': 'menuClose'
            }

            ,	menuOpen: function(e)
            {
                jQuery(e.currentTarget).addClass('open');
            }

            ,	menuClose: function(e)
            {
                jQuery(e.currentTarget).removeClass('open');
            }

            ,	initialize: function (options)
            {
                this.headerText = options.childViewOptions.headerText;

                if (options.childViewOptions.linkData) this.linkData = options.childViewOptions.linkData;
                else if (options.childViewOptions.configurationObject) {
                    this.configurationObject = options.childViewOptions.configurationObject;
                    this.linkData = Configuration.get(this.configurationObject, [])
                }

                if (options.childViewOptions && !!options.childViewOptions.pushable){
                    this.template = menu_pushable
                }

                if (options.childViewOptions && options.childViewOptions.custom_template){
                    this.template = options.childViewOptions.custom_template
                }

                BackboneCompositeView.add(this);
            }
            ,   sortLinks: function (linkData) {


                // navigation hierarchy bindings.
                _.each(linkData, function (entry)
                {
                    if (!entry) {
                        return;
                    }
                    else
                    {
                        if(entry.placeholder)
                        {
                            entry.text = '';
                        }
                        entry.class = 'cust-menu-level' + entry.level + '-anchor';
                    }
                    if (entry.parentId)
                    {
                        var parent = _.find(linkData, function (e)
                        {
                            return e.id===entry.parentId;
                        });
                        parent = parent || {};
                        parent.categories = parent.categories || [];
                        if (parent.categories.indexOf(entry) < 0) parent.categories.push(entry);
                    }
                    if (entry.classnames)
                    {
                        entry.class += ' ' + entry.classnames;
                    }
                });

                // Now, remove  non top level nav entries from the array (root nodes)
                // heads up ! we have to re-iterate :( this is the correct way of deleting and iterating an array - not _.each()
                for (var i = 0; i < linkData.length; i++)
                {
                    var entry = linkData[i];
                    if (!entry || entry.level > 1)
                    {
                        linkData.splice(i, 1);
                        i--;
                    }
                }

                linkData = _.sortBy(linkData, function (entry) {

                    return parseInt(entry.sortOrder) || 1000
                });


                _.each(linkData, function(entry)
                {
                    if (entry.dataTouchpoint !== undefined)
                    {
                        entry.data = entry.data || {};
                        entry.data.touchpoint = entry.dataTouchpoint;
                    }
                    if (entry.dataHashtag !== undefined)
                    {
                        entry.data = entry.data || {};
                        entry.data.hashtag = entry.dataHashtag;
                    }
                });

                return linkData;
            }
            // @method getContext @return {Header.Sidebar.View.Context}
            ,	getContext: function()
            {
                var self = this
                ,   linkData = self.linkData ? self.sortLinks(self.linkData) : [];

                // @class Header.Sidebar.View.Context
                return {
                    // @property {Array<NavigationData>} navigationItems
                    categories: linkData || []
                    , showHeaderText: self.headerText && self.headerText.length > 0
                    , headerText: self.headerText
                    , isPushable: Utils.getViewportWidth() < 992
                };
            }
        });

    });
