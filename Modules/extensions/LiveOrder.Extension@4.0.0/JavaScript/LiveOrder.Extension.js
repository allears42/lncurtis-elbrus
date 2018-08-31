define('LiveOrder.Extension'
,   [
        'LiveOrder.Model'
    ,   'underscore'
    ]
,   function
    (
        LiveOrderModel
    ,   _
    )
{
    'use strict';

    _.extend(LiveOrderModel.prototype, {

        // Return item ID or matrix parent ID if available
        getItemsIds: function getItemsIds ()
        {
            var item
            ,   matrixParent
            ,   matrixParentId
            ,   itemId;

            return this.get('lines').map(function (line)
            {
                item = line.get('item');
                itemId = item.get('internalid');
                matrixParent = item.get('_matrixParent');

                if(matrixParent) {

                    matrixParentId = matrixParent.get('internalid');
                    if(matrixParentId) {
                        itemId = matrixParentId;
                    }
                }
                return itemId;
            });
        }
    });
});