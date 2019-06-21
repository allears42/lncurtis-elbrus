/*
	© 2017 LN Curtis
*/

define(
	'Facets.FacetedNavigation.View.Extension'
,	[
		'Facets.FacetedNavigation.View'
    ,   'Facets.FacetedNavigationItem.View'
    ,   'Facets.FacetedNavigationItemCategory.View'
    ,   'Profile.Model'
    ,   'Backbone'
    ,   'Backbone.CollectionView'
    ,   'Backbone.CompositeView'

	,	'SC.Configuration'
	,	'underscore'
	]
,	function(
        FacetsFacetedNavigationView
    ,   FacetsFacetedNavigationItemView
    ,   FacetsFacetedNavigationItemCategoryView
    ,   ProfileModel
	,   Backbone
	,   BackboneCollectionView
    ,   BackboneCompositeView

	, 	Configuration

	, 	_
	)
{
	'use strict';
	
	_.extend( FacetsFacetedNavigationView.prototype, {

        initialize: _.wrap(FacetsFacetedNavigationView.prototype.initialize, function(fn)
        {
            fn.apply(this, _.toArray(arguments).slice(1));

            var options = _.toArray(arguments)[1];

            this.isCategory = options.isCategory;
            this.category = options.category;
            this.translator = options.translator;
            this.allFacets = options.allFacets;
        })

    ,	childViews: _.extend({}, FacetsFacetedNavigationView.prototype.childView,
        {
            'Facets.FacetedNavigationItems': function ()
            {
                var translator = this.options.translator //FacetsHelper.parseUrl(this.options.translatorUrl, this.options.translatorConfig, this.options.translator.categoryUrl)
                    , ordered_facets = this.options.facets && this.options.facets.sort(function (a, b) {
                    // Default Priority is 0
                    return (translator.getFacetConfig(a.url || a.id).priority || 0) - (translator.getFacetConfig(b.url || b.id).priority || 0);
                });

                // remove any facets with only one value
                ordered_facets = _.filter(ordered_facets, function (facet) {

                    var validURLS = _.filter(facet.values, function (facetValue) {

                            return facetValue.url && facetValue.url.length > 0
                        }
                    );

                    return validURLS.length > 1 || facet.id === 'custitem_jhm_webstore_product_badges';
                });


                //if prices aren't to be shown we take out price related facet
                var hidden_facet_names = Configuration.get('loginToSeePrices.hiddenFacetNames', []);

                if (ProfileModel.getInstance().hidePrices()) {
                    ordered_facets = _.reject(ordered_facets, function (item) {
                        return _.indexOf(hidden_facet_names, item.id) >= 0;
                    });
                }

                return new BackboneCollectionView({
                    childView: FacetsFacetedNavigationItemView
                    , viewsPerRow: 1
                    , collection: new Backbone.Collection(ordered_facets)
                    , childViewOptions: {
                        translator: translator
                    }
                });
            }

            // added so categories will show above facets
        ,   'Facets.CategorySidebar': function ()
            {
	            var self = this
		            , category = this.category
		            , categoryFacets = _.find(self.allFacets, {id: "commercecategoryname"});
	
	            if (this.category) {
		            // compare against this.allFacets
		            var categories = _.filter(this.category.get('categories'), function (cat) {
			            var inFacets = _.filter(categoryFacets.values, function (facet) {
				
				            return facet.url === cat.name;
			            });
			
			            return cat.displayinsite === true && inFacets.length > 0
		            });
		
		            category = new Backbone.Model({
			            categories: categories
			            , name: 'All'
		            });
		
		
		            return new FacetsFacetedNavigationItemCategoryView({
			            model: category
			            , categoryUrl: this.translator.getCategoryUrl()
			            , translator: this.translator
		            });
	            }
            }
        })

    ,   getContext: _.wrap( FacetsFacetedNavigationView.prototype.getContext, function(fn)
        {
            var returnVariable = fn.apply(this, _.toArray(arguments).slice(1));

            _.extend(returnVariable , {isCategory: true});

            return returnVariable
        })

	});
});

