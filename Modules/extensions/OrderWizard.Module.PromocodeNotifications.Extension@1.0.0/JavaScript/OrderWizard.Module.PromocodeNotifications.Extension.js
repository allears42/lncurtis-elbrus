/*
 © 2017 Satellite Commerce
 Enabling "Auto-Apply Promotions" for Elbrus
 */

//@module AutoApplyPromotionsForElbrus: Updates releases prior to Kilimanjaro
// Reference: https://developers.suitecommerce.com/section1500378342

define(
'OrderWizard.Module.PromocodeNotifications.Extension'
,
[
    /*
    'LiveOrder.Model',
    'Transaction.Model',
    'Cart.Detailed.View',
    */
    'Cart.Promocode.List.Item.View',
    /*
    'Cart.Promocode.Notifications.View',
    'SC.Checkout.Configuration.Steps.BillingFirst',
    'SC.Checkout.Configuration.Steps.OPC',
    'SC.Checkout.Configuration.Steps.Standard',
    'OrderWizard.Module.PromocodeNotifications',
    */
    
    'Backbone.CollectionView',
    'jQuery',
    'underscore'

]
,
function (
    /*
    LiveOrderModel,
    TransactionModel,
    CartDetailedView,
    */
    CartPromocodeListItemView,
    /*
    CartPromocodeNotifications,
    CheckoutConfigurationStepsBillingFirst,
    CheckoutConfigurationStepsOPC,
    CheckoutConfigurationStepsStandard,
    OrderWizardModulePromocodeNotification,
    */
    
    BackboneCollectionView,
    $,
    _
)
{
    'use strict';
    
    /*_.extend(CartDetailedView.prototype, {
        
        // #3 MODIFY CART\TEMPLATES\CART_DETAILED.TPL
        template: _.wrap(CartDetailedView.prototype.template, function (fn)
        {
            var template = $(fn.apply(this, _.toArray(arguments).slice(1)));
            
            if (!template.find('div[data-view="Promocode.Notifications"]').length)
            {
                template.find('.cart-detailed-confirm-message').after('<div data-view="Promocode.Notifications"></div>');
            }
            
            return template.prop("outerHTML");
        }),
        
        // #8 MODIFY CART\JAVASCRIPT\CART.DETAILED.VIEW.JS
        initialize: _.wrap(CartDetailedView.prototype.initialize, function (fn)
        {
            fn.apply(this, _.toArray(arguments).slice(1));
            this.model.on('promocodeNotificationShown', this.removePromocodeNotification, this);
        }),
    
        // @method removePromocodeNotification
        // @param String promocode_id
        // @return {Void}
        removePromocodeNotification: function (promocode_id)
        {
            var promocode = _.findWhere(this.model.get('promocodes'), {internalid: promocode_id});
        
            delete promocode.notification;
        },
        
        childViews: _.extend(CartDetailedView.prototype.childViews, {
            
            'Promocode.Notifications': function ()
            {
                
                var promotions = _.filter(this.model.get('promocodes') || [], function (promocode) { return promocode.notification === true; });
                
                if (promotions.length)
                {
                    return new BackboneCollectionView({
                        collection: promotions
                        , viewsPerRow: 1
                        , childView: CartPromocodeNotifications
                        , childViewOptions: {
                            parentModel: this.model
                        }
                    });
                }
            }
        })
        
    });*/
    
    // #4 ADD THE FILE CART\TEMPLATES\CART_PROMOCODE_NOTIFICATIONS.TPL
    /* SEE: ../Modules/custom/OrderWizard.Module.PromocodeNotifications/Templates/cart_promocode_notifications.tpl */
    
    // #5 ADD THE FILE CART\SASS\_CART-PROMOCODE-NOTIFICATIONS.SCSS
    /* SEE: ../Modules/custom/OrderWizard.Module.PromocodeNotifications/Sass/_cart-promocode-notifications.scss */
    
    // #6 MODIFY CART\JAVASCRIPT\CART.PROMOCODE.LIST.ITEM.VIEW.JS
    _.extend(CartPromocodeListItemView.prototype, {
        
        getContext: _.wrap(CartPromocodeListItemView.prototype.getContext, function (fn)
        {
            var returnVariables = fn.apply(this, _.toArray(arguments).splice(1));
    
            var code = this.model.get('code')
            , hide_autoapply_promo = (!_.isUndefined(this.model.get('isautoapplied'))) ? this.model.get('applicabilityreason') === 'DISCARDED_BEST_OFFER' || (this.model.get('isautoapplied') && this.model.get('applicabilitystatus') === 'NOT_APPLIED') : false;
            
            _.extend(returnVariables, {
                showPromo: !!code && !hide_autoapply_promo,
                isEditable: !this.options.isReadOnly && !this.model.get('isautoapplied')
            });
            
            return returnVariables;
        })
    });
    
    // #7 ADD THE FILE CART\JAVASCRIPT\CART.PROMOCODE.NOTIFICATIONS.VIEW.JS
    /* SEE: ../Modules/custom/OrderWizard.Module.PromocodeNotifications/JavaScript/Cart.Promocode.Notifications.View.js */
    
    // the follow function is used to update the configuration steps identified in #9, 10 & 11
    /*function updateCheckoutStep (module, stepName, url, insertIndex, updatePayload)
    {
        insertIndex = insertIndex ? insertIndex : 0;
        updatePayload = updatePayload ? updatePayload : [OrderWizardModulePromocodeNotification, {exclude_on_skip_step: true}];
        
        var checkoutStep =_.chain(module)
            .findWhere({'name': _(stepName).translate()})
            .pick('steps').values().first()
            .findWhere({'url': url})
            .pick('modules').values().first().value();
        
        try {
            checkoutStep ? checkoutStep.splice(insertIndex, 0, updatePayload) : console.log("Error in 'OrderWizard.Module.PromocodeNotification': Couldn't find step!");
        }
        
        catch(error) {
            console.log("Error in 'OrderWizard.Module.PromocodeNotification': Couldn't update step.")
        }
        
    }*/
    
    // #9 MODIFY CHECKOUTAPPLICATION\JAVASCRIPT\SC.CHECKOUT.CONFIGURATION.STEPS.BILLINGFIRST.JS
    /*updateCheckoutStep(CheckoutConfigurationStepsBillingFirst, 'Billing Address', 'billing/address');
    updateCheckoutStep(CheckoutConfigurationStepsBillingFirst, 'Shipping Address', 'shipping/address');
    updateCheckoutStep(CheckoutConfigurationStepsBillingFirst, 'Shipping method', 'shipping/method');
    updateCheckoutStep(CheckoutConfigurationStepsBillingFirst, 'Payment', 'billing');
    updateCheckoutStep(CheckoutConfigurationStepsBillingFirst, 'Review', 'review', 2);*/
    
    // #10 MODIFY CHECKOUTAPPLICATION\JAVASCRIPT\SC.CHECKOUT.CONFIGURATION.STEPS.OPC.JS
    // updateCheckoutStep(CheckoutConfigurationStepsOPC, 'Checkout Information', 'opc', 3);
    
    // #11 MODIFY CHECKOUTAPPLICATION\JAVASCRIPT\SC.CHECKOUT.CONFIGURATION.STEPS.STANDARD.JS
    /*updateCheckoutStep(CheckoutConfigurationStepsStandard, 'Shipping Address', 'shipping/address');
    updateCheckoutStep(CheckoutConfigurationStepsStandard, 'Payment', 'billing');
    updateCheckoutStep(CheckoutConfigurationStepsStandard, 'Review', 'review', 2);*/
    
});
