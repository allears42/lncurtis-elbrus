/*
	© 2016 JHM Services Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module FacetContent
define('FacetContent.View'
,	[
		'SC.Configuration'
	,	'Backbone.CompositeView'

	,	'from_facets_alphabetical.tpl'

	,	'Backbone'
	,	'underscore'
	,	'jQuery'
	,	'Utils'
	]
,	function (

        Configuration
	,	BackboneCompositeView

	,	from_facets_alphabetical_tpl

	,	Backbone
	,	_
	)
{
	'use strict';

	// @class FacetContent.View @extend Backbone.View
	return Backbone.View.extend({

		// @property {Function} template
		template: from_facets_alphabetical_tpl

	,	initialize: function initialize (options)
		{
            this.facet = options.facet;
            this.data = _.filter(options.data.get("facets"), function(facet) {
                return facet.id == options.facet;
            });
            if (_.isArray(this.data)) this.data = this.data[0];
			this.application = options.application;

			BackboneCompositeView.add(this);
		}
		
    ,   keys : {
            "custitem_facets_brand": "sortByLetter"
        }
        
    ,   getTitle: function () {
			return "Brands | Curtis"
		}
    
    ,   sortByLetter: function (facetData) {
            var self = this
            ,  sortedValues = {}
            ,  sortedValuesArr = [];

            _.each(facetData.values, function (value) {
                if (value.label) {
                    var firstChar = value.label.charAt(0).toUpperCase().toString();
                    sortedValues[firstChar] = sortedValues[firstChar] || [];
                    sortedValues[firstChar].push(value);
                }
            });

            _.each(sortedValues, function (v, k) {
               sortedValuesArr.push({
                   letter: k
                   , values: v
               })
            });

            return sortedValuesArr;
        }

    // @method getBreadcrumbPages
    //todo: make this dynamic
    ,	getBreadcrumbPages: function ()
    {
        return {href: '/brands', text: _('Brands').translate()};
    }
		// @method getContext
		// @return {FacetContent.View.Context}
	,	getContext: function getContext ()
		{
            var fn = this.keys[this.facet]
            ,   dataContext = this[fn](this.data);


			return {
                byLetter: dataContext
                , werid: "werid"
            };
		}
	});
});
