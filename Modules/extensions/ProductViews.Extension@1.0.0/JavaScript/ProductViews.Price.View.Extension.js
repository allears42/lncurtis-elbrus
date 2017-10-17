/*
	© 2017 Satellite
	Adds pricing schedule to item price views
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
        // @method getContext
        // @return {Header.View.Context}
        getContext: _.wrap(ProductViewsPriceView.prototype.getContext, function (fn) {
         
        	//console.log('this.model', this.model, this.options.origin);
        	
        	var origins = ["ITEMCELL_SEARCH", "RELATEDITEM"];
        	
            var returnVariable = fn.apply(this, _.toArray(arguments).slice(1))
            ,   itemModel = origins.indexOf(this.options.origin) > -1 ? this.model : this.model.get('item')
            ,   details_object = itemModel && itemModel.get('_priceDetails') || {}
            ,   price_container_object = itemModel.getPrice()
	           
            // custom - handling matrix price ranges when not using the child martrix fieldset (performance)
            ,   price_range = itemModel.get('getMatrixPriceRange')
	           
            ,   isCallForPricing = returnVariable.isCallForPricing || itemModel.get('_isCallForPricing');
	        
            
            // reset sale pricing variables
            var showComparePrice = returnVariable.showComparePrice
	
            ,	is_price_range = !!(price_container_object.min && price_container_object.max) || (price_range && price_range.min && price_range.max)

            ,   price_min = price_range && price_range.min_formatted || ''
            ,   price_max = price_range && price_range.max_formatted || '';
		
		
            // handle sale pricing with a price range
		    if (!this.options.hideComparePrice && is_price_range)
		    {
			    showComparePrice = false;
			    if (!!(is_price_range.min && is_price_range.max)){
				    showComparePrice = is_price_range.max.price < is_price_range.compare_price
			    }
		    }
			   
			_.extend(returnVariable, {
				// @property {Boolean} isPriceEnabled
				isPriceEnabled: !ProfileModel.getInstance().hidePrices() && !isCallForPricing
				
                ,   showComparePrice: showComparePrice
	            
	            // @property {String} priceFormatted
	            ,	priceFormatted: price_container_object.price_formatted || ''
	            // @property {Number} price
	            ,	price: price_container_object.price ? price_container_object.price : 0
				
	            // @property {Boolean} isPriceRange
	            ,	isPriceRange: is_price_range
				
				// reset the pricing variables
				
				// @property {Number} comparePrice
				,	comparePrice: price_container_object.compare_price ? price_container_object.compare_price : 0
				// @property {String} minPriceFormatted
				,	minPriceFormatted: price_container_object.min ? price_container_object.min.price_formatted : price_min
				// @property {String} maxPriceFormatted
				,	maxPriceFormatted: price_container_object.max ? price_container_object.max.price_formatted : price_max
				// @property {Number} minPrice
				,	minPrice: price_container_object.min ? price_container_object.min.price : 0
				// @property {Number} maxPrice
				,	maxPrice: price_container_object.max ? price_container_object.max.price : 0
				
				,   callForPricing: isCallForPricing
				
				,   phone: Configuration.get("header.telephone", "877-488-0469")
				
				,   isDesktop: _.isPhoneDevice() === false && _.isTabletDevice() === false
            });
			
			return returnVariable;
        })
    });


	});