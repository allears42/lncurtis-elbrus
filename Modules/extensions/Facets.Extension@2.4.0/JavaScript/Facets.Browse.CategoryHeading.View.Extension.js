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

        getContext: _.wrap(FacetsBrowseCategoryHeadingView.prototype.getContext,function (fn)
        {
	        var returnVariable = fn.apply(this, _.toArray(arguments).slice(1));
	        _.extend(returnVariable , {
	        	// this default code will always return true as the property is always present
		        // hasBanner: !!this.model.get('pagebannerurl')
		        hasBanner: this.model.get('pagebannerurl').length > 0
		        ,	showBanner: this.model.get('pagebannerurl').length > 0
	        });
	
	        return returnVariable
	        
        })

	});

});
