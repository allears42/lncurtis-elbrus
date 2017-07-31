/*
 © 2016 NetSuite Inc.
 User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
 provided, however, if you are an authorized user with a NetSuite account or log-in, you
 may use this code subject to the terms that govern your access and use.
 */

// @module Header
define(
    'LinkHierarchy.CMSPage.View'
    , [
            'LinkHierarchy.View'
        ,   'cms_page_left_menu.tpl'
        ,   'link_menu.tpl'
        ,   'link_menu_pushable.tpl'
        ,	'SC.Configuration'

        ,	'Backbone'
        ,	'Backbone.CompositeView'
        ,	'underscore'
        ,	'jQuery'
        ,	'Utils'
    ]
    ,	function(

        LinkHierarchyView
        ,	cms_page_left_menu_tpl
        ,	menu_tpl
        ,	menu_pushable_tpl
        ,	Configuration

        ,	Backbone
        ,	BackboneCompositeView
        ,	_
        ,	jQuery
        ,   Utils

    )
    {
        'use strict';

        //@class LinkHierarchy.CMSPage.View @extends Backbone.View
        return Backbone.View.extend({

            template: cms_page_left_menu_tpl

            ,	initialize: function (options)
            {

                this.menuTag = options.menuTag;
                this.sideMenuLinks = Configuration.get("linkHierarchy.links",[]);
                var self = this;
                this.thisMenu = _.filter(self.sideMenuLinks, function (link) {
                    return link.menuOwner.indexOf(self.menuTag) > -1;
                });
                BackboneCompositeView.add(this);

            }

            // @method getBreadcrumbPages
            ,	getBreadcrumbPages: function ()
            {
                var self = this;
                var currentPage = Backbone.history.getFragment()
                , currentPageLinkObj = _.filter(self.sideMenuLinks, function (menuLink) {
                    return menuLink.href.replace("/", "") == currentPage;
                })
                , breadcrumb = [];

                if(currentPageLinkObj){
                    breadcrumb.push({href: currentPageLinkObj[0].href, text: currentPageLinkObj[0].text})
                }
                return breadcrumb;
            }

            ,   childViews : {
                'SideNavigation': function()
                {
                    var self = this;

                    return new LinkHierarchyView({
                        childViewOptions: {
                            linkData: self.thisMenu
                            , custom_template: menu_tpl
                        }
                    });
                }
            }
            // @method getContext @return {Header.Sidebar.View.Context}
            ,	getContext: function()
            {
                // @class Header.Sidebar.View.Context
                return {
                    isPushable: Utils.getViewportWidth() < 992
                };
            }
        });

    });
