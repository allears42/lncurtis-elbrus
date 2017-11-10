/*
	© 2017 JHM Services.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ProductViews
define(
	'ProductViews.SizeChart'
,	[
		'product_views_size_chart.tpl'

	,	'Backbone'
	,	'underscore'
	]
,	function(
		product_views_size_chart_tpl

	,	Backbone
	,	_
	)
{
	'use strict';

	// @class ProductViews.SizeChart.View @extends Backbone.View
	return Backbone.View.extend({

		template: product_views_size_chart_tpl
	,   initialize: function (options) {
            this.options = options;
            this.model = options.model;
            this.title = this.model.title + " Size Chart"

        }
    ,   title: "Size Chart"
		// @method getContext @returns {ProductViews.SizeChart.View.Context}
	,	getContext: function ()
		{

            var sizeChart = this.model.get('_sizechart');

            //@class ProductViews.SizeChart.View.Context
			return {
                sizeChart: sizeChart
			};
			//@class ProductViews.SizeChart.View
		}
	});
});