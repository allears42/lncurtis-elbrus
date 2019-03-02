define('MSALeadFormModals.ProductDetails.Extension'
,   [
        'ProductDetails.Full.View'
    ,   'MSALeadFormModals.Link.View'
    ,   'MSALeadFormModals.Model'
    ]
,   function
    (
        ProductDetailsFullView
    ,   MSALeadFormModalsLinkView
    ,   MSALeadFormModalsModel
    )
{
    'use strict';

    _.extend(ProductDetailsFullView.prototype, {

        childViews: _.extend({}, ProductDetailsFullView.prototype.childViews, {

            'MSALeadFormModal.Link': function() {
                console.log('ENTER MSA LEAD LINK VIEW ---------------');
                console.log('ITEM MODEL: ', this.model);

                var item = this.model.get('item')
                ,   itemId = null;

                if (item) {
                    itemId = item.get('internalid');
                }

                return new MSALeadFormModalsLinkView({
                    application: this.application
                ,   model:  new MSALeadFormModalsModel()
                ,   itemId: itemId
                });
            }
        })
    })

});