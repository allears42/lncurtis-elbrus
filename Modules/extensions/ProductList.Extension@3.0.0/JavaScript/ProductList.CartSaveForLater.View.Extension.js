/*
	© 2017 LN Curtis
*/

define(
    'ProductList.CartSaveForLater.View.Extension'
    ,	[
        'ProductList.CartSaveForLater.View'
    ,   'ProductList.Model'
    ,	'ProductList.DetailsLater.View'
    ,   'ProductList.Item.Model'
    ,   'Profile.Model'
    ,   'SC.Configuration'

    ,	'underscore'
    ,   'jQuery'

    ]
    ,	function(
        ProductListCartSaveForLaterView
    ,   ProductListModel
    ,   ProductListDetailsLaterView
    ,   ProductListItemModel
    ,   ProfileModel
    ,   Configuration

    , 	_
    ,   jQuery

    )
    {
        'use strict';

        _.extend( ProductListCartSaveForLaterView.prototype, {

            saveForLaterItem: function (e)
            {
                e.preventDefault();

                if (!this.validateLogin())
                {
                    return;
                }

                var cart_line = this.model.get('lines').get(jQuery(e.target).data('internalid'))
                    ,	internalid = cart_line.get('internalid')
                    ,	whole_promise = jQuery.Deferred()
                    ,	self = this;

                jQuery.when(this.model.removeLine(cart_line), self.addItemToList(cart_line)).then(function()
                {
                    self.showConfirmationMessage(_(Configuration.get('productList.itemSavedForLaterConfirmationText', '')).translate());

                    whole_promise.resolve();
                });

                this.disableElementsOnPromise(whole_promise, '#' + internalid + ' button');
            }

        });

    });
