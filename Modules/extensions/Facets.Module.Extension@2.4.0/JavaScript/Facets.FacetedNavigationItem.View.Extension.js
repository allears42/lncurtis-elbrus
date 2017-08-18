/*
	© 2017 LN Curtis
*/

define(
	'Facets.FacetedNavigationItem.View.Extension'
,	[
		'Facets.FacetedNavigationItem.View'

	,	'underscore'
	]
,	function(
        FacetsFacetedNavigationItemView

	, 	_
	)
{
	'use strict';
	
	_.extend( FacetsFacetedNavigationItemView.prototype, {

        toggleSeeMoreLess: function(event)
        {
            var target = jQuery(event.currentTarget)
                ,   realTarget = jQuery(event.target)
                ,	target_see_more = target.find('[data-type="see-more"]')
                ,	target_see_less = target.find('[data-type="see-less"]')
                ,	target_was_expanded = realTarget.data('type') === "see-less";


            if (target_was_expanded)
            {
                target_see_more.show();
                target_see_less.hide();
            }
            else
            {
                target_see_more.hide();
                target_see_less.show();
            }

            target.data('collapsed', target_was_expanded);
        }

    ,	getContext: function ()
        {
            var facet_id = this.facetId
                ,	translator = this.options.translator
                ,	facet_config = this.facet_config
                ,	values = []
                ,	range_min = 0
                ,	range_max = 0
                ,	range_from = 0
                ,	range_from_label = ''
                ,	range_to = 0
                ,	range_to_label = ''
                ,	range_values = []
                ,	max_items
                ,	display_values
                ,	extra_values = []
                ,	show_facet
                ,	show_remove_link
                // fixes the selected items
                ,	selected_values = this.options.translator.getFacetValue(facet_id) || [];

            selected_values = _.isArray(selected_values) ? selected_values : [selected_values];
            show_remove_link = !!selected_values.length;

            // Prepears the values for display
            var original_values = _.isArray(this.model.get('values')) ? this.model.get('values') : [this.model.get('values')];

            if (facet_config.behavior !== 'range')
            {
                _.each(original_values, function(value)
                {
                    if (value.url !== '')
                    {
                        value.isActive = _.contains(selected_values, value.url);
                        value.link = translator.cloneForFacetId(facet_id, value.url).getUrl();
                        value.displayName = value.label || decodeURIComponent(value.url) || _('(none)').translate();
                        value.color = '';
                        value.isColorTile = false;
                        value.image = {};
                        value.isImageTile = false;

                        if (facet_config.colors)
                        {
                            value.color = facet_config.colors[value.label] || facet_config.colors.defaultColor;
                            if (_.isObject(value.color))
                            {
                                value.image = value.color;
                                value.color = '';
                                value.isImageTile = true;
                            }
                            else
                            {
                                value.isColorTile = true;
                            }
                        }

                        values.push(value);
                    }
                });

                //custom code
                //sort facets by custom values
                var valuesSorted = _.sortBy(values, function (value) {
                    var parsedValue = parseFloat(value.label)
                        , returnValue;
                    var sortValue = _.find(Configuration.sizes, function(size) {
                        return size.name == value.label;
                    });
                    if (sortValue) returnValue = sortValue.value;
                    else if (!_.isNaN( parsedValue )) returnValue = parsedValue;
                    else returnValue = value.label;
                    return returnValue;
                });

                max_items = facet_config.max || values.length;
                display_values = _.first(valuesSorted, max_items);

                _(display_values).each(function(value)
                {
                    value.isLightColor = _.contains(Configuration.lightColors, value.label);
                });
                extra_values = _.rest(valuesSorted, max_items);
                show_facet = !!values.length;
            }
            else //if (facet_config.behavior === 'range')
            {
                range_values = _.map(original_values, function (item) {
                    return parseFloat(item.url);
                });

                range_min = _.min(range_values);
                range_max = _.max(range_values);

                show_facet = range_max > range_min;
                show_remove_link = this.model.get('max') !== range_max || this.model.get('min') !== range_min;

                var translator_value = translator.getFacetValue(facet_id) || {from: range_min, to: range_max};
                range_from = translator_value.from;
                range_to = translator_value.to;

                range_to_label = _.isFunction(facet_config.parser) ? facet_config.parser(range_to, false) : range_to;
                range_from_label = _.isFunction(facet_config.parser) ? facet_config.parser(range_from, false) : range_from;
            }


            // @class Facets.FacetedNavigationItem.View.Context
            var context = {
                //@property {String} htmlId
                htmlId: _.uniqueId('facetList_')
                //@property {String} facetId
                ,	facetId: facet_id
                //@property {Boolean} showFacet
                ,	showFacet: show_facet
                //@property {Boolean} showHeading
                ,	showHeading: _.isBoolean(facet_config.showHeading) ? facet_config.showHeading : true
                //@property {Boolean} isUncollapsible
                ,	isUncollapsible: !!facet_config.uncollapsible
                //@property {Boolean} isCollapsed
                ,	isCollapsed: !this.facet_config.uncollapsible && this.facet_config.collapsed && !show_remove_link
                ,	isSubItemsCollapsed: !this.facet_config.uncollapsible && !show_remove_link
                //@property {Boolean} isMultiSelect
                ,	isMultiSelect: facet_config.behavior === 'multi'
                //@property {Boolean} showRemoveLink
                ,	showRemoveLink: show_remove_link
                //@property {String} removeLink
                ,	removeLink: translator.cloneWithoutFacetId(facet_id).getUrl()
                //@property {String} facetDisplayName
                ,	facetDisplayName: facet_config.name || facet_id
                //@property {Array<Object>} values
                ,	values: valuesSorted
                //@property {Array<Object>} displayValues
                ,	displayValues: display_values
                //@property {Array<Object>} extraValues
                ,	extraValues: extra_values
                //@property {Boolean} showExtraValues
                ,	showExtraValues: !!extra_values.length
                //@property {Boolean} isRange
                ,	isRange: facet_config.behavior === 'range'
                //@property {Array<Number>} rangeValues
                ,	rangeValues: range_values
                //@property {Number} rangeMin
                ,	rangeMin: range_min
                //@property {Number} rangeMax
                ,	rangeMax: range_max
                //@property {Number} rangeFrom
                ,	rangeFrom: range_from
                //@property {String} rangeFromLabel
                ,	rangeFromLabel: range_from_label
                //@property {Number} rangeTo
                ,	rangeTo: range_to
                //@property {String} rangeToLabel
                ,	rangeToLabel: range_to_label
            };

            // @class Facets.FacetedNavigationItem.View
            return context;
        }
	});
});
