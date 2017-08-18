/*
	© 2017 LN Curtis
*/

define(
    'Facets.FacetedNavigationItemCategory.View.Extension'
    ,	[
        'Facets.FacetedNavigationItemCategory.View'

        ,	'underscore'
    ]
    ,	function(
        FacetsFacetedNavigationItemCategoryView

        , 	_
    )
    {
        'use strict';

        _.extend( FacetsFacetedNavigationItemCategoryView.prototype, {

            initialize: function ()
            {
                this.categories = this.model && (this.model.get('categories') || this.model.get('siblings')) || [];
                this.categoryUrl = this.options.categoryUrl;

                this.on('afterViewRender', this.renderCategories, this);
            }

        ,	getContext: function()
            {
                var showFacet = this.categories.length
                    ,	values = []
                    ,	self = this
                    ,	showMax = Configuration.get('categories.sideMenu.showMax')
                    ,	uncollapsible = Configuration.get('categories.sideMenu.uncollapsible')
                    ,	collapsed = Configuration.get('categories.sideMenu.collapsed')
                    ,   facetsAndKeywords = self.options.translator.cloneWithoutCategories().getUrl() || '';

                // category facets aren't treated as facets >= the 3rd level so remove the current category URL from the returned string
                facetsAndKeywords = facetsAndKeywords.replace(self.options.translator.getCategoryUrl(), '');

                var appendFacetsAndKeywords = facetsAndKeywords && facetsAndKeywords !== "/search" ? true : false;

                _.each(this.categories, function (category)
                {
                    values.push({
                        displayName: category.name
                        ,	label: category.name
                        ,	link: category.fullurl + (appendFacetsAndKeywords ? facetsAndKeywords : "")
                        ,	isActive: category.fullurl === self.categoryUrl
                    });
                });

                values = _.sortBy(values, function (category) {
                    return category.displayName;
                });
                var max = showMax || values.length
                    ,	displayValues = _.first(values, max)
                    ,	extraValues = _.rest(values, max);

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

                // @class Facets.FacetedNavigationItemCategory.View.Context
                return {
                    //@property {String} htmlId
                    htmlId: _.uniqueId('commercecategory_')
                    // @property {String} facetId
                    ,	facetId: 'commercecategory'
                    // @property {Boolean} showFacet
                    ,	showFacet: !!showFacet
                    //@property {Array<Object>} values
                    ,	values: values
                    // @property {Array<Object>} displayValues
                    ,	displayValues: displayValues
                    //@property {Array<Object>} extraValues
                    ,	extraValues: extraValues
                    //@property {Boolean} showExtraValues
                    ,	showExtraValues: !!extraValues.length
                    //@property {Boolean} isUncollapsible
                    ,	isUncollapsible: !!uncollapsible
                    //@property {Boolean} isCollapsed
                    ,	isCollapsed: !uncollapsible && collapsed
                    //@property {String} parentName
                    ,	parentName: parentName
                    ,	showParentName: parentName.length > 0
                    ,	showQuantifier: breadcrumb.length < 2
                    // @class Facets.FacetedNavigationItemCategory.View
                };
            }

        });

    });
