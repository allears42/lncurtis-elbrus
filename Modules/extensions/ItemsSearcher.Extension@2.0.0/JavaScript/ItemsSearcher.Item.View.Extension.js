/*
	© 2017 LN Curtis
*/

define(
    'ItemsSearcher.Item.View.Extension'
    ,	[
        'ItemsSearcher.Item.View'
	,	'ProductViews.Price.View'

	,	'underscore'

    ]
    ,	function(
        ItemsSearcherItemView
	,	ProductViewsPriceView

	, 	_

    )
    {
        'use strict';

        _.extend( ItemsSearcherItemView.prototype, {

			childViews: _.extend( ItemsSearcherItemView.prototype.childViews,
			{
				'ItemViews.Price': function ()
				{
					return new ProductViewsPriceView({
						model: this.model
					,	origin: 'ITEMCELL_SEARCH'
					});
   				 }
			})

        });
	});
