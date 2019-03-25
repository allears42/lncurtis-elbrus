define('MSALeadFormModals.Link.Item.View'
,   [
        'MSALeadFormModals.Link.View'
    ]
,   function
    (
        MSALeadFormModalsLinkView
    )
{
    'use strict';

    return MSALeadFormModalsLinkView.extend({

        getContext: function()
        {
            var displayLink = false
            ,   items = this.model.get('items');

            if (items && this.options.itemId) {

                items = items.split(',');

                if (items.indexOf(this.options.itemId.toString()) >= 0) {
                    displayLink = true;
                }
            }

            return {
                displayLink: displayLink
            ,   campaignTitle: this.model.get('campaignTitle') || ''
            }
        }
    });
});