/*
	© 2017 JHM Services
*/


define(
	'SC.Configuration.Extension'
	, [
		'SC.Configuration'
		, 'underscore'
	
	]
	, function (
		Configuration
		, _
	
	) {
		
		'use strict';
		
		var baseConfiguration = SC.CONFIGURATION || {};
		
		// custom code
		// mappings for sort order
		// todo: make this configurable?
		baseConfiguration.sizes = [
			{name: '2X~Large', value: 2},
			{name: '2X-Large', value: 2},
			{name: '3X~Large', value: 3},
			{name: '3X-Large', value: 3},
			{name: '4X~Large', value: 4},
			{name: '4X-Large', value: 4},
			{name: '5X~Large', value: 5},
			{name: '5X-Large', value: 5},
			{name: '6X~Large', value: 6},
			{name: '6X-Large', value: 6},
			{name: 'Jumbo', value: 6},
			{name: 'X~Large', value: 1},
			{name: 'X-Large', value: 1},
			{name: 'Large / X-Large', value: 0},
			{name: 'Small / Medium', value: -1},
			{name: 'Large', value: 0},
			{name: 'Medium', value: -1},
			{name: 'Small', value: -2}
		];
		
		_.extend(baseConfiguration.bxSliderDefaults, {
				slideWidth: 220
			,   slideMargin: 28
		});
		
		_.extend(SC.CONFIGURATION, baseConfiguration)
		
	});
