/*
	© 2017 LN Curtis
*/

define(
	'Facets.FacetedNavigationItem.View.Extension'
,	[
		'Facets.FacetedNavigationItem.View'

	,	'SC.Configuration'
	,	'underscore'
	]
,	function(
        FacetsFacetedNavigationItemView

	, 	Configuration
	, 	_
	)
{
	'use strict';
	
	_.extend( FacetsFacetedNavigationItemView.prototype, {
		
		// modifed to:
		// sort the values
		// not collapse menus where a facet is selected for better UX
		getContext: _.wrap(FacetsFacetedNavigationItemView.prototype.getContext, function (fn) {
			
			var returnVariable = fn.apply(this, _.toArray(arguments).slice(1))
				, facet_id = this.facetId
				, facet_config = this.facet_config
				// values is raw unsorted unfiltered values from context object
				, values = returnVariable.values
				, selected_values = this.options.translator.getFacetValue(facet_id) || []
				, show_remove_link = !!selected_values.length
				, display_values
				, extra_values = []
				, max_items;
			
			if (facet_config.behavior !== 'range') {
				//custom code
				//sort facets by custom values
				var valuesSorted = _.sortBy(values, function (value) {
					var parsedValue = parseFloat(value.label)
						, returnValue;
					var sortValue = _.find(Configuration.sizes, function (size) {
						return size.name === value.label;
					});
					if (sortValue) returnValue = sortValue.value;
					else if (!_.isNaN(parsedValue)) returnValue = parsedValue;
					else returnValue = value.label;
					return returnValue;
				});
				
				max_items = facet_config.max || values.length;
				display_values = _.first(valuesSorted, max_items);
				extra_values = _.rest(valuesSorted, max_items);
			}
			
			_.extend(returnVariable, {
				// don't collapse the menu if an item within it has been selected
				isCollapsed: !this.facet_config.uncollapsible && this.facet_config.collapsed && !show_remove_link
				, isSubItemsCollapsed: !this.facet_config.uncollapsible && !show_remove_link
				
				// reset the values based on our sort
				
				//@property {Array<Object>} values
				, values: valuesSorted
				//@property {Array<Object>} displayValues
				, displayValues: display_values
				//@property {Array<Object>} extraValues
				, extraValues: extra_values
				//@property {Boolean} showExtraValues
				, showExtraValues: !!extra_values.length
			});
			
			return returnVariable;
			
		})
	});
});

