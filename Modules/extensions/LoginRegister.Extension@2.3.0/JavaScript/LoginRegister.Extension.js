/*
	© 2017 LN Curtis
*/

define(
    'LoginRegister.Extension'
    ,	[
        'LoginRegister.ForgotPassword.View.Extension'
    ,   'LoginRegister.Login.View.Extension'
    ,   'LoginRegister.Register.View.Extension'
    ,   'LoginRegister.ResetPassword.View.Extension'
    ,   'LoginRegister.View.Extension'
        
    ]
    ,	function(
        LoginRegisterForgotPasswordViewExtension
    ,   LoginRegisterLoginViewExtension
    ,   LoginRegisterRegisterViewExtension
    ,   LoginRegisterResetPasswordViewExtension
    ,   LoginRegisterViewExtension
    )
    {
        'use strict';

        return {
            LoginRegisterForgotPasswordViewExtension: LoginRegisterForgotPasswordViewExtension
        ,   LoginRegisterLoginViewExtension: LoginRegisterLoginViewExtension
        ,   LoginRegisterRegisterViewExtension: LoginRegisterRegisterViewExtension
        ,   LoginRegisterResetPasswordViewExtension: LoginRegisterResetPasswordViewExtension
        ,   LoginRegisterViewExtension: LoginRegisterViewExtension
        }

    });
