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
	,	'Address.Details.View.Extension'
	]
,	function (
		AddressEditViewExtension
	,   AddressEditFieldsViewExtension
	,	AddressDetailsViewExtension

	)
{
	'use strict';

    return {
	    AddressEditViewExtension: AddressEditViewExtension
    ,   AddressEditFieldsViewExtension: AddressEditFieldsViewExtension
	,	AddressDetailsViewExtension: AddressDetailsViewExtension
    }

});