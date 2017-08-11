/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Header
define(
	'Header.Menu.View'
, [
		'Profile.Model'
	,	'SC.Configuration'
	,	'Header.Profile.View'
	,	'Header.Menu.MyAccount.View'
	,	'GlobalViews.HostSelector.View'
	,	'GlobalViews.CurrencySelector.View'
    ,   'LinkHierarchy.View'

	,	'header_menu.tpl'

	,	'Backbone'
	,	'Backbone.CompositeView'
	,	'underscore'
	,	'jQuery'
	,	'jQuery.sidebarMenu'
	]
,	function(
		ProfileModel
	,	Configuration
	,	HeaderProfileView
	,	HeaderMenuMyAccountView
	,	GlobalViewsHostSelectorView
	,	GlobalViewsCurrencySelectorView
    ,   LinkHierarchyView

	,	header_menu

	,	Backbone
	,	BackboneCompositeView
	,	_
	,	jQuery

	)
{
	'use strict';

	//@class Header.Menu.View @extends Backbone.View
	return Backbone.View.extend({

		template: header_menu

	,	events: {
			/*'mouseenter [data-toggle="categories-menu"]': 'menuOpen'
		,	'mouseleave [data-toggle="categories-menu"]': 'menuClose'
		,	*/'click [data-toggle="categories-menu"] > a': 'toggleMenu'
		,	'click .header-menu-close-menu': 'closeMenuClick'
		}

	,	menuOpen: function(e)
		{
			jQuery(e.currentTarget).addClass('open');
		}

	,	menuClose: function(e)
		{
			jQuery(e.currentTarget).removeClass('open');
		}

    ,   closeMenuClick: function (e) {
            e.preventDefault();

            jQuery(e.currentTarget).parents('[data-toggle="categories-menu"]').removeClass('open');

            return false;
        }

    ,   toggleMenu: function (e) {
            e.preventDefault();
            var $target = jQuery(e.currentTarget).parent('[data-toggle="categories-menu"]');

            if($target.hasClass('open')){
                $target.removeClass('open');
            }
            else {
                jQuery('[data-toggle="categories-menu"]').removeClass('open');
                $target.addClass('open');
            }

            return false;
        }
	,	initialize: function ()
		{
			var self = this;
			BackboneCompositeView.add(this);

			this.options.application.on('Configuration.navigationData', this.render, this);

			ProfileModel.getPromise().done(function ()
			{
				self.render();
			});
		}

	,	childViews: {
			'Header.Profile': function ()
			{
				return new HeaderProfileView({
					showMyAccountMenu: false
				,	application: this.options.application
				});
			}
		,	'Header.Menu.MyAccount': function ()
			{
				return new HeaderMenuMyAccountView(this.options);
			}
		,	'Global.HostSelector': function ()
			{
				return new GlobalViewsHostSelectorView();
			}
		,	'Global.CurrencySelector': function ()
			{
				return new GlobalViewsCurrencySelectorView();
			}
        ,	'HelpLinks': function()
            {
                return new LinkHierarchyView({
                    childViewOptions: {
                        configurationObject: "header.helpLinks"
                    }
                });
            }
		}

	,	render: function()
		{
			Backbone.View.prototype.render.apply(this, arguments);
			this.$('[data-type="header-sidebar-menu"]').sidebarMenu();
		}

		// @method getContext @return {Header.Sidebar.View.Context}
	,	getContext: function()
		{
			var profile = ProfileModel.getInstance()
			,	is_loading = !_.getPathFromObject(Configuration, 'performance.waitForUserProfile', true) && ProfileModel.getPromise().state() !== 'resolved'
			,	is_loged_in = profile.get('isLoggedIn') === 'T' && profile.get('isGuest') === 'F'
			,	environment = SC.ENVIRONMENT
			,	show_languages = environment.availableHosts && environment.availableHosts.length > 1
			,	show_currencies = environment.availableCurrencies && environment.availableCurrencies.length > 1 && !Configuration.get('header.notShowCurrencySelector');

			_.each(Configuration.navigationData, function(entry)
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

                if (entry.href && entry.href !== "#" && entry.href.length > 1) {
                    if (document.location.hash.indexOf(entry.data.hashtag.replace("/", "")) > -1
                        || document.location.hash.indexOf(entry.data.hashtag) > -1
                        || document.location.pathname.indexOf(entry.href) > -1) {
                            entry.isActiveLink = true;
                    }
                }
			});

			// @class Header.Sidebar.View.Context
			return {
				// @property {Array<NavigationData>} navigationItems
				categories: Configuration.navigationData || []
				// @property {Boolean} showExtendedMenu
			,	showExtendedMenu: !is_loading && is_loged_in
				// @property {Boolean} showLanguages
			,	showLanguages: show_languages
				// @property {Boolean} showCurrencies
			,	showCurrencies: show_currencies
            
            ,   catalogsLink : Configuration.get("header.catalogsLink", "#")
            ,   agenciesLink : Configuration.get("header.agenciesLink", "#")

			};
		}
	});

});
