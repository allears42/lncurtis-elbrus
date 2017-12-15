// sizing
//custcol_carrier_armor_brand - dropdown
//custcol_carrier_armor_other - other text field
//custcol_back_panel_size - text
//custcol_front_panel_size - free form

//custcol_carrier_color - color palette

/*
Front Patch = FRONT PATCH BLZ STCH CUSTOM with Internal ID = 532317

Rear Patch = REAR PATCH BLZ STCH CUSTOM with Internal ID = 532517

Name Strip = NAME STRIP BLZ STCH CUSTOM with Internal ID = 532617
 */

/*
	© 2017 LN Curtis
*/

define(
	'Product.Configurator.FieldConfig'
	,	[
			'underscore'
	]
	,	function(
			_
	)
	{
		'use strict';
		
		return {
			generalIDs: ['custcol_gender_nonmatrix', 'custcol_carrier_color']
			
		,   sizingIDs: ['custcol_carrier_armor_brand', 'custcol_back_panel_size',  'custcol_front_panel_size', 'custcol_carrier_armor_other']
		
		,   frontPatchIDs: ['custcol_front_patch_color', 'custcol_front_patch_size',  'custcol_front_patch_text']
		
		,   backPatchIDs: ['custcol_rear_patch_color', 'custcol_rear_patch_text']
		
		,   nameStripIDs: ['custcol_carrier_name_color', 'custcol_carrier_name_text']
		
		,   getGeneralOptions: function (options) {
				
				var self = this;
				
				return _.filter(options, function (option) {
					return self.generalIDs.indexOf(option.get('cartOptionId')) > -1;
				});
			}
		
		,   getSizingOptions: function (options) {
				
				var self = this;
				
				return _.filter(options, function (option) {
					return self.sizingIDs.indexOf(option.get('cartOptionId')) > -1;
				});
			}
			
		,   getFrontPatchOptions: function (options) {
				
				var self = this;
				
				return _.filter(options, function (option) {
					return self.frontPatchIDs.indexOf(option.get('cartOptionId')) > -1;
				});
			}
			
		,   getBackPatchOptions: function (options) {
				
				var self = this;
				
				return _.filter(options, function (option) {
					//console.log('rear', option.get('cartOptionId'), self.backPatchIDs.indexOf(option.get('cartOptionId')) > -1)
					return self.backPatchIDs.indexOf(option.get('cartOptionId')) > -1;
				});
			}
			
		,   getNameStripOptions: function (options) {
				
				var self = this;
				
				return _.filter(options, function (option) {
					//console.log(option.get('cartOptionId'))
					return self.nameStripIDs.indexOf(option.get('cartOptionId')) > -1;
				});
			}
			
		,   getAllCustomOptions: function () {
				return this.generalIDs.concat(this.sizingIDs, this.frontPatchIDs, this.backPatchIDs, this.nameStripIDs)
			}
			
		,   excludeCustomOptions: function (options) {
				
				var self = this
				,   customOptions = self.getAllCustomOptions();
				
				return _.filter(options, function (option) {
					return customOptions.indexOf(option.get('cartOptionId')) < 0;
				});
			}
		}
	});
