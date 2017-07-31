/*
    © 2017 Satellite Commerce
    Better formatting for cart line items
 */

//@module ProductList.Extension
define(
	'Wizard.Extension'
,	[
        'Wizard.Step.OOSMessage'
    ,   'Wizard.Router.OOSMessage'
	]
,	function (
		WizardStepOOSMessage
	,   WizardRouterOOSMessage

	)
{
	'use strict';

    return {
	    WizardStepOOSMessage: WizardStepOOSMessage
    ,   WizardRouterOOSMessage: WizardRouterOOSMessage
    }

});