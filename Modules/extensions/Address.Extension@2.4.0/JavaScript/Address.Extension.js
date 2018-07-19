/*
    © 2017 JHM Services
    Adding manage state to addresses when in checkout flow
 */

//@module Address.Extension
define(
	'Address.Extension'
,	[
        'Address.Edit.View.Extension'
    ,   'Address.Edit.Fields.View.Extension'
	]
,	function (
		AddressEditViewExtension
	,   AddressEditFieldsViewExtension

	)
{
	'use strict';

    return {
	    AddressEditViewExtension: AddressEditViewExtension
    ,   AddressEditFieldsViewExtension: AddressEditFieldsViewExtension
    }

});