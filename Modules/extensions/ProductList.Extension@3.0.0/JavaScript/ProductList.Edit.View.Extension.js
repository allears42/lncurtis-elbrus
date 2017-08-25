/*
	© 2017 LN Curtis
*/

define(
    'ProductList.Edit.View.Extension'
    ,	[
        'ProductList.Edit.View'

        ,	'underscore'

    ]
    ,	function(
        ProductListEditView

        , 	_

    )
    {
        'use strict';

        _.extend( ProductListEditView.prototype, {

            onSaveComplete: function()
            {
                var self = this;

                if (_.isArray(self.model.get('items')))
                {
                    self.model.set('items', new ProductListItemCollection(self.model.get('items')));
                }

                self.$containerModal && self.$containerModal.modal('hide');
                var messaing = _(Configuration.get('productList.listUpdatedText', '')).translate(1, self.model.get('internalid'), self.model.get('name'));

                if (self.isEdit)
                {
                    self.application.ProductListModule.Utils.getProductLists().add(self.model, {merge: true});
                    MenuTreeView.getInstance().updateMenuItemsUI();
                    self.parentView.render();

                    if (self.parentView.$el.hasClass('ProductListDetailsView'))
                    {

                        self.parentView.showConfirmationMessage(
                            _(messaing).translate()
                        );
                    }
                    else
                    {
                        messaing = _(Configuration.get('productList.listAddedText', '')).translate(1, self.model.get('internalid'), self.model.get('name'));
                        self.parentView.showConfirmationMessage(
                            _(messaing).translate(self.model.get('internalid'), self.model.get('name'))
                        );
                    }
                }
                else
                {
                    self.application.ProductListModule.Utils.getProductLists().add(self.model);
                    MenuTreeView.getInstance().updateMenuItemsUI();
                    self.parentView.render();
                    self.parentView.showConfirmationMessage(
                        _(messaing).translate(self.model.get('internalid'), self.model.get('name'))
                    );
                }
                self.parentView.highlightList && self.parentView.highlightList(self.model.get('internalid'));
            }

        });

    });
