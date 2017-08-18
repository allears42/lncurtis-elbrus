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

            events:
			{
                'contextmenu img': 'preventContextMenu'
            }

		,	childViews: _.extend( HeaderMiniCartItemCellView.prototype.childViews,
			{
                'Item.SelectedOptions': function ()
                {
                    return new BackboneCollectionView({
                        collection: new Backbone.Collection(this.model.get('item').getPosibleOptions())
                        ,	childView: TransactionLineViewsOptionsSelectedView
                        ,	viewsPerRow: 1
                        ,	childViewOptions: {
                            cartLine: this.model
                        }
                    });
                }

                , 'Item.Stock': function ()
                {
                    return new ProductLineStockView({
						model: this.model.get('item'),
						origin: "MINI_CART",
						application:
						this.application
                    });
                }
            })

		,   preventContextMenu: function (e)
			{
                e.preventDefault();
                console.error('You\'re attempting to access an image that is copyrighted by LNCurtis.com');
                return false;
            }

		,	getContext: _.wrap( HeaderMiniCartItemCellView.prototype.getConetxt, function(fn)
			{

                var self = this
				,   returnVariable = fn.apply(self, _.toArray(arguments).slice(1))
				,   itemOptions = this.model.get('options')
				,   customImage = _.first(_.filter(itemOptions, function (option)
					{
						return option.id == "CUSTCOL_SC_ITEM_IMAGE"
					}));

                _.extend(returnVariable , {
                    image: (customImage && customImage.value) ? customImage.value : item.get('_thumbnail').url
                });

                return returnVariable
            })

        });

    });
