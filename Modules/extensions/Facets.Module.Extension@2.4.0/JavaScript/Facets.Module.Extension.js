/*
	© 2017 LN Curtis
	Custom extension logic for Facets.
*/

define(
	'Facets.Module.Extension'
,	[
		'Facets.Browse.View.Extension'
	,	'Facets.Browse.CategoryHeading.View.Extension'
	,	'Facets.FacetedNavigation.View.Extension'
	,	'Facets.FacetedNavigationItem.View.Extension'
	,	'Facets.FacetedNavigationItemCategory.View.Extension'
	,	'Facets.ItemCell.View.Extension'
	,	'Facets.Extension'
	,	'Facets.Translator.Extension'
	]
,	function(
        FacetsBrowseViewExtension
	,	FacetsBrowseCategoryHeadingViewExtension
	,	FacetsFacetedNavigationViewExtension
	,	FacetsFacetedNavigationItemViewExtension
	,	FacetsFacetedNavigationItemCategoryViewExtension
	,	FacetsItemCellViewExtension
	,	FacetsExtension
	,	FacetsTranslatorExtension

	)
{
	'use strict';
	
	return {
        FacetsBrowseViewExtension: FacetsBrowseViewExtension
	,	FacetsBrowseCategoryHeadingViewExtension: FacetsBrowseCategoryHeadingViewExtension
	,	FacetsFacetedNavigationViewExtension: FacetsFacetedNavigationViewExtension
	,	FacetsFacetedNavigationItemViewExtension: FacetsFacetedNavigationItemViewExtension
	,	FacetsFacetedNavigationItemCategoryViewExtension: FacetsFacetedNavigationItemCategoryViewExtension
	,	FacetsItemCellViewExtension: FacetsItemCellViewExtension
	,	FacetsExtension: FacetsExtension
	,	FacetsTranslatorExtension: FacetsTranslatorExtension

	}

});