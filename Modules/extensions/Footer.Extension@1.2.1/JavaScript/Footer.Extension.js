/*
	© 2017 LN Curtis
*/

define(
    'Footer.Extension'
    ,	[
        'Footer.Simplified.View.Extension'
    ,   'Footer.View.Extension'
    ]
    ,	function(
        FooterSimplifiedViewExtension
    ,   FooterViewExtension
    )
    {
        'use strict';

        return {
            FooterSimplifiedViewExtension: FooterSimplifiedViewExtension
        ,   FooterViewExtension: FooterViewExtension
        }

    });
