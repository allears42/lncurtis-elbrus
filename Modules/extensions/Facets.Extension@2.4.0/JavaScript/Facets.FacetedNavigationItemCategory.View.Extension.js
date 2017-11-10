/*
	© 2017 LN Curtis
*/

define(
    'Facets.FacetedNavigationItemCategory.View.Extension'
    ,	[
        'Facets.FacetedNavigationItemCategory.View'

        ,	'SC.Configuration'
        ,	'underscore'
    ]
    ,	function(
        FacetsFacetedNavigationItemCategoryView

        , 	Configuration
        , 	_
    )
    {
        'use strict';

        _.extend( FacetsFacetedNavigationItemCategoryView.prototype, {
	
	        initialize: _.wrap(FacetsFacetedNavigationItemCategoryView.prototype.initialize, function(fn)
	        {
		        fn.apply(this, _.toArray(arguments).slice(1));
		
		        // want categories to be set based on this models sub categories before it looks at siblings
		        this.categories = this.model && (this.model.get('categories') || this.model.get('siblings')) || [];
	        })

        ,	getContext: _.wrap(FacetsFacetedNavigationItemCategoryView.prototype.getContext, function (fn) {
		
		        var returnVariable = fn.apply(this, _.toArray(arguments).slice(1))
		        ,	showMax = Configuration.get('categories.sideMenu.showMax')
		        ,   self = this
                ,	facetsAndKeywords = self.options.translator.cloneWithoutCategories().getUrl() || ''
		        ,   values = [];

                // category facets aren't treated as facets >= the 3rd level so remove the current category URL from the returned string
                facetsAndKeywords = facetsAndKeywords.replace(self.options.translator.getCategoryUrl(), '');

                var appendFacetsAndKeywords = !!(facetsAndKeywords && facetsAndKeywords !== "/search");

                // repopulate values with new links
                _.each(this.categories, function (category)
                {
                    values.push({
                        displayName: category.name
                        ,	label: category.name
                        ,	link: category.fullurl + (appendFacetsAndKeywords ? facetsAndKeywords : "")
                        ,	isActive: category.fullurl === self.categoryUrl
                    });
                });

                // sort alphabetically
                values = _.sortBy(values, function (category) {
                    return category.displayName;
                });
                
                // recalculate the values passed
                var max = showMax || values.length
                    ,	displayValues = _.first(values, max)
                    ,	extraValues = _.rest(values, max);

                // determine where to show the parent name as a breadcrumb
                var breadcrumb = this.model && (this.model.get('breadcrumb') || [])
                ,	parentName = '';

                if (breadcrumb && breadcrumb.length)
                {
                    var index = breadcrumb.length > 1 ? breadcrumb.length - 2 : breadcrumb.length - 1;
                    parentName = '';

                    _.each(breadcrumb, function(crumb, index){
                        parentName += crumb.name + (index < breadcrumb.length-1 ? ": " : " ")
                    });
                }
                
                _.extend(returnVariable, {
	                //@property {Array<Object>} values
	                	values: values
			        // @property {Array<Object>} displayValues
			        ,	displayValues: displayValues
			        //@property {Array<Object>} extraValues
			        ,	extraValues: extraValues
			        //@property {Boolean} showExtraValues
			        ,	showExtraValues: !!extraValues.length
	                // custom
	                ,	showParentName: parentName.length > 0
			        ,	showQuantifier: breadcrumb.length < 2
                });
                
                return returnVariable;
            })

        });

    });
