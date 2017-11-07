// @module OrderWizard.Module.PromocodeNotifications
define(
'OrderWizard.Module.PromocodeNotifications'
, [
    'Wizard.Module'
    , 'SC.Configuration'
    , 'Backbone.CollectionView'
    , 'Cart.Promocode.Notifications.View'
    
    , 'order_wizard_promocodenotifications.tpl'
    
    , 'underscore'
    , 'jQuery'
]
, function (
    WizardModule
    , Configuration
    , BackboneCollectionView
    , CartPromocodeNotificationsView
    , order_wizard_promocodenotifications_tpl

    , _
    , jQuery

)
{
    'use strict';
    // @class OrderWizard.Module.PromocodeNotifications @extends Wizard.Module
    return WizardModule.extend({
        
        //@property {Function} template
        template: order_wizard_promocodenotifications_tpl
        
        //@method initialize
        , initialize: function initialize ()
        {
            WizardModule.prototype.initialize.apply(this, arguments);
            
            this.wizard.model.on('change:promocodes', this.render, this);
            
            this.wizard.model.on('promocodeNotificationShown', this.removePromocodeNotification, this);
            
            this._render();
        }
        
        , render: function ()
        {
            var promocodes = _.filter(this.wizard.model.get('promocodes') || [], function (promocode) { return promocode.notification === true; });
            
            if (promocodes.length)
            {
                
                var message_collection_view = new BackboneCollectionView({
                    collection: promocodes
                    , viewsPerRow: 1
                    , childView: CartPromocodeNotificationsView
                    , childViewOptions: {
                        parentModel: this.wizard.model
                    }
                });
                
                message_collection_view.render();
                
                jQuery('[data-type="Promocode.Notifications"]').html(message_collection_view.$el.html());
            }
        }
        
        // @method removePromocodeNotification
        // @param String promocode_id
        // @return {Void}
        , removePromocodeNotification: function (promocode_id)
        {
            var promocode = _.findWhere(this.wizard.model.get('promocodes'), {internalid: promocode_id});
            
            delete promocode.notification;
        }
        
        //@method getContext
        //@returns {OrderWizard.Module.PromocodeNotifications.Context}
        , getContext: function getContext ()
        {
            //@class OrderWizard.Module.PromocodeNotifications.Context
            return {};
            //@class OrderWizard.Module.PromocodeNotifications
        }
        
    });
});