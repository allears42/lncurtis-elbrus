/*
	© 2017 Satellite
	Adds pricing schedule to item price views
	Add other data to context object
	Add custom handling for matrix price ranges when not using the child matrix fieldset (performance)
	Add hideComparePrice to pass variable that allows us to hide the compare price on the PLP
*/

// @module ItemViews
define(
	'ProductViews.Price.View.Extension'
,	[
		'ProductViews.Price.View'

	,	'Profile.Model'
	,	'Session'
	,	'SC.Configuration'

	,	'underscore'
	]
,	function(
        ProductViewsPriceView

	,	ProfileModel
	,	Session
	,	Configuration

	,	_
	)
{
	'use strict';

    // @class ItemViews.Price.View.Extension @extends ItemViews.Price.View
    _.extend(ProductViewsPriceView.prototype, {
	
	    initialize: _.wrap(ProductViewsPriceView.prototype.initialize, function (fn, options) {
		    fn.apply(this, _.toArray(arguments).slice(1));
		
		    this.hideComparePrice = options.hideComparePrice || false;
	    })
        // @method getContext
        // @return {Header.View.Context}
    ,   getContext: _.wrap(ProductViewsPriceView.prototype.getContext, function (fn) {
         
        	var origins = ["ITEMCELL_SEARCH", "RELATEDITEM"];
        	
            var returnVariable = fn.apply(this, _.toArray(arguments).slice(1))
            ,   itemModel = origins.indexOf(this.options.origin) > -1 ? this.model : this.model.get('item')
	           
            // custom - handling matrix price ranges when not using the child martrix fieldset (performance)
            ,   matrix_price_range = itemModel.get('getMatrixPriceRange')
	
            ,   is_matrix_price_range = !!(matrix_price_range.min && matrix_price_range.max)
	           
            ,   isCallForPricing = returnVariable.isCallForPricing || itemModel.get('_isCallForPricing');
	        
            
            // reset sale pricing variables
            var showComparePrice = returnVariable.showComparePrice
	
            ,	is_price_range = returnVariable.isPriceRange;
		
			// handle sale pricing with a price range
		    if (is_matrix_price_range)
		    {
			    showComparePrice = matrix_price_range.min.price < matrix_price_range.max.price;
				is_price_range = true;
			   
		    }
		    
		    // take passed in variable as last consideration
		    if(!this.showComparePrice) showComparePrice = false;
			   
			_.extend(returnVariable, {
				// @property {Boolean} isPriceEnabled
				isPriceEnabled: !ProfileModel.getInstance().hidePrices() && !isCallForPricing
				
                ,   showComparePrice: false//showComparePrice
				
	            // @property {Boolean} isPriceRange
	            ,	isPriceRange: is_price_range
				
				// reset the pricing variables if matrix is there
				// @property {String} minPriceFormatted
				,	minPriceFormatted: is_matrix_price_range ? matrix_price_range.min_formatted : returnVariable.minPriceFormatted
				// @property {String} maxPriceFormatted
				,	maxPriceFormatted: is_matrix_price_range ? matrix_price_range.max_formatted : returnVariable.maxPriceFormatted
				// @property {Number} minPrice
				,	minPrice: is_matrix_price_range ? matrix_price_range.min : returnVariable.minPrice
				// @property {Number} maxPrice
				,	maxPrice: is_matrix_price_range ? matrix_price_range.max : returnVariable.maxPrice
				
				,   callForPricing: isCallForPricing
				
				,   phone: Configuration.get("header.telephone", "877-488-0469")
				
				,   isDesktop: _.isPhoneDevice() === false && _.isTabletDevice() === false
				
            });
			
			return returnVariable;
        })
    });


	});