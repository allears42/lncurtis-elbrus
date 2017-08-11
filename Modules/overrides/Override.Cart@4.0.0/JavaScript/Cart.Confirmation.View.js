/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Cart
define('Cart.Confirmation.View'
,	[
		'Transaction.Line.Views.Price.View'
	,	'Backbone.CompositeView'
	,	'Transaction.Line.Views.Options.Selected.View'
    ,	'ProductLine.Sku.View'
	,	'Backbone.CollectionView'

	,	'cart_confirmation_modal.tpl'

	,	'jQuery'
	,	'Backbone'
	,	'underscore'
	,	'Utils'
	]
,	function (
		TransactionLineViewsPriceView
	,	BackboneCompositeView
	,	TransactionLineViewsOptionsSelectedView
    ,   ProductLineSkuView
	,	BackboneCollectionView

	,	cart_confirmation_modal_tpl

	,	jQuery
	,	Backbone
	,	_
	)
{
	'use strict';

	// @class Cart.Confirmation.View Cart Confirmation view @extends Backbone.View
	return Backbone.View.extend({

		// @property {Function} template
		template: cart_confirmation_modal_tpl

		// @property {String} title
	,	title: _('Added to Cart').translate()

	,	modalClass: 'global-views-modal-large'
	
		// @property {String} page_header
	,	page_header: _('Added to Cart').translate()

		// @property {Object} attributes
	,	attributes: {
			'id': 'Cart.Confirmation.View'
		,	'class': 'add-to-cart-confirmation-modal shopping-cart-modal'
		}

		// @property {Object} events
	,	events: {
			'click [data-trigger=go-to-cart]': 'dismisAndGoToCart'
		}

		// @method initialize
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

    ,	destroy: function destroy ()
        {
            this.model.off('change', this.render, this);
            this._destroy();
        }

		// @method dismisAndGoToCart
		// Closes the modal and calls the goToCart
	,	dismisAndGoToCart: function (e)
		{
			e.preventDefault();
			this.$containerModal.modal('hide');
			this.options.layout.goToCart();
		}

		// @property {Object} childViews
	,	childViews: {
				'Line.Price': function ()
				{
                return new TransactionLineViewsPriceView({
                    model: this.model
				,	origin: 'PDPCONFIRMATION'
				});
				}
			,	'Line.SelectedOptions': function ()
				{
					return new TransactionLineViewsOptionsSelectedView({
						model: this.model
					});
						}
			,	'Line.Sku': function ()
				{
					return new ProductLineSkuView({
						model: this.model
					});
				}
		}

		// @method getContext
		// @return {Cart.Confirmation.View.Context}
	,	getContext: function()
		{
			var item = this.line.get('item')
            ,   itemOptions = this.line.get('options')
            ,   customImage = _.first(_.filter(itemOptions, function (option) {
                return option.id == "CUSTCOL_SC_ITEM_IMAGE"
            }));
            
			// @class Cart.Confirmation.View.Context
			return {
                    // @property {LiveOrder.Line.Model} model
                     model: this.model
                     // @property {ImageContainer} thumbnail
                ,	thumbnail: this.model.getThumbnail()
				    // @property {OrderLine.Model} line
				,	line: this.line
					// @property {Item.Model} item
				,	item: item
					// @property {Boolean} showQuantity
				,	showQuantity: (item.get('_itemType') !== 'GiftCert') && (this.line.get('quantity') > 0)
					//@property {String} itemPropSku
				,	itemPropSku: (item.get('_sku'))
                ,	itemName: item.get('_name', true)
                ,   image: (customImage && customImage.value) ? customImage.value : item.get('_thumbnail').url
			};
		}
		// @class Cart.Confirmation.View
	});

});
