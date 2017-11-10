/*
	© 2017 LN Curtis
*/

define(
    'Product.Configurator'
    ,	[
        'ProductDetails.Full.View.Configurator'

    ,	'underscore'
    ]
    ,	function(
		ProductDetailsFullViewConfigurator
    ,	_
    )
    {
        'use strict';

        return {
	        ProductDetailsFullViewConfigurator: ProductDetailsFullViewConfigurator
        }
    });
