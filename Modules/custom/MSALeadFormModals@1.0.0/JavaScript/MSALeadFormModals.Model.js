define('MSALeadFormModals.Model'
,   [
        'Backbone'
    ,   'underscore'

    ,   'Utils'
    ]
,   function
    (
       Backbone
   ,    _
    )
{
    'use strict';

    return Backbone.Model.extend({

        urlRoot: _.getAbsoluteUrl('services/MSALeadFormModals.Service.ss')

    ,   validation: {
           email: [
                {
                    required: true
                ,   msg: _('Email is required').translate()
                },
                {
                    pattern: 'email'
                ,   msg: _('Email is invalid').translate()
                }
            ]
            ,   custevent_jhm_zip_code: {required: true, msg: _('Zip code is required').translate()}

            // ,   firstname: {required: true, msg: _('First name is required').translate()}
            // ,   lastname: {required: true, msg: _('Last name is required').translate()}
        }
    });
});