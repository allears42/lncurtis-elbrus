/*
	© 2017 LN Curtis
*/

define(
    'ProductList.ControlSingle.View.Extension'
    ,	[
        'ProductList.ControlSingle.View'
    ,   'ProductList.Control.View'
    ,   'SC.Configuration'

    ,	'underscore'

    ]
    ,	function(
        ProductListControlSingleView
    ,   ControlView
    ,   Configuration

    , 	_

    )
    {
        'use strict';

        _.extend( ProductListControlSingleView.prototype, {

            isReadyForList: ControlView.prototype.isReadyForList

        ,   render: _.wrap( ProductListControlSingleView.prototype.render, function(fn)
            {
                var self = this;
                fn.apply(self, _.toArray(arguments).slice(1));

                if (!self.isReadyForList())
                {
                    self.$('[data-action="add-product-to-single-list"]').attr('disabled', 'true');
                }

            })

        ,	renderAfterAdded: function (self)
            {
                if (!this.validateGiftCertificate(self.product))
                {
                    return;
                }

                self.addItemToList(self.product, self.single_list);
                self.render();

                var list = this.model;
                self.saveAndShowConfirmationMessage(_(Configuration.get('productList.itemAddedConfirmationText', '')).translate(list.get('internalid'), list.get('name')));

                this.$('[data-action="add-product-to-single-list"]').attr('disabled', 'true');
            }

        });

    });
