/*
	© 2017 LN Curtis
*/

define(
    'LoginRegister.ForgotPassword.View.Extension'
    ,	[
        'LoginRegister.ForgotPassword.View'
		
		,	'GlobalViews.Message.View'
        ,	'underscore'

    ]
    ,	function(
        LoginRegisterForgotPasswordView

        , 	GlobalViewsMessageView
        , 	_

    )
    {
        'use strict';

        _.extend( LoginRegisterForgotPasswordView.prototype, {

            showSuccess: function()
            {
                var global_view_message = new GlobalViewsMessageView({
                    message: _('We sent an email with instructions on how to reset your password to <b>$(0)</b>. If you do not receive the email in a few minutes, please check your spam folder.').translate(this.model.get('email'))
                    ,	type: 'success'
                });

                this.$('form').empty().html(global_view_message.render().$el.html());
            }

        });

    });
