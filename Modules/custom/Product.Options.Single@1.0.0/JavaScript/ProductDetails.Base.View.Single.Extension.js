/*
	© 2017 LN Curtis
*/

define(
    'ProductDetails.Base.View.Single.Extension'
    ,	[
        'ProductDetails.Base.View'
    ,   'ProductDetails.Full.View'
    ,   'ProductDetails.Options.Selector.Singles.View'

    ,	'underscore'
    ]
    ,	function(
        ProductDetailsBaseView
    ,   ProductDetailsFullView
    ,   ProductDetailsOptionsSelectorSinglesView

    ,	_
    )
    {
        'use strict';
	
	    ProductDetailsFullView.prototype.childViews['Product.Options.Single'] = function ()
	    {
		    return new ProductDetailsOptionsSelectorSinglesView({
			    model: this.model
			    ,	application: this.application
			    ,	show_pusher: this.showOptionsPusher()
			    ,	show_required_label: this.model.get('item').get('itemtype') === 'GiftCert'
		    });
		
	    };
        
        _.extend( ProductDetailsBaseView.prototype, {
        	initialize: _.wrap(ProductDetailsBaseView.prototype.initialize, function (fn, options) {
				fn.apply(this, _.toArray(arguments).slice(1));
		       
		         var self = this
		        ,   layout = this.application.getLayout();
		        
		        layout.once('afterAppendView', function () {
			        self.model.setSingleOptions();
			        self.showContent();
			
		        }, self);
		
	        })
	        
        ,   childViews: _.extend({}, ProductDetailsBaseView.prototype.childViews,
            {
	            'Product.Options.Single': function ()
	            {
		            return new ProductDetailsOptionsSelectorSinglesView({
			            model: this.model
			            ,	application: this.application
			            ,	show_pusher: this.showOptionsPusher()
			            ,	show_required_label: this.model.get('item').get('itemtype') === 'GiftCert'
		            });
		
	            }
            })
	        
        // FIX for UI doesn't update on initial load
        //@method generateViewBindings Extend the bindings properties by adding all the bindings to all the temporal option properties
        //@return {Void}
        ,	generateViewBindings: function generateViewBindings ()
	        {
		        var self = this
			        ,	option_bindings = self.model.get('options').reduce(function (bindings, option)
		        {
			        var cart_option_id = option.get('cartOptionId');
			
			        //Bind to set options
			        bindings['[name="' + cart_option_id + '"]'] = {
				        observe: option.get('cartOptionId')		// << TEMP PROPERTY TO MAKE EASY VALIDATION (READ HERE)
				        ,	setOptions: {
					        validate: true
					        ,	silent: true
				        }
				        ,	onSet: function (value, options)
				        {
					        var view =  options.view
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
				        /*,   getVal: function($el, event, options) {
				        	    return $el.val();
			            }
			            ,   update: function ($el, val, model, options) {
					            console.log('update', val, model, options);
					            $el.val(val);
				        }*/
				        ,	events: [self.getBindingEventForOption(option)]
			        };
			
			        //Binding for the label (selected value)
			        bindings['[data-value="'+ cart_option_id +'"]'] = {
				        observe: option.get('cartOptionId')
				        ,	onGet: function ()
				        {
					        // initial code works if there is already a model option set
					        if(option.get('value')) return option.get('value').label;
					
					        // value isn't set here on initial load of a page. Why? TBD
					        // we check against the model to see if there is actually a value
					        var selectedOption = self.model.get(option.get('cartOptionId'))
						        ,   selectedValue = _.find(option.get('values'), {internalid: selectedOption});
					
					        if(selectedValue) return selectedValue.label;
					
					        // else return blank
					        return '';
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
								        // option values is undefined on initial load regardless of selecting an option
								        // so compare against the model itself to see whats set
								        var selectedOption = self.model.get(option.get('cartOptionId'))
								        ,   selectedValue = _.find(option.get('values'), {internalid: selectedOption});
								
								        if (selectedValue && !selectedValue.isAvailable)
								        {
									        return 'muted';
								        }
								        else if (selectedValue && value.internalid === selectedValue.internalid)
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
