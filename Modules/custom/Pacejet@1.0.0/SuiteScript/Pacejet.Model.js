// @module Pacejet
define('Pacejet.Model'
    , [
        'Application'
    ,   'Utils'
    ,   'underscore'
    ]
    , function (
        Application
    ,   Utils
    ,   _
    ) {
        'use strict';

        return {

            updateOrder: function (order_fields, results, order, data) {

                var shipList
                ,   order
                ,   itemsArray
                ,   pacejetRates
                ,   prechangeShipping
                ,   summary;

                this.results = results;
                nlapiLogExecution('debug', 'ENTER PACEJET', 'start');

                // If no lines, return - no PJ lookup
                if (this.results.lines.length === 0) {
                    return this.results;
                }

                // If not multi-ship AND shipaddress is null or '-null', proceed
                if (!(this.results.ismultishipto) &&
                        (this.results.shipaddress == null || this.results.shipaddress.match(/[-]+null$/))
                    ) {

                    if (!this.results.shipaddress.match(/^[a-z]{2}[-]+[a-z0-9]+[-]+null$/gi)) {

                        this.setSummary(0, this.results.summary.shippingcost);

                        return this.results;
                    }
                }

                /**
                 * Sort items by address, then by ship method: result.lines[x].shipaddress
                 * Make Pacejet request for each address/shipmethod pair. Send item list with ship to and item dimensions
                 * Find pricing for the item's ship method in Pacjet reqponse using NS ship Method map to Pacejet ship method
                 * Update itemlist with new Pacejet shipping prices
                 */

                shipList = this.buildPackingList();
                order = nlapiGetWebContainer().getShoppingSession().getOrder();
                itemsArray = order.getItems();

                this.results.hasFreeShipItems = this._hasFreeShipItems(itemsArray);
                this.results.allFreeShipItems = this._allFreeShipItems(itemsArray);

                pacejetRates = this.getShippingObj(shipList, itemsArray, this.results, 'pjrcache');
                prechangeShipping = this.results.summary.shippingcost;
                this.setSummary(pacejetRates.totalShipping, prechangeShipping);

                // Set packageMethods in session object so client script can retrieve them
                nlapiGetContext().setSessionObject('packageMethods', JSON.stringify(pacejetRates.sessionMethods));

                // If we are in checkout and user is logged in, proceed
                if (Utils.isCheckoutDomain(request) && nlapiGetWebContainer().getShoppingSession().isLoggedIn2() ) {

                    /**
                     * Set custom shipping value on commerce API order object. This will trigger client script
                     * to take value set here and set it as value in transaction's native shippingcost field.
                     */
                    order.setCustomFieldValues({
                        'custbody_pacejet_shipping_price_hidden': String(pacejetRates.totalShipping)
                    });

                    /**
                     * In the above line, we set the shipping cost on the order. However, if there were any shipping
                     * related discounts, while they will still remain active, we effectively just overrode them.
                     * Here we will remove all promocodes, then iterate over them and add them back to the cart.
                     * Adding back an active promocode will throw an error, but it will still reset the shipping
                     * cost to the appropriate price.
                     */
                    if (results.hasOwnProperty('promocodes') && results.promocodes.length) {

                        try {
                            order.removeAllPromotionCodes();
                        } catch(e) {
                            nlapiLogExecution('DEBUG', 'PACEJET: Error removing promo codes', e);
                        }

                        _.each(results.promocodes, function(promo) {

                            try {
                                order.applyPromotionCode(promo.code);
                            } catch(e) {
                                nlapiLogExecution('DEBUG', 'PACEJET: Error adding promo code', e);
                            }
                        });
                    }

                    summary = order.getFieldValues(['summary']);
                    nlapiLogExecution('debug', 'Pacejet#summary post CS', JSON.stringify(summary));

                    if (summary) {
                        this.setSummaryFromOrder(results, summary.summary.taxtotal, summary.summary.total, summary.summary.shippingcost);
                    }
                }

                // Store sessionmethods in session
                this.results.pacejet = {
                    status: 'Prices updated'
                };

                return this.results;
            }

            , setSummaryFromOrder: function(results, newTax, newTotal, newShipping) {

                this.results.summary.taxtotal = newTax;
                this.results.summary.taxtotal_formatted = Utils.formatCurrency(newTax);

                this.results.summary.shippingcost = newShipping;
                this.results.summary.shippingcost_formatted = Utils.formatCurrency(newShipping);

                this.results.summary.total = newTotal;
                this.results.summary.total_formatted = Utils.formatCurrency(newTotal);
            }

            , setSummary: function (pacejetShipping, prechangeShipping) {

                this.results.summary.shippingcost = pacejetShipping;
                this.results.summary.shippingcost_formatted = Utils.formatCurrency(pacejetShipping);

                this.results.summary.total = this.results.summary.total - prechangeShipping + pacejetShipping;
                this.results.summary.total_formatted = Utils.formatCurrency(this.results.summary.total);
            }

            , getShippingObj: function (shipList, itemsArray, results, sessionCache) {

                var totalShipping = 0
                ,   sessionMethods = []
                ,   packageMethod;

                if (!_.isEmpty(shipList)) {

                    for (var x = 0; x < shipList.length; x++) {

                        packageMethod = this.getShippingRates(results, shipList[x], itemsArray, sessionCache);

                        if (!_.isEmpty(packageMethod)) {
                            totalShipping += packageMethod.rate;
                        }

                        sessionMethods.push({
                            method: packageMethod
                        ,   address: shipList[x].address
                        });
                    }
                }

                return {
                    totalShipping: totalShipping
                ,   sessionMethods: sessionMethods
                }
            }

            , buildPackingList: function () {

                var shipList = []
                ,   lineNums = this.results.lines.length
                ,   addrIndex
                ,   pkg;


                for (var i = 0; i < lineNums; i++) {

                    if (this.results.ismultishipto && this.results.lines[i].shipaddress == null) {
                        // nlapiLogExecution('debug', 'PacejetModel#updateOrder: skipping Pacejet lookup because no line ship address');
                        this.setSummary(0, this.results.summary.shippingcost);
                        return this.results;
                    }

                    if (!this.results.ismultishipto) {

                        addrIndex = this.findAddrIndex(shipList, this.results.shipaddress);
                        if (addrIndex != null) {
                            shipList[addrIndex].lines.push(this.results.lines[i].internalid);
                        }
                        else {
                            pkg = {
                                address: this.results.shipaddress,
                                method: this.results.shipmethod,
                                lines: [this.results.lines[i].internalid]
                            };
                            shipList.push(pkg);
                        }

                    } else {

                        addrIndex = this.findAddrIndex(shipList, this.results.lines[i].shipaddress);
                        if (addrIndex != null) {
                            shipList[addrIndex].lines.push(this.results.lines[i].internalid);
                        }
                        else {
                            pkg = {
                                address: this.results.lines[i].shipaddress,
                                method: this.results.lines[i].shipmethod,
                                lines: [this.results.lines[i].internalid]
                            };
                            shipList.push(pkg);
                        }
                    }
                }

                return shipList;
            }

            , findAddrIndex: function (obj, attr) {

                for (var i = 0; i < obj.length; i++) {

                    if (obj[i].address === attr) {
                        return i;
                    }
                }
                return null;
            }

            , shippingAddress: function (results, data) {

                var Destination = null
                ,   addrStr
                ,   addrParts
                ,   shipaddress;

                if (results.shipaddress.match(/^[a-z]+[-]+[0-9]+[-]+null$/gi)) {

                    // nlapiLogExecution('debug', 'address in cart', results.shipaddress);

                    // Stripping out the dashes to obtain the country and zip
                    addrStr = results.shipaddress.replace(/[-]+/g, ' ');
                    addrParts = addrStr.split(' ');

                    Destination = {
                        Destination: {
                            "PostalCode": addrParts[1]
                        ,   "CountryCode": addrParts[0]
                        }
                    };

                    return Destination
                }

                // If we are logged in and there is shipaddress in the order, then format and return the address.
                if (nlapiGetWebContainer().getShoppingSession().isLoggedIn2()) {

                    shipaddress = nlapiGetWebContainer().getShoppingSession().getCustomer().getAddress(data.address);

                    if (shipaddress) {

                        // Map NetSuite address fields to Pacejet fields
                        Destination = {
                            Destination: {
                                "CompanyName": ''
                            ,   "Address1": shipaddress.addr1
                            ,   "Address2": shipaddress.addr2
                            ,   "City": shipaddress.city
                            ,   "StateOrProvinceCode": shipaddress.state
                            ,   "PostalCode": shipaddress.zip
                            ,   "CountryCode": shipaddress.country
                            ,   "ContactName": shipaddress.addressee
                            ,   "Email": ''
                            ,   "Phone": shipaddress.phone
                            ,   "Residential": shipaddress.isresidential == 'T' ? 'true' : 'false'
                            }
                        };
                    }
                }

                // If address has a valid zip and country, we are estimating from cart so return minimal address passed into GET
                if (!Destination && data.address && data.address.zip && data.address.country) {

                    Destination = {
                        Destination: {
                            "PostalCode": data.address.zip
                        ,   "CountryCode": data.address.country
                        ,   "Residential": 'false'
                        }
                    };
                }

                return Destination;
            }

            // modifed by ss 7/16 - pass request object since quote lines are different than order lines
            , getRates: function (results, shipListX, itemsArray, shipaddress, request, sessionCache) {

                var ratingResultsList = []
                ,   pacejetConfig
                ,   cache
                ,   cacheObj
                ,   pacejetUrl = 'https://api.pacejet.cc/Rates'
                ,   pacejetHeaders = {}
                ,   maxTries
                ,   countTries
                ,   pacejetResponse
                ,   ts
                ,   code
                ,   rates
                ,   ratesStr
                ,   newCache
                ,   body;

                try {
                    pacejetConfig = this.pacejetConfiguration().production;

                    // nlapiLogExecution('debug', 'rates request', JSON.stringify(request, null, 2));

                    // Cache requests since LiveOver.Model#get is called repeatedly through the checkout process
                    cache = [];
                    try {
                        cache = JSON.parse(nlapiGetContext().getSessionObject(sessionCache));
                    } catch (ignore) {
                    }

                    if (cache && cache.length > 0) {

                        cacheObj = _.findWhere(cache, {h: hashCode(JSON.stringify(request))});

                        if (cacheObj && !_.isEmpty(cacheObj.r)) {
                            // nlapiLogExecution('debug', '_getRates returning cached result', JSON.stringify(cacheObj.r));
                            return cacheObj.r;
                        }
                    }

                    pacejetHeaders.PacejetLocation = pacejetConfig.Location;
                    pacejetHeaders.PacejetLicenseKey = pacejetConfig.LicenseKey;
                    pacejetHeaders.UpsLicenseID = pacejetConfig.UpsLicenseID;
                    pacejetHeaders['Content-Type'] = 'application/json';

                    maxTries = 3;
                    countTries = 0;
                    pacejetResponse = null;

                    while (countTries < maxTries) {

                        try {
                            ts = new Date().getTime();
                            pacejetResponse = nlapiRequestURL(pacejetUrl, JSON.stringify(request), pacejetHeaders);

                            code = parseInt(pacejetResponse.getCode(), 10) || 500;
                            nlapiLogExecution('debug', 'code', code);

                            if (code >= 200 && code <= 299) {
                                break;
                            }
                            else {
                                throw nlapiCreateError("PaceJet return error " + code, '', true);
                            }
                        }
                        catch (e) {

                            nlapiLogExecution('ERROR', 'PaceJet exception', e);

                            if (e instanceof nlobjError) {
                                switch (e.getCode()) {
                                    case 'SSS_REQUEST_TIME_EXCEEDED':
                                        ++countTries;
                                        continue;
                                    case 'SSS_CONNECTION_TIME_OUT':
                                        ++countTries;
                                        continue;
                                    case 'SSS_CONNECTION_CLOSED':
                                        ++countTries;
                                        continue;
                                }
                                break;
                            }
                            else {
                                break;
                            }
                        }
                    }

                    // nlapiLogExecution('debug', 'Pacejet.Rates: elapsed time in ms', new Date().getTime() - ts);

                    rates = JSON.parse(pacejetResponse.getBody());
                    ratesStr = JSON.stringify(rates, null, 2);

                    for (var x = 0; x < ratesStr.length; x += 3899) {
                        // nlapiLogExecution('debug', 'Pacejet.getRates rates', ratesStr.slice(x, x + 3900));
                    }

                    if (results.shipaddress.match(/[-]+null$/gi)) {

                        ratingResultsList = rates.serviceRecommendationList;
                        // nlapiLogExecution('debug', 'Pacejet.Rates ship results in cart', JSON.stringify(ratingResultsList));
                    } else {

                        ratingResultsList = rates.ratingResultsList;
                        ratingResultsList = _.filter(ratingResultsList, function (rate) {
                            return !!rate.consignorFreight;
                        });
                    }

                    // set rates cache here
                    newCache = {
                        h: hashCode(JSON.stringify(request))
                    ,   r: ratingResultsList
                    };
                    cache = cache || [];

                    cache.push(newCache);
                    nlapiGetContext().setSessionObject(sessionCache, JSON.stringify(cache));

                }
                catch (e) {

                    nlapiLogExecution('ERROR', 'Pacejet.js:_getRates: exception', e);
                    nlapiGetContext().setSessionObject(sessionCache, null);

                    body = 'Pacejet.js\nunexpected error: '
                        + e.toString()
                        + '\nrequest = '
                        + JSON.stringify(request,null,2)
                        + '\npacejetResponse = '
                        + JSON.stringify(pacejetResponse,null,2);

                    nlapiSendEmail(-5, 'joelmcconaughy@gmail.com', 'PaceJet /rates error', body, null, null, null, null, true);
                }

                return ratingResultsList;
            }

            , getShippingRates: function (results, shipListX, itemsArray, sessionCache) {

                var shipaddress = this.shippingAddress(results, shipListX)
                ,   request = {}
                ,   pacejetConfig = this.pacejetConfiguration()
                ,   rates
                ,   groundMethods
                ,   filterToGroundMethods
                ,   methodsArr
                ,   packageMethod
                ,   newShipmethods
                ,   rate
                ,   defaultShipMethodId = SC.Configuration.get('pacejet.defaultWebShippingId')
                ,   defaultShipMethod;
                // nlapiLogExecution('DEBUG', 'DEFAULT WEB SHIP METHOD', defaultShipMethod);

                _.extend(request, shipaddress, packageDetailsList(itemsArray, results, shipListX), pacejetConfig.production);

                // Get all available shipmethods from Pacejet
                rates = this.getRates(results, shipListX, itemsArray, shipaddress, request, sessionCache);

                if (results.shipaddress.match(/[-]+null$/gi)) {
                    rates.rate = rates.lowestCostConsigneeFreight;
                    return rates;
                }

                groundMethods = pacejetConfig.groundMethods;
                filterToGroundMethods = results.hasFreeShipItems || results.allFreeShipItems;

                // Set original NS ship methods as results.shipmethods_orig
                this.cloneShipmethods(results);

                // Iterate over PJ ship methods, set corresponding NS ship method on each PJ ship method
                   rates = _.map(rates, function (e) {

                       if (pacejetConfig.PJtoNSMethodsMap[e.shipCodeXRef]) {
                           e.shipCodeXRef = pacejetConfig.PJtoNSMethodsMap[e.shipCodeXRef];
                       }
                       return e;
                   });

                if (filterToGroundMethods) {
                    rates = _.filter(rates, function (e) {
                        return _.contains(groundMethods, e.shipCodeXRef);
                    });
                }

                if (results.allFreeShipItems) {
                    rates = _.map(rates, function (e) {
                        e.consigneeFreight = 0.0;
                        return e;
                    });
                }

                if (results.ismultishipto) {
                    methodsArr = results.multishipmethods[shipListX.address]
                } else {
                    methodsArr = results.shipmethods
                }

                packageMethod = {};
                newShipmethods = [];

                // Iterate over NS ship methods and generate new shipmethod array
                _.each(methodsArr, function (method) {

                    // If this is the default ship method, store it in var for reference
                    if (method.internalid == defaultShipMethodId) {
                        defaultShipMethod = method;
                    }

                    // Find PJ ship method where NS ship method's internal ID is PJ ship method's shipCodeXRef
                    rate = _.findWhere(rates, {shipCodeXRef: method.internalid});

                    if (rate) {

                        method.rate = rate.consigneeFreight;
                        method.rate_formatted = Utils.formatCurrency(rate.consigneeFreight);
                        method.cost = rate.consignorFreight;
                        newShipmethods.push(method);
                        if (shipListX.method && method.internalid == shipListX.method) {

                            /**
                             * Found the method for the current shipment.
                             * Set packageMethod as this method. This is the PJ data that will get retrieved by the
                             * client script.
                             */
                            packageMethod = method;
                            nlapiLogExecution('debug', 'found package method - NS method', JSON.stringify(packageMethod));
                            nlapiLogExecution('DEBUG', 'found package method - PJ method', JSON.stringify(rate));
                        }
                    }
                    else {
                        nlapiLogExecution('debug', 'error with shipCodeXRef mapping', method.internalid + ' - ' + method.name);
                        method.name = method.name + '*';
                    }

                });

                newShipmethods = _.sortBy(newShipmethods, 'rate');
                if (!newShipmethods.length) {
                    results.shipmethod = null;

                    if (defaultShipMethod && Utils.isCheckoutDomain() && nlapiGetWebContainer().getShoppingSession().isLoggedIn2()) {

                        // Add this to checkout's ship method display
                        newShipmethods.push(defaultShipMethod);

                        // Set this as selected ship method
                        results.shipmethod = defaultShipMethodId;

                        // Pass this back so we have data for the client script that sets the shipping price on the transaction
                        packageMethod = defaultShipMethod;

                        /************** START DEFAULT SHIP LOG ********************/
                        try {

                            var author = 82453
                            ,   content = ''
                            ,   title = 'Default web shipping order detected';

                            content = 'Web default shipping being set on an order in checkout. \r\n \n';
                            content += 'User: ' + nlapiGetUser() + '\r\n \n \r';
                            content += '**********';
                            content += 'PJ shipping methods returned: ' + JSON.stringify(rates) + '\r\n \n \r';
                            content += '**********';
                            content += 'NS shipping methods: ' + JSON.stringify(methodsArr) + '\r\n \n \r';
                            content += '**********';
                            content += 'Results obj: ' + JSON.stringify(results) + '\r\n';

                            // nlapiSendEmail(author, ['nkkwik@gmail.com'/*, 'rcurtis@lncurtis.com'*/], title, content);

                        } catch(e) {
                            nlapiLogExecution('DEBUG', 'ERROR SENDING DEFAULT SHIP ORDER EMAIL', e);
                        }
                        /************** END DEFAULT SHIP LOG ********************/

                    }

                // If shipmethod is not set or if shipmethod has been filtered out of the list, set shipmethod to the lowest cost.
                } else if (!results.shipmethod || !_.find(newShipmethods, function (e) {
                    return e.internalid == results.shipmethod;
                })) {
                    results.shipmethod = _.first(newShipmethods).internalid;
                }

                results.shipmethods = newShipmethods;

                return packageMethod;

            }

            , _hasFreeShipItems: function (itemsArray) {

                try {
                    return _.reduce(itemsArray, function (memo, e) {
                        return memo || !!e.custitem_web_free_ship;
                    }, false);
                }
                catch (e) {
                    nlapiLogExecution('debug', '_hasFreeShipItems: exception', e);
                    return false;
                }
            }

            , _allFreeShipItems: function (itemsArray) {

                try {
                    return _.reduce(itemsArray, function (memo, e) {
                        return memo && !!e.custitem_web_free_ship;
                    }, true);
                }
                catch (e) {
                    nlapiLogExecution('debug', '_allFreeShipItems: exception', e);
                    return false;
                }
            }

            , cloneShipmethods: function (results) {

                var shipmethods_orig = new Array;

                _.each(results.shipmethods, function (e) {
                    shipmethods_orig.push(_.extend({}, e));
                });

                results.shipmethods_orig = shipmethods_orig;
            }

            , pacejetConfiguration: function () {

                var pacejetConfiguration = {
                    demo: {
                        Location: 'DemoAPI'
                        , LicenseID: '955726f5-207e-562f-c19e-85d9093dc6cf'
                        , LicenseKey: '77eac2da-9a75-f63d-c07a-b312c3b8645e'
                        , Origin: {
                            "CompanyName": "ShipItFaster.com",
                            "Address1": "709 E. 44th",
                            "City": "Lubbock",
                            "StateOrProvinceCode": "TX",
                            "PostalCode": "79404",
                            "CountryCode": "US",
                            "ContactName": "Steve Sellers",
                            "Email": "steve.sellers@shipitfaster.com",
                            "Phone": "877-722-3538"
                        }
                        , "ShipmentDetail": {
                            "WeightUOM": "LB"
                        }, "CustomFields": [
                            {
                                "name": "AutoPackShipment",
                                "value": "TRUE"
                            }
                        ]
                    },

                    production: {
                        Location: 'LNCurtis'
                        , LicenseID: 'ea8367fa-b38d-8717-f51a-93169e91003a'
                        , LicenseKey: '231f7452-1778-8a09-a266-4922e70d6cb6'
                        , UpsLicenseID: "0bbc0ac3-9e68-1a1c-83ea-7b8ed6209bf8"
                        , Origin: {
                            "LocationType": "Facility",
                            "LocationSite": "MAIN",
                            "LocationCode": "1",
                            "CompanyName": "LN Curtis",
                            "Address1": "1800 Peralta Street",
                            "City": "Oakland",
                            "StateOrProvinceCode": "CA",
                            "PostalCode": "94607",
                            "CountryCode": "US",
                            "ContactName": "Roger Curtis",
                            "Email": "joelmcconaughy@gmail.com",
                            "Phone": "206-300-4732"
                        }
                        , "ShipmentDetail": {
                            "WeightUOM": "LB"
                        }
                        , "CustomFields": [
                            {
                                "name": "AutoPackShipment",
                                "value": "TRUE"
                            }
                        ]
                    },

                    //defaultMethod: '477143',  //sandbox pre-refresh
                    defaultMethod: '484045',  //production

                    groundMethods: ['4','U04'],
                    groundMethodsPacejet: ['U04'],

                    PJtoNSMethodsMap: {
                        // '75517': '80673' // USPS Priority Mail
                        // , '207448': '207448' // USPS Priority Express
                        'U04': '4' // UPS Ground
                        , '4' : '4' //UPS Ground
                        // , 'U01': '57597' // UPS 2nd Day Air
                        // , 'U05': '72497' // UPS Next Day Air
                    }

                }

                return pacejetConfiguration;
            }
        };

        function packageDetailsList(itemsArray, results, shipListX) {
            var productDetailsList = new Array;
            var skipFreeShipItems = results.hasFreeShipItems && !results.allFreeShipItems;

            for (var i = 0; i < itemsArray.length; i++) {
                var item = itemsArray[i];

                if (shipListX.lines.indexOf(item.orderitemid) < 0) continue;
                if (skipFreeShipItems && item.custitem_web_free_ship) continue;

                var productDetails = {
                    "Quantity": {
                        "Units": "EA",
                        "Value": item.quantity
                    },

                    "Price": {
                        "Amount": item.amount / item.quantity
                    },

                    "Number": item.itemid,

                    "Weight": item.weight,

                    "Dimensions": {
                        "Length": item.custitem_pacejet_item_length,
                        "Width": item.custitem_pacejet_item_width,
                        "Height": item.custitem_pacejet_item_height,
                        "Units": "IN"
                    },
                    "AutoPack": "true",
//                    "commodityName": item.custitem_pacejet_commodity_name,
                    "CustomFields": [
                        {
                            "Name": "countryofmanufacture"
                            , "Value": item.countryofmanufacture
                        }
                        , {
                            "Name": "schedulebnumber"
                            , "Value": item.schedulebnumber
                        }, {
                            "Name": "custitem_pacejet_oversize"
                            , "Value": item.custitem_pacejet_oversize
                        }

                    ]


                };
                productDetailsList.push(productDetails);
            }

            return {PackageDetailsList: [{ProductDetailsList: productDetailsList}]};
        }

        function hashCode(s) {
            var hash = 0;
            if (s.length == 0) return hash;
            for (var i = 0; i < s.length; i++) {
                var char = s.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32bit integer
            }
            return hash;
        }

    });
