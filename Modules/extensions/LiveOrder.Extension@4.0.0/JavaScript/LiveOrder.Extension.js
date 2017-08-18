/*
	© 2017 LN Curtis
*/

define(
    'LiveOrder.Extension'
    ,	[
        'LiveOrder.Line.Model.Extension'
    ]
    ,	function(
        LiveOrderLineModelExtension
    )
    {
        'use strict';

        return {
            LiveOrderLineModelExtension: LiveOrderLineModelExtension
        }

    });
