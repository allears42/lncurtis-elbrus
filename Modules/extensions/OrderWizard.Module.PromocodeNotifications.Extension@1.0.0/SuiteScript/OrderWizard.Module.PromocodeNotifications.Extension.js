/*
 © 2017 Satellite Commerce
 Enabling "Auto-Apply Promotions" for Elbrus
 */

//@module AutoApplyPromotionsForElbrus: Updates releases prior to Kilimanjaro
// Reference: https://developers.suitecommerce.com/section1500378342

define( 'OrderWizard.Module.PromocodeNotifications.Extension',
[
    'LiveOrder.Model',
    'Transaction.Model',
    
    'underscore'
]
,
function (
    LiveOrderModel,
    TransactionModel,
  
    _
    )
    {
        'use strict';
        
        // REFERENCE: ..\Modules\overrides\Override.LiveOrder@4.0.0\SuiteScript\LiveOrder.Model.js
        
        /* #1 MODIFY LIVEORDER\SUITESCRIPT\LIVEORDER.MODEL.JS */
        /*_.extend(LiveOrderModel.prototype, {
            
            update: function update (data)
            {
                var current_order = this.get();
                this.setOldPromocodes();
                
                // Only do this if it's capable of shipping multiple items.
                if (this.isMultiShippingEnabled)
                {
                    if (this.isSecure && ModelsInit.session.isLoggedIn2())
                    {
                        ModelsInit.order.setEnableItemLineShipping(!!data.ismultishipto);
                        if (!current_order.ismultishipto && data.ismultishipto)
                        {
                            this.automaticallyRemovedPromocodes = this.getAutomaticallyRemovedPromocodes(current_order);
                        }
                    }
                    
                    // Do the following only if multishipto is active (if the data received determine that MST is enabled and pass the MST Validation)
                    if (data.ismultishipto)
                    {
                        ModelsInit.order.removeShippingAddress();
                        
                        ModelsInit.order.removeShippingMethod();
                        
                        this.splitLines(data, current_order);
                        
                        this.setShippingAddressAndMethod(data, current_order);
                    }
                }
                
                if (!this.isMultiShippingEnabled || !data.ismultishipto)
                {
                    this.setShippingAddress(data, current_order);
                    
                    this.setShippingMethod(data, current_order);
                }
                
                this.setPromoCodes(data, current_order);
                
                this.setBillingAddress(data, current_order);
                
                this.setPaymentMethods(data, current_order);
                
                this.setPurchaseNumber(data, current_order);
                
                this.setTermsAndConditions(data, current_order);
                
                this.setTransactionBodyField(data, current_order);
            },
            
            confirmationCreateResult: function confirmationCreateResult (placed_order)
            {
                var self = this
                , result = {
                    internalid: placed_order.getId()
                    , tranid: placed_order.getFieldValue('tranid')
                    , summary: {
                        subtotal: Utils.toCurrency(placed_order.getFieldValue('subtotal'))
                        , subtotal_formatted: Utils.formatCurrency(placed_order.getFieldValue('subtotal'))
                        
                        , taxtotal: Utils.toCurrency(placed_order.getFieldValue('taxtotal'))
                        , taxtotal_formatted: Utils.formatCurrency(placed_order.getFieldValue('taxtotal'))
                        
                        , shippingcost: Utils.toCurrency(placed_order.getFieldValue('shippingcost'))
                        , shippingcost_formatted: Utils.formatCurrency(placed_order.getFieldValue('shippingcost'))
                        
                        , handlingcost: Utils.toCurrency(placed_order.getFieldValue('althandlingcost'))
                        , handlingcost_formatted: Utils.formatCurrency(placed_order.getFieldValue('althandlingcost'))
                        
                        , discounttotal: Utils.toCurrency(placed_order.getFieldValue('discounttotal'))
                        , discounttotal_formatted: Utils.formatCurrency(placed_order.getFieldValue('discounttotal'))
                        
                        , giftcertapplied: Utils.toCurrency(placed_order.getFieldValue('giftcertapplied'))
                        , giftcertapplied_formatted: Utils.formatCurrency(placed_order.getFieldValue('giftcertapplied'))
                        
                        , total: Utils.toCurrency(placed_order.getFieldValue('total'))
                        , total_formatted: Utils.formatCurrency(placed_order.getFieldValue('total'))
                    }
                }
                , i = 0;
                
                result.promocodes = [];
                
                var promocode = placed_order.getFieldValue('promocode');
                
                //If legacy behavior is present & a promocode is applied this IF will be true
                //In case stackable promotions are enable this.record.getFieldValue('promocode') returns null
                if (promocode)
                {
                    result.promocodes.push({
                        internalid: promocode
                        , code: placed_order.getFieldText('couponcode')
                        , isvalid: true
                        , discountrate_formatted: ''
                    });
                }
                
                for (i = 1; i <= placed_order.getLineItemCount('promotions'); i++)
                {
                    if (placed_order.getLineItemValue('promotions', 'applicabilitystatus', i) !== 'NOT_APPLIED')
                    {
                        result.promocodes.push({
                            internalid: placed_order.getLineItemValue('promotions', 'couponcode', i)
                            , code: placed_order.getLineItemValue('promotions', 'couponcode_display', i)
                            , isvalid: placed_order.getLineItemValue('promotions', 'promotionisvalid', i) === 'T'
                            , discountrate_formatted: '' //placed_order.getLineItemValue('promotions', 'discountrate', i)
                        });
                    }
                }
                
                result.paymentmethods = [];
                
                for (i = 1; i <= placed_order.getLineItemCount('giftcertredemption'); i++)
                {
                    result.paymentmethods.push({
                        type: 'giftcertificate'
                        , giftcertificate: {
                            code: placed_order.getLineItemValue('giftcertredemption', 'authcode_display', i),
                            amountapplied: placed_order.getLineItemValue('giftcertredemption', 'authcodeapplied', i),
                            amountapplied_formatted: Utils.formatCurrency(placed_order.getLineItemValue('giftcertredemption', 'authcodeapplied', i)),
                            amountremaining: placed_order.getLineItemValue('giftcertredemption', 'authcodeamtremaining', i),
                            amountremaining_formatted: Utils.formatCurrency(placed_order.getLineItemValue('giftcertredemption', 'authcodeamtremaining', i)),
                            originalamount: placed_order.getLineItemValue('giftcertredemption', 'giftcertavailable', i),
                            originalamount_formatted: Utils.formatCurrency(placed_order.getLineItemValue('giftcertredemption', 'giftcertavailable', i))
                        }
                    });
                }
                
                result.lines = [];
                for (i = 1; i <= placed_order.getLineItemCount('item'); i++)
                {
                    
                    var line_item = {
                        item: {
                            id: placed_order.getLineItemValue('item', 'item', i)
                            , type: placed_order.getLineItemValue('item', 'itemtype', i)
                        }
                        , quantity: parseInt(placed_order.getLineItemValue('item', 'quantity', i), 10)
                        , rate: parseInt(placed_order.getLineItemValue('item', 'rate', i), 10)
                        , options: self.parseLineOptionsFromSuiteScript(placed_order.getLineItemValue('item', 'options', i))
                    };
                    
                    if (self.isPickupInStoreEnabled)
                    {
                        if (placed_order.getLineItemValue('item', 'itemfulfillmentchoice', i) === '1')
                        {
                            line_item.fulfillmentChoice = 'ship';
                        }
                        else if (placed_order.getLineItemValue('item', 'itemfulfillmentchoice', i) === '2')
                        {
                            line_item.fulfillmentChoice = 'pickup';
                        }
                    }
                    
                    result.lines.push(line_item);
                }
                
                StoreItem.preloadItems(_(result.lines).pluck('item'));
                
                _.each(result.lines, function (line)
                {
                    line.item = StoreItem.get(line.item.id, line.item.type);
                }
                );
                
                return result;
            },
            
            addLines: function addLines (lines_data)
            {
                var items = []
                , self = this;
                
                this.setOldPromocodes();
                
                _.each(
                lines_data,
                function (line_data)
                {
                    var item = {
                        internalid: line_data.item.internalid.toString()
                        , quantity: _.isNumber(line_data.quantity) ? parseInt(line_data.quantity, 10) : 1
                        , options: self.parseLineOptionsToCommerceAPI(line_data.options)
                    };
                    
                    if (self.isPickupInStoreEnabled && line_data.fulfillmentChoice === 'pickup' && line_data.location)
                    {
                        item.fulfillmentPreferences = {
                            fulfillmentChoice: 'pickup'
                            , pickupLocationId: parseInt(line_data.location, 10)
                        };
                    }
                    
                    items.push(item);
                }
                );
                
                var lines_ids = ModelsInit.order.addItems(items)
                , latest_addition = _.last(lines_ids).orderitemid
                // Stores the current order
                , lines_sort = this.getLinesSort();
                
                lines_sort.unshift(latest_addition);
                this.setLinesSort(lines_sort);
                
                ModelsInit.context.setSessionObject('latest_addition', latest_addition);
                
                return lines_ids;
            },
            
            removeLine: function removeLine (line_id)
            {
                this.setOldPromocodes();
                // Removes the line
                ModelsInit.order.removeItem(line_id);
                
                // Stores the current order
                var lines_sort = this.getLinesSort();
                lines_sort = _.without(lines_sort, line_id);
                this.setLinesSort(lines_sort);
            },
            
            getPromoCodes: function getPromoCodes (order_fields)
            {
                var result = []
                , self = this;
                
                if (order_fields.promocodes && order_fields.promocodes.length)
                {
                    _.each(order_fields.promocodes, function (promo_code)
                    {
                        // @class LiveOrder.Model.PromoCode
                        var promocode = {
                            // @property {String} internalid
                            internalid: promo_code.internalid
                            // @property {String} code
                            , code: promo_code.promocode
                            // @property {Boolean} isvalid
                            , isvalid: promo_code.isvalid === 'T'
                            // @property {String} discountrate_formatted
                            , discountrate_formatted: ''
                            , errormsg: promo_code.errormsg
                            , name: promo_code.discount_name
                            , rate: promo_code.discount_rate
                            , type: promo_code.discount_type
                        };
                        
                        if (!_.isUndefined(promo_code.is_auto_applied))
                        {
                            // @property {Boolean} isautoapplied
                            promocode.isautoapplied = promo_code.is_auto_applied;
                            // @property {String} applicabilitystatus
                            promocode.applicabilitystatus = (
                            promo_code.applicability_status
                            ) ? promo_code.applicability_status : '';
                            // @property {String} applicabilityreason
                            promocode.applicabilityreason = (
                            promo_code.applicability_reason
                            ) ? promo_code.applicability_reason : '';
                        }
                        
                        if (!_.isUndefined(promo_code.is_auto_applied) && !_.isUndefined(promo_code.applicability_status) && !_.isUndefined(promo_code.applicability_reason) && !_.isUndefined(self.old_promocodes))
                        {
                            var old_promocode = (self.old_promocodes) ? _.find(self.old_promocodes, function (old_promo_code)
                            {
                                return old_promo_code.internalid === promo_code.internalid;
                            }) : '';
                            
                            if (!old_promocode || old_promocode.applicability_status !== promo_code.applicability_status || (!promo_code.is_auto_applied && promo_code.applicability_reason !== old_promocode.applicability_reason))
                            {
                                promocode.notification = true;
                            }
                        }
                        
                        result.push(promocode);
                    }
                    );
                    
                    delete this.old_promocodes;
                }
                
                return result;
            },
            
            // @method setOldPromocodes sets a local instance of the order's promocodes, used to be able to detect changes in a promocode.
            setOldPromocodes: function setOldPromocodes ()
            {
                var order_fields = this.getFieldValues();
                this.old_promocodes = order_fields.promocodes;
            }
        });*/
        
        // REFERENCE: ..\SuiteScript\Transaction.Model.js
        
        /* #2 MODIFY TRANSACTION\SUITESCRIPT\TRANSACTION.MODEL.JS */
       /* _.extend(TransactionModel.prototype, {
            
            getRecordPromocodes: function ()
            {
                //@class Transaction.Model.Get.Result
                //@property {Array<Transaction.Model.Get.Promocode>} promocodes
                this.result.promocodes = [];
                
                var promocode = this.record.getFieldValue('promocode');
                
                //If legacy behavior is present & a promocode is applied this IF will be true
                //In case stackable promotions are enable this.record.getFieldValue('promocode') returns null
                if (promocode)
                {
                    if (this.record.getLineItemValue('promotions', 'applicabilitystatus', i) !== 'NOT_APPLIED')
                    {
                        this.result.promocodes.push({
                            //@class Transaction.Model.Get.Promocode
                            //@property {String} internalid
                            internalid: this.record.getLineItemValue('promotions', 'couponcode', i)
                            //@property {String} code
                            , code: this.record.getLineItemValue('promotions', 'couponcode_display', i)
                            //@property {Boolean} isvalid
                            , isvalid: this.record.getLineItemValue('promotions', 'promotionisvalid', i) === 'T'
                            //@property {String} discountrate_formatted
                            , discountrate_formatted: ''//this.record.getLineItemValue('promotions', 'discountrate', i)
                        });
                    }
                }
                //otherwise we change for the list of stackable promotions. If it is the legacy (not stackable promotions) code, the
                //this.record.getLineItemCount('promotions') will return 0
                for (var i = 1; i <= this.record.getLineItemCount('promotions'); i++)
                {
                    this.result.promocodes.push({
                        //@class Transaction.Model.Get.Promocode
                        //@property {String} internalid
                        internalid: this.record.getLineItemValue('promotions', 'couponcode', i)
                        //@property {String} code
                        , code: this.record.getLineItemValue('promotions', 'couponcode_display', i)
                        //@property {Boolean} isvalid
                        , isvalid: this.record.getLineItemValue('promotions', 'promotionisvalid', i) === 'T'
                        //@property {String} discountrate_formatted
                        //TODO Uncomment this line when this issue is fixed: https://system.netsuite.com/app/crm/support/issuedb/issue.nl?id=46640914&whence=&cmid=1467749011534
                        , discountrate_formatted: ''//this.record.getLineItemValue('promotions', 'discountrate', i)
                    });
                }
                
                // @class Transaction.Model
            }
        });*/
        
    });
