define('OrderWizard.Module.ShipComplete'
,   [
        'Wizard.Module'
    ,   'underscore'
    ,   'jQuery'
    ,   'order_wizard_ship_complete.tpl'
    ]
,   function
    (
        WizardModule
    ,   _
    ,   jQuery
    ,   order_wizard_ship_complete_tpl
    )
{
    'use strict';

    return WizardModule.extend({

        template: order_wizard_ship_complete_tpl

    ,   initialize: function () {
            WizardModule.prototype.initialize.apply(this, arguments);
        }
    });
});