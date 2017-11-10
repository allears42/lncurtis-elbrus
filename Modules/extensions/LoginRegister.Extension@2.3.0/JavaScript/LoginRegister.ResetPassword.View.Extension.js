/*
	© 2017 LN Curtis
*/

define(
    'LoginRegister.ResetPassword.View.Extension'
    ,	[
        'LoginRegister.ResetPassword.View'

    ,	'underscore'

    ]
    ,	function(
        LoginRegisterResetPasswordView

    , 	_

    )
    {
        'use strict';

        _.extend( LoginRegisterResetPasswordView.prototype, {

            showSuccess: function()
            {
                var forgot_password_success = '<p class="login-register-reset-password-description">Your password has been reset.</p><br><a class="login-register-reset-password-sign-in button-secondary button-medium" href="/login-register" data-target=".register">Return To Log in</a>';

                this.$('form').empty().html(forgot_password_success);
            }

        });

    });
