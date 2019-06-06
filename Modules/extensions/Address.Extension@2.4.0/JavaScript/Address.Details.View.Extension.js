define('Address.Details.View.Extension'
,   [
        'Address.Details.View'

    ,   'underscore'
    ,   'jQuery'
    ]
,   function
    (
        AddressDetailsView
    ,   _
    ,   jQuery
    )
{
    'use strict';

    _.extend(AddressDetailsView.prototype, {

        getContext: _.wrap(AddressDetailsView.prototype.getContext, function(fn) {

            var returnVariable = fn.apply(this, _.toArray(arguments).slice(1))
            ,   attention = this.model.get('attention')
            ,   hasAttention = false;
            
            if (attention) {
                hasAttention = true;
            }

            _.extend(returnVariable, {
                attention: 'Attn: ' + attention
            ,   hasAttention: hasAttention
            });

            return returnVariable;
        })
    })
});