/*
	© 2017 JHM Services
	Native options selection method doesn't allow for custom data attributes on options for show which are disabled
	It also doesn't update the other methods when one option is configured to show valid options based on selection
	
	Added custom functionality that should help with this issue

*/

//@module ProductDetails
define(
	'ProductDetails.Base.View.OptionsFix'
,	[
		'ProductDetails.Base.View'
		
	,	'underscore'

	]
,	function (
		ProductDetailsBaseView
		
	,	_
	)
{
	'use strict';

	_.extend(ProductDetailsBaseView.prototype, {
		
		generateViewBindings: function () {
			var self = this
			,	option_bindings = self.model.get('options').reduce(function (bindings, option)
			{
				var cart_option_id = option.get('cartOptionId');
				
				//Bind to set options
				bindings['[name="' + cart_option_id + '"]'] = {
					observe: option.get('cartOptionId')		// << TEMP PROPERTY TO MAKE EASY VALIDATION (READ HERE)
					,	setOptions: {
						validate: true
						,   silent: true
					}
					
					// this method was taken from the base implementation in backbone.stickit
					// added custom properties to keep our disabled / available statuses
					// added handling of other selects so that they update as the options change
					,   update: function ($el, val, model, options)
						{
							var view = options.view
							,	product_model = view.model;
							
							// set the option on the model
							product_model.setOption(options.observe, val);
							
							var getList = function($el, selectedValue, option, matrixChildOptions) {
								return $el.map(function() {
									var self = this;
									var value = _.find(option.get('values'), function(v) {
										return v.internalid === self.value
									});
									
									
									if(value) {
										// this is a fix as the option models don't seem to always update
										// seems to be a systemic issue that would need more debugging
										// for now this is handling it fine
										var isAvailable = value.isAvailable;
										if (matrixChildOptions && matrixChildOptions.length && matrixChildOptions.indexOf(value.label) > -1) {
											isAvailable = true;
										}
										//console.log(value.label, isAvailable)
										
										return {
											value:value.internalid
											, label:value.label
											, 'active': value.internalid === selectedValue
											, 'available': isAvailable
											, 'disabled': !isAvailable
										};
									}
									
									// select option
									return {
										value:this.value
										, label:this.text
										, 'active': '' === selectedValue
										, 'available': true
										, 'disabled': false
									};
									
								}).get();
							};
							var setOption = function ($el, obj) {
								var option = jQuery('<option/>');
								
								if(obj.disabled) {
									option.text('-- ' + obj.label + ' --');
								}
								else option.text(obj.label);
								
								option.prop('value', obj.value);
								option.prop('disabled', obj.disabled);
								
								option.attr('data-active', obj.active);
								option.attr('data-available', obj.available);
								
								// Save the option value as data so that we can reference it later.
								option.data('stickit_bind_val', obj.value);
								
								if(val === obj.value) {
									// set active
									option.prop('disabled', false);
									option.prop('selected', true);
								}
								
								$el.append(option);
							};
							var setOptionFromValue = function ($el, obj, selectedVal) {
								var option = jQuery('<option/>');
								
								if(obj.disabled) {
									option.text('-- ' + obj.label + ' --');
								}
								else option.text(obj.label);
								
								option.prop('value', obj.value);
								option.prop('disabled', obj.disabled);
								
								option.attr('data-active', obj.active);
								option.attr('data-available', obj.available);
								
								// Save the option value as data so that we can reference it later.
								option.data('stickit_bind_val', obj.value);
								
								if(selectedVal === obj.value) {
									// set active
									//console.log('set active', selectedVal)
									option.prop('disabled', false);
									option.prop('selected', true);
								}
								
								$el.append(option);
							};
							
							// handle this option
							var optionModel = product_model.getOption(options.observe)
							,   list = getList($el.find('option'), val, optionModel);
							
							$el.find('option').empty().remove();
							
							_.each(list, function(obj) {
								setOption($el, obj)
							});
							
							var matrixOptions = product_model.get('options').where({isMatrixDimension: true});
							
							// handle other selects - update them after the product option is set
							_.each(matrixOptions, function (optionModel) {
								
								var id = optionModel.get('cartOptionId')
								,   $select = jQuery('[name="'+id+'"]');
								
								if($select && $select.length === 1 && options.observe !== id) {
									// if not the current option
									var selectedVal =  optionModel.get('value') && optionModel.get('value').internalid || ''
									,   matrixChildOptions = product_model.getValidValuesForOption(optionModel)
									,   localList = getList($select.find('option'), selectedVal, optionModel, matrixChildOptions);
							
									$select.find('option').empty().remove();
									
									_.each(localList, function(obj) {
										setOptionFromValue($select, obj, selectedVal)
									});
									
								}
								
							});
						}
					
					,   onSet: function (value, options)
					{
						var view = options.view
							,	product_model = view.model
							,	option = product_model.get('options').findWhere({cartOptionId: options.observe})
							,	current_value = option.get('value') && option.get('value').internalid;
						
						if (!option.get('isMandatory') && current_value === value && view.$(options.selector).attr('type') === 'radio')
						{
							// unset value.
							value = null;
						}
						
						product_model.setOption(options.observe, value);
						
						return value;
					}
					
					,	events: [self.getBindingEventForOption(option)]
				};
				
				//Binding for the label (selected value)
				bindings['[data-value="'+ cart_option_id +'"]'] = {
					observe: option.get('cartOptionId')
					,	onGet: function ()
					{
						return option.get('value') ? option.get('value').label : '';
					}
				};
				
				_.each(option.get('values'), function(value)
				{
					if (value.internalid) // Exclude the " - Select -" option
					{
						//Bind for mute and active options
						bindings['[data-label="label-' + cart_option_id + '"][value="' + value.internalid + '"]'] = {
							attributes: [{
								name: 'class'
								,	observe: option.get('cartOptionId')
								,	onGet: function ()
								{
									if (!_.findWhere(option.get('values'), {internalid: value.internalid}).isAvailable)
									{
										return 'muted';
									}
									else if (value.internalid === (option.get('value') && option.get('value').internalid))
									{
										return 'active';
									}
									else
									{
										return '';
									}
								}
							}]
						};
					}
					
				});
				
				return bindings;
			}, {});
			
			_.extend(this.bindings, option_bindings);
		}
	});

});

//@class ProductDetails.Base.View.Initialize.Options
//@property {Product} model
//@property {String} baseUrl
//@property {ApplicationSkeleton} application
