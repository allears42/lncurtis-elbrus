/*
	© 2017 LN Curtis
*/

define(
    'Profile.Information.View.Extension'
    ,	[
        'Profile.Information.View'

        ,   'underscore'
    ]
    ,	function(
        ProfileInformationView

        ,   _
    )
    {
        'use strict';

        _.extend( ProfileInformationView.prototype, {

            showSuccess: function ()
            {
                if (this.$savingForm)
                {
                    var global_view_message = new GlobalViewsMessageView({
                        message: _('Profile has been updated.').translate()
                        ,	type: 'success'
                        ,	closable: true
                    });
                    this.showContent();
                    this.$('[data-type="alert-placeholder"]').append(global_view_message.render().$el.html());
                }
            }

        });
    });
