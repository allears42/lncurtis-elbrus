/*
	© 2017 LN Curtis
	Custom extension logic for...
*/

define(
	'Facets.Browse.View.Extension'
	, [
		'Facets.Browse.View'
		
		, 'Facets.FacetedNavigation.View'
		, 'LiveOrder.Model'
		, 'GlobalViews.Message.View'
		, 'SC.Configuration'
		, 'Tracker'
		, 'jQuery'
		, 'underscore'
	]
	, function (FacetsBrowseView
		, FacetsFacetedNavigationView
		, LiveOrderModel
		, GlobalViewsMessageView
		, Configuration
		, Tracker
		, jQuery
		, _) {
		'use strict';
		
		_.extend(FacetsBrowseView.prototype, {
			
			events: _.extend({}, FacetsBrowseView.prototype.events, {
				'contextmenu img': 'preventContextMenu'
			})
			
			// custom function to prevent people trying to save images
			, preventContextMenu: function (e) {
				e.preventDefault();
				console.error('You\'re attempting to access an image that is copyrighted by LNCurtis.com');
				return false;
			}
			
			// this overrides our settings in configuration so override the function to ignore
			, setOptionsTranslator: function (translator) {
				/*if (translator.options.display === 'grid' && _.isPhoneDevice())
				{
					translator.options.display = 'table';
				}*/
				return translator;
			}
			
			// custom function to get facets ordered by priority
			, getOrderedFacets: function (facets_to_show) {
				var self = this
					, ordered_facets = facets_to_show && facets_to_show.sort(function (a, b) {
					// Default Priority is 0
					return (self.translator.getFacetConfig(a.url || a.id).priority || 0) - (self.translator.getFacetConfig(b.url || b.id).priority || 0);
				});
				
				ordered_facets = _.filter(ordered_facets, function (facet) {
					var validURLS = _.filter(facet.values, function (facetValue) {
							
							return facetValue.url && facetValue.url.length > 0
						}
					);
					return validURLS.length > 1;
				});
				
				return ordered_facets;
			}
			
			, childViews: _.extend(FacetsBrowseView.prototype.childViews, {
				'Facets.FacetedNavigation': function (options) {
					var self = this
					, exclude = _.map((options.excludeFacets || '').split(','), function (facet_id_to_exclude) {
						return jQuery.trim(facet_id_to_exclude);
					})
					// add custom exclude
					, customExcludeConfig = Configuration.get('excludedFacets', '')
					, customExclude = _.map((customExcludeConfig).split(','), function (facet_id_to_exclude) {
						return jQuery.trim(facet_id_to_exclude);
					})
					//
					, has_categories = !!(this.category && this.category.categories)
					, has_items = this.model.get('items').length
					, has_facets = has_items && this.model.get('facets').length
					, applied_facets = this.translator.cloneWithoutFacetId('category').facets
					, has_applied_facets = applied_facets.length
					// custom properties
					, is_category = !!this.model.get('category')
					, facets_to_show = _.filter(this.model.get('facets'), function (facet) {
						return !_.contains(exclude, facet.id) && !_.contains(customExclude, facet.id);
					})
					// order the facets
					, ordered_facets = self.getOrderedFacets(facets_to_show);
					
					// limit number facets shown to four to not break SEOPageGenerator (haha)
					if (is_category && !has_applied_facets && Utils.isPageGenerator()) {
						if (this.model.get('category').get('parenturl').length < 1) facets_to_show = ordered_facets.slice(0, 4);
					}
					
					return new FacetsFacetedNavigationView({
						categoryItemId: this.category && this.category.itemid
						, clearAllFacetsLink: this.translator.cloneWithoutFacets().getUrl()
						, hasCategories: has_categories
						, hasItems: has_items
						
						// facets box is removed if don't find items
						, hasFacets: has_facets
						
						, hasCategoriesAndFacets: has_categories && has_facets
						
						// Categories are not a real facet, so lets remove those
						, appliedFacets: applied_facets
						
						, hasFacetsOrAppliedFacets: has_facets || has_applied_facets
						
						//,	translatorUrl: this.translator.getUrl()
						, translator: this.translator
						
						//,	translatorConfig: this.options.translatorConfig
						// pass filtered ordered facets
						, facets: facets_to_show
						
						, totalProducts: this.model.get('total')
						, keywords: this.translator.getOptionValue('keywords')
						
						//  custom: pass all facets regardless of exclude so that we can use them to populate a category menu on non-category pages
						, allFacets: this.model.get('facets')
						, isCategory: is_category
						, category: this.model.get('category')
					});
				}
			})
			
		});
		
	});
