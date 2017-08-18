/*
	© 2017 LN Curtis
	Custom extension logic for Cart.Confirmation.View.Extension
*/

define(
	'Cart.Confirmation.View.Extension'
,	[
		'Cart.Confirmation.View'
	,	'Transaction.Line.Views.Price.View'
	,	'Backbone.CompositeView'

	,	'underscore'
	]
,	function(
        CartConfirmationViewExtension
	,	TransactionLineViewsPriceView
	,	BackboneCompositeView
	, 	_
	)
{
	'use strict';
	
	_.extend( CartConfirmationViewExtension.prototype, {

		events: _.extend( CartConfirmationViewExtension.prototype.events, {
            'click [data-trigger=go-to-cart]': 'dismissAndGoToCart'
        })

	,	initialize: function (options)
        {

            this.model.on('change', this.render, this);

            this.model = options.model;
            this.line = this.model.getLatestAddition();

            var self = this
                ,	optimistic = this.model.optimistic;

            if (optimistic && optimistic.promise && optimistic.promise.state() === 'pending')
            {
                this.line = options.model.optimisticLine;
                delete this.model.optimisticLine;

                optimistic.promise.done(function ()
                {
                    self.line = options.model.getLatestAddition();
                    self.render();
                });
            }

            BackboneCompositeView.add(this);
        }

        // @method dismissAndGoToCart
        // Closes the modal and calls the goToCart
	,	dismissAndGoToCart: function (e)
        {
            e.preventDefault();
            this.$containerModal.modal('hide');
            this.options.layout.goToCart();
        }

	,	childViews: _.extend( CartConfirmationViewExtension.prototype.childViews,
        {
            'Line.Price': function ()
            {
                return new TransactionLineViewsPriceView({
                    model: this.model
				,	origin: 'PDPCONFIRMATION'
                });
			}
        })

	,	getContext: function()
        {
            var item = this.line.get('item')
                ,   itemOptions = this.line.get('options')
                ,   customImage = _.first(_.filter(itemOptions, function (option) {
                return option.id === "CUSTCOL_SC_ITEM_IMAGE"
            }));

            // @class Cart.Confirmation.View.Context
            return {

                model: this.model
            ,	thumbnail: this.model.getThumbnail()
            ,	line: this.line
            ,	item: item
            ,	showQuantity: (item.get('_itemType') !== 'GiftCert') && (this.line.get('quantity') > 0)
            ,	itemPropSku: (item.get('_sku'))
            ,	itemName: item.get('_name', true)
            ,   image: (customImage && customImage.value) ? customImage.value : item.get('_thumbnail').url

            };
        }
	});
});
