/*
    © 2017 Satellite Commerce
    Better formatting for cart line items
 */

//@module Item.Extension
define(
	'Item.Extension'
,	[
        'Item.KeyMapping.Extension'
	]
,	function (
        ItemKeyMappingExtension
	)
{
	'use strict';

    return {
        ItemKeyMappingExtension: ItemKeyMappingExtension
    }

});