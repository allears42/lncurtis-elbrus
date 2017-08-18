/*
	© 2017 LN Curtis
	Custom extension logic for...
*/

define(
	'Facets.Browse.CategoryHeading.View.Extension'
,	[
		'Facets.Browse.CategoryHeading.View'

	,	'underscore'
	]
,	function(
        FacetsBrowseCategoryHeadingView

	, 	_
	)
{
	'use strict';
	
	_.extend( FacetsBrowseCategoryHeadingView.prototype, {

        getContext: function ()
        {
            return {
                name: this.model.get('name')
                ,	banner: this.model.get('pagebannerurl')
                ,	showBanner: this.model.get('pagebannerurl').length > 0
                ,	description: this.model.get('description')
                ,	pageheading: this.model.get('pageheading') || this.model.get('name')
                ,	hasBanner: !!this.model.get('pagebannerurl')
            };
        }

	});

});
