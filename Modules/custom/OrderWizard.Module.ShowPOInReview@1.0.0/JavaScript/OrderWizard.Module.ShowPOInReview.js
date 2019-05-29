define('OrderWizard.Module.ShowPOInReview'
,   [
        'Wizard.Module'
    ,   'order_wizard_show_po_in_review.tpl'
    ]
,   function
    (
        WizardModule
    ,   order_wizard_show_po_in_review_tpl
    )
{
    'use strict';

    return WizardModule.extend({

        template: order_wizard_show_po_in_review_tpl

    ,   events: {
            'blur [name="purchase-order-number"]': 'setFieldValueOnBlur'
        }

    ,   initialize: function()
        {
            WizardModule.prototype.initialize.apply(this, arguments);
        }

    ,   setFieldValueOnBlur: function(e)
        {
            var $target = jQuery(e.currentTarget)
            ,   purchase_order_number = $target.val().trim();

            this.wizard.model.set('purchasenumber', purchase_order_number);
        }


    ,   submit: function ()
        {

            var purchase_order_number = this.$('[name=purchase-order-number]').val() || '';

            this.wizard.model.set('purchasenumber', purchase_order_number);

            return jQuery.Deferred().resolve();
        }

    ,   getContext: function() {

            return {
                purchasenumber: this.model.get('purchasenumber')
            };
        }
    })
});