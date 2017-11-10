/*
	© 2017 LN Curtis
*/

define(
	'Header.Menu.View.Extension'
	, [
		'Header.Menu.View'
		, 'LinkHierarchy.View'
		, 'Profile.Model'
		, 'SC.Configuration'
		
		, 'underscore'
	]
	
	, function (HeaderMenuView
		, LinkHierarchyView
		, ProfileModel
		, Configuration
		, _) {
		'use strict';

		_.extend(HeaderMenuView.prototype, {
			
			events: {
				'click [data-toggle="categories-menu"] > a': 'toggleMenu'
			, 	'click .header-menu-close-menu': 'closeMenuClick'
				/*
				,   'mouseenter [data-toggle="categories-menu"]': 'menuOpen'
				,   'mouseleave [data-toggle="categories-menu"]': 'menuClose'
				*/
			}
			
			, closeMenuClick: function (e) {
				e.preventDefault();
				
				jQuery(e.currentTarget).parents('[data-toggle="categories-menu"]').removeClass('open');
				
				return false;
			}
			
			, toggleMenu: function (e) {
				e.preventDefault();
				var $target = jQuery(e.currentTarget).parent('[data-toggle="categories-menu"]');
				
				if ($target.hasClass('open')) {
					$target.removeClass('open');
				}
				else {
					jQuery('[data-toggle="categories-menu"]').removeClass('open');
					$target.addClass('open');
				}
				
				return false;
			}
			
			, childViews: _.extend(HeaderMenuView.prototype.childViews, {
				
				'HelpLinks': function () {
					return new LinkHierarchyView({
						childViewOptions: {
							configurationObject: "header.helpLinks"
						}
					});
				}
			})
			
			, getContext: function () {

				var profile = ProfileModel.getInstance()
					, is_loading = !_.getPathFromObject(Configuration, 'performance.waitForUserProfile', true) && ProfileModel.getPromise().state() !== 'resolved'
					, is_loged_in = profile.get('isLoggedIn') === 'T' && profile.get('isGuest') === 'F'
					, environment = SC.ENVIRONMENT
					, show_languages = environment.availableHosts && environment.availableHosts.length > 1
					, show_currencies = environment.availableCurrencies && environment.availableCurrencies.length > 1 && !Configuration.get('header.notShowCurrencySelector');

				_.each(Configuration.navigationData, function (entry) {
					if (entry.dataTouchpoint !== undefined) {
						entry.data = entry.data || {};
						entry.data.touchpoint = entry.dataTouchpoint;
					}
					if (entry.dataHashtag !== undefined) {
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
					, showExtendedMenu: !is_loading && is_loged_in
					// @property {Boolean} showLanguages
					, showLanguages: show_languages
					// @property {Boolean} showCurrencies
					, showCurrencies: show_currencies
					
					, catalogsLink: Configuration.get("header.catalogsLink", "#")
					, agenciesLink: Configuration.get("header.agenciesLink", "#")
					
				};
			}
		})
	})