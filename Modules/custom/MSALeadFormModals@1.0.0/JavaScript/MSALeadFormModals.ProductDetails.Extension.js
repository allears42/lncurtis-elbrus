define('MSALeadFormModals.ProductDetails.Extension'
,   [
        'ProductDetails.Full.View'
    ,   'MSALeadFormModals.Model'
    ,   'MSALeadFormModals.Link.Item.View'
    ]
,   function
    (
        ProductDetailsFullView
    ,   MSALeadFormModalsModel
    ,   MSALeadFormModalsLinkItemView
    )
{
    'use strict';

    _.extend(ProductDetailsFullView.prototype, {

        childViews: _.extend({}, ProductDetailsFullView.prototype.childViews, {

            'MSALeadFormModal.Link': function() {

                var item = this.model.get('item')
                ,   itemId = null;

                if (item) {
                    itemId = item.get('internalid');
                }

                return new MSALeadFormModalsLinkItemView({
                    application: this.application
                ,   model:  new MSALeadFormModalsModel()
                ,   itemId: itemId
                });
            }
        })
    })

});