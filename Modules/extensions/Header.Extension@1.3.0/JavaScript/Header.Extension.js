/*
	© 2017 LN Curtis
*/

define(
    'Header.Extension'
    ,	[
        'Header.Logo.View.Extension'
    ,   'Header.Menu.MyAccount.View.Extension'
    ,   'Header.Menu.View.Extension'
    ,   'Header.MiniCart.View.Extension'
    ,   'Header.MiniCartItemCell.View.Extension'
    ,   'Header.Profile.View'
    ,   'Header.View.Extension'
        
    ]
    ,	function(
        HeaderLogoViewExtension
    ,   HeaderMenuMyAccountViewExtension
    ,   HeaderMenuViewExtension
    ,   HeaderMiniCartViewExtension
    ,   HeaderMiniCartItemCellView
    ,   HeaderProfileView
    ,   HeaderViewExtension
    )
    {
        'use strict';

        return {
                HeaderLogoViewExtension: HeaderLogoViewExtension
            ,   HeaderMenuMyAccountViewExtension: HeaderMenuMyAccountViewExtension
            ,   HeaderMenuViewExtension: HeaderMenuViewExtension
            ,   HeaderMiniCartViewExtension: HeaderMiniCartViewExtension
            ,   HeaderMiniCartItemCellView: HeaderMiniCartItemCellView
            ,   HeaderProfileView: HeaderProfileView
            ,   HeaderViewExtension: HeaderViewExtension
        }

    });
