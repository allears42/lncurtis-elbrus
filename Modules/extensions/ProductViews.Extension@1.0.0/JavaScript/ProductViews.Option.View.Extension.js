/*
	© 2017 JHM Services
*/

// @module ProductViews
define(
	'ProductViews.Option.View.Extension'
,	[
		'ProductViews.Option.View'
	,	'SC.Configuration'
	,	'Backbone'
	,	'underscore'
	]
,	function (
        ProductViewsOptionView

	,	Configuration
	,	Backbone
	,	_
	)
{
	'use strict';

	_.extend(ProductViewsOptionView.prototype, {
        // @method getContext
        getContext: _.wrap(ProductViewsOptionView.prototype.getContext, function (fn) {
            var returnVariable = fn.apply(this, _.toArray(arguments).slice(1));
            
            // sort values
	        var values = returnVariable.values;
	        values = _.sortBy(values, function (value) {
		        var sortValue = _.find(Configuration.sizes, function(size) {
			        return size.name === value.label;
		        });
		        
		        if (sortValue) return sortValue.value;
		        
		       if(_.isNumber(parseFloat(value.label))){
					return parseFloat(value.label);
		       }
	        });
	        
	        _.extend(returnVariable, {
                // @propery {Boolean} showRequiredLabel
                // overwriting this as it appears to be a bug of using && instead of ||
                showRequiredLabel: this.options.show_required_label || this.model.get('isMandatory')
	            
	            // override with sorted values
            ,   values : values
	            
	            // tooltips are used on configurator
            ,   tooltip: this.model.tooltip && this.model.tooltip.tooltipe
            ,   showTooltip: !!this.model.tooltip
            });
            
            return returnVariable;
        })
    });
});
