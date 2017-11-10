/*
	© 2017 LN Curtis
*/

define(
    'Header.MiniCartItemCell.View.Extension'
    ,	[
        'Header.MiniCartItemCell.View'
	,	'Backbone'
	,	'Backbone.CollectionView'
	,	'ProductLine.Stock.View'
	,	'Transaction.Line.Views.Options.Selected.View'

	,	'underscore'

    ]
    ,	function(
        HeaderMiniCartItemCellView
	,	Backbone
	,	BackboneCollectionView
	,	ProductLineStockView
	,	TransactionLineViewsOptionsSelectedView

	, 	_

    )
    {
        'use strict';

        _.extend( HeaderMiniCartItemCellView.prototype, {

            events: _.extend( HeaderMiniCartItemCellView.prototype.events,
            {
                'contextmenu img': 'preventContextMenu'
            })

		,	childViews: _.extend( HeaderMiniCartItemCellView.prototype.childViews,
			{
                'Item.Stock': function ()
                {
                    return new ProductLineStockView({
						model: this.model.get('item'),
						origin: "MINI_CART",
						application:
						this.application
                    });
                }
            })

		,	getContext: _.wrap( HeaderMiniCartItemCellView.prototype.getContext, function(fn)
			{
        		var returnVariable = fn.apply(this, _.toArray(arguments).slice(1))
				,   itemOptions = this.model.get('item').get('options')
				,   customImage = _.first(_.filter(itemOptions.models, function (option)
					{
						return option.get('cartOptionId').toUpperCase() === "CUSTCOL_SC_ITEM_IMAGE"
					}));
                
                _.extend(returnVariable , {
                    image: (customImage && customImage.get('value')) ? customImage.get('value') : this.model.get('item').get('_thumbnail').url
                });

                return returnVariable
            })

        ,   preventContextMenu: function (e)
            {
                e.preventDefault();
                console.error('You\'re attempting to access an image that is copyrighted by LNCurtis.com');
                return false;
            }

        });

    });
