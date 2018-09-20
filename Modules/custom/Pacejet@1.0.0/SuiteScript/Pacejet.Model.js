// @module Pacejet
define('Pacejet.Model'
    , [
        'Application'
        , 'Utils'
        , 'underscore'
    ]
    , function (
        Application
        , Utils
        , _
    ) {
        'use strict';

        return {
            updateOrder: function (order_fields, results, order, data) {

                //config options - will implement these to turn on/off optional behaviors in the module
                /*
                                this.filterFreeItems = true;
                                this.filterNonPacejetMethods = true;
                                this.cartEstimate;
                                this.enablePacejet = config.getEnablePacejet()
                */
                this.results = results;
                nlapiLogExecution('debug', 'Pacejet#updateResult', 'start');
                nlapiLogExecution('debug', 'Pacejet#updateResult - shipAddress', this.results.shipaddress);

                if (this.results.lines.length === 0) {
                    nlapiLogExecution('debug', 'PacejetModel#updateOrder: skipping Pacejet lookup because no lines');
                    return this.results;
                }

                /*if (!Utils.isInCheckout()) {
                    nlapiLogExecution('debug', 'PacejetModel#updateOrder: skipping Pacejet lookup, not in checkout', this.results.shipaddress);
                    if (!this.results.summary.shippingcost) return this.results;

					this.setSummary(0, this.results.summary.shippingcost);

                    return this.results;
                }*/

                if (!(this.results.ismultishipto) && (this.results.shipaddress == null || this.results.shipaddress.match(/[-]+null$/))) {
                    if (!this.results.shipaddress.match(/^[a-z]{2}[-]+[a-z0-9]+[-]+null$/gi)) {
                        nlapiLogExecution('debug', 'PacejetModel#updateOrder: skipping Pacejet lookup because no ship address', this.results.shipaddress);

                        this.setSummary(0, this.results.summary.shippingcost);

                        return this.results;
                    }
                }

                var options = this.results.options;
                nlapiLogExecution('debug', 'PacejetModel#options', JSON.stringify(options));
                if (options && options['custbody_pick_up_in_store'] && options['custbody_pick_up_in_store'] === 'T') {
                    nlapiLogExecution('debug', 'PacejetModel#updateOrder: skipping Pacejet lookup because customer pickup');
                    nlapiGetContext().setSessionObject('packageMethods', null);

                    return this.results
                }

                //nlapiLogExecution('debug', 'pacejet config', JSON.stringify(this.pacejetConfiguration()));
                // nlapiLogExecution('debug', 'pacejet results.ismultishipto', results.ismultishipto);
                // nlapiLogExecution('debug', 'pacejet results.shipaddress', results.shipaddress);

                //TODO: implement rate look up here
                // Sort items by address, then by ship method
                //   result.lines[x].shipaddress
                // Make Pacejet request for each address/shipmethod pair
                // 	* Send item list with ship to and item dimensions
                // Find pricing for the item's ship method in Pacjet reqponse using NS ship Method map to Pacejet ship method
                // Update itemlist with new Pacejet shipping prices

                var shipList = this.buildPackingList();
                nlapiLogExecution('debug', 'shiplist', JSON.stringify(shipList));
                var order = nlapiGetWebContainer().getShoppingSession().getOrder()
                    , itemsArray = order.getItems();

                this.results.hasFreeShipItems = this._hasFreeShipItems(itemsArray);
                this.results.allFreeShipItems = this._allFreeShipItems(itemsArray);


                var pacejetRates = this.getShippingObj(shipList, itemsArray, this.results, 'pjrcache');

                var prechangeShipping = this.results.summary.shippingcost;
                this.setSummary(pacejetRates.totalShipping, prechangeShipping);


                if (Utils.isCheckoutDomain(request) && nlapiGetWebContainer().getShoppingSession().isLoggedIn2() ) {
                    order.setCustomFieldValues({
                        'custbody_pacejet_shipping_price_hidden': String(pacejetRates.totalShipping)
                    });
                    var summary = order.getFieldValues(['summary']);
                    nlapiLogExecution('debug', 'Pacejet#summary post CS', JSON.stringify(summary));

                    if (summary) {
                        this.setSummaryFromOrder(results, summary.summary.taxtotal, summary.summary.total, summary.summary.shippingcost);
                    }
                }


                //nlapiLogExecution('debug', 'totalShipping', pacejetRates.totalShipping);
                //nlapiLogExecution('debug', 'sessionMethods', JSON.stringify(pacejetRates.sessionMethods));

                //store sessionmethods in session
                nlapiGetContext().setSessionObject('packageMethods', JSON.stringify(pacejetRates.sessionMethods));

                //nlapiLogExecution('debug', 'Pacejet#updateResult', 'end');
                //nlapiLogExecution('debug', 'Pacejet#results.shipmethod', JSON.stringify(this.results.shipmethod));

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

                // nlapiLogExecution('debug', 'this.results.summary.total - after tax', this.results.summary.total);
            }
            , setSummary: function (pacejetShipping, prechangeShipping) {
                this.results.summary.shippingcost = pacejetShipping;
                this.results.summary.shippingcost_formatted = Utils.formatCurrency(pacejetShipping);
                //nlapiLogExecution('debug', 'this.results.summary.total', this.results.summary.total);
                //nlapiLogExecution('debug', 'total', prechangeShipping);

                this.results.summary.total = this.results.summary.total - prechangeShipping + pacejetShipping;
                this.results.summary.total_formatted = Utils.formatCurrency(this.results.summary.total);

                //nlapiLogExecution('debug', 'this.results.summary.total - after', this.results.summary.total);
            }

            , getShippingObj: function (shipList, itemsArray, results, sessionCache) {
                var totalShipping = 0;
                var sessionMethods = [];

                //nlapiLogExecution('DEBUG', 'Pacejet.getShippingObj#shipList', JSON.stringify(shipList));

                if (!_.isEmpty(shipList)) {
                    for (var x = 0; x < shipList.length; x++) {
                        var packageMethod = this.getShippingRates(results, shipList[x], itemsArray, sessionCache);
                        if (!_.isEmpty(packageMethod)) totalShipping += packageMethod.rate;
                        sessionMethods.push({
                            method: packageMethod,
                            address: shipList[x].address
                        });
                    }
                }

                return {
                    totalShipping: totalShipping
                    , sessionMethods: sessionMethods
                }
            }

            , buildPackingList: function () {
                var shipList = [];

                var lineNums = this.results.lines.length;
                for (var i = 0; i < lineNums; i++) {
                    if (this.results.ismultishipto && this.results.lines[i].shipaddress == null) {
                        nlapiLogExecution('debug', 'PacejetModel#updateOrder: skipping Pacejet lookup because no line ship address');
                        this.setSummary(0, this.results.summary.shippingcost);
                        return this.results;
                    }

                    if (!this.results.ismultishipto) {
                        //nlapiLogExecution('debug', 'results line ' + i + ' item', this.results.lines[i].internalid);

                        var addrIndex = this.findAddrIndex(shipList, this.results.shipaddress);
                        if (addrIndex != null) {
                            shipList[addrIndex].lines.push(this.results.lines[i].internalid);
                        }
                        else {
                            var pkg = {
                                address: this.results.shipaddress,
                                method: this.results.shipmethod,
                                lines: [this.results.lines[i].internalid]
                            };
                            shipList.push(pkg);
                        }
                    }
                    else {
                        //nlapiLogExecution('debug', 'results line ' + i + ' item', results.lines[i].internalid);
                        //nlapiLogExecution('debug', 'results line ' + i + ' ship address', JSON.stringify(results.lines[i].shipaddress));
                        //nlapiLogExecution('debug', 'results line ' + i + ' ship method', JSON.stringify(results.lines[i].shipmethod));

                        var addrIndex = this.findAddrIndex(shipList, this.results.lines[i].shipaddress);
                        if (addrIndex != null) {
                            shipList[addrIndex].lines.push(this.results.lines[i].internalid);
                        }
                        else {
                            var pkg = {
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
                var Destination = null;

                if (results.shipaddress.match(/^[a-z]+[-]+[0-9]+[-]+null$/gi)) {
                    nlapiLogExecution('debug', 'address in cart', results.shipaddress);

                    //stripping out the dashes to obtain the country and zip
                    var addrStr = results.shipaddress.replace(/[-]+/g, ' ');
                    //nlapiLogExecution('debug', 'address in cart str', addrStr);
                    var addrParts = addrStr.split(' ');

                    //nlapiLogExecution('debug', 'address in cart split', addrParts);
                    Destination = {
                        Destination: {
                            "PostalCode": addrParts[1]
                            , "CountryCode": addrParts[0]
                        }
                    };

                    return Destination
                }

                // if we are logged in and there is shipaddress in the order, then format and return the address.
                if (nlapiGetWebContainer().getShoppingSession().isLoggedIn2()) {
                    var shipaddress = nlapiGetWebContainer().getShoppingSession().getCustomer().getAddress(data.address);

                    if (shipaddress) {
                        //nlapiLogExecution('debug', 'returning shipaddress from order');

                        // map NetSuite address fields to Pacejet fields
                        Destination = {
                            Destination: {
                                "CompanyName": ''
                                , "Address1": shipaddress.addr1
                                , "Address2": shipaddress.addr2
                                , "City": shipaddress.city
                                , "StateOrProvinceCode": shipaddress.state
                                , "PostalCode": shipaddress.zip
                                , "CountryCode": shipaddress.country
                                , "ContactName": shipaddress.addressee
                                , "Email": ''
                                , "Phone": shipaddress.phone
                                , "Residential": shipaddress.isresidential == 'T' ? 'true' : 'false'
                            }
                        };
                    }
                }
                // if address has a valid zip and country, we are estimating from cart so return minimal address passed into GET
                if (!Destination && data.address && data.address.zip && data.address.country) {
                    //nlapiLogExecution('debug', 'shipaddress (address)', JSON.stringify(address,null,2));
                    Destination = {
                        Destination: {
                            "PostalCode": data.address.zip
                            , "CountryCode": data.address.country
                            , "Residential": 'false'
                        }
                    };
                }

                //nlapiLogExecution('debug', '_shippingAddress: returning Destination', JSON.stringify(Destination,null,2));
                return Destination;
            }

            // modifed by ss 7/16 - pass request object since quote lines are different than order lines
            , getRates: function (results, shipListX, itemsArray, shipaddress, request, sessionCache) {
                var ratingResultsList = [];
                //var request = {};

                try {
                    var pacejetConfig = this.pacejetConfiguration().production;

                    nlapiLogExecution('debug', 'rates request', JSON.stringify(request, null, 2));

                    // cache requests since LiveOver.Model#get is called repeatedly through the checkout process
                    var cache = [];
                    try {
                        cache = JSON.parse(nlapiGetContext().getSessionObject(sessionCache));
                    } catch (ignore) {
                    }
                    //nlapiLogExecution('audit', '_getRates: get cache', JSON.stringify(cache,null,2));
                    if (cache && cache.length > 0) {
                        var cacheObj = _.findWhere(cache, {h: hashCode(JSON.stringify(request))});

                        if (cacheObj && !_.isEmpty(cacheObj.r)) {
                            nlapiLogExecution('debug', '_getRates returning cached result', JSON.stringify(cacheObj.r));
                            return cacheObj.r;
                        }
                    }

                    var pacejetUrl = 'https://api.pacejet.cc/Rates';
                    //nlapiLogExecution('debug', 'pacejetUrl', JSON.stringify(pacejetUrl,null,2));
                    //nlapiLogExecution('debug', 'request', JSON.stringify(request,null,2));

                    var pacejetHeaders = {};
                    pacejetHeaders.PacejetLocation = pacejetConfig.Location;
                    pacejetHeaders.PacejetLicenseKey = pacejetConfig.LicenseKey;
                    pacejetHeaders.UpsLicenseID = pacejetConfig.UpsLicenseID;
                    pacejetHeaders['Content-Type'] = 'application/json';
                    // nlapiLogExecution('debug', 'pacejetHeaders', JSON.stringify(pacejetHeaders,null,2));

                    var maxTries = 3;
                    var countTries = 0;
                    var pacejetResponse = null;

                    while (countTries < maxTries) {
                        try {
                            var ts = new Date().getTime();
                            pacejetResponse = nlapiRequestURL(pacejetUrl, JSON.stringify(request), pacejetHeaders);
                            //nlapiLogExecution('debug', 'Pacejet.Rates: elapsed time in ms', new Date().getTime() - ts);
                            //nlapiLogExecution('debug', 'pacejetResponse', pacejetResponse);

                            var code = parseInt(pacejetResponse.getCode(), 10) || 500;
                            nlapiLogExecution('debug', 'code', code);

                            if (code >= 200 && code <= 299) {
                                //nlapiLogExecution('debug', 'Breaking on success response', '');
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

                    nlapiLogExecution('debug', 'Pacejet.Rates: elapsed time in ms', new Date().getTime() - ts);
                    //nlapiLogExecution('debug', 'pacejetResponse', pacejetResponse);

                    var rates = JSON.parse(pacejetResponse.getBody());

                    var ratesStr = JSON.stringify(rates, null, 2);

                    for (var x = 0; x < ratesStr.length; x += 3899) {
                        nlapiLogExecution('debug', 'Pacejet.getRates rates', ratesStr.slice(x, x + 3900));
                    }

                    //nlapiLogExecution('debug', 'Pacejet.Rates ship address in cart', results.shipaddress);
                    if (results.shipaddress.match(/[-]+null$/gi)) {
                        ratingResultsList = rates.serviceRecommendationList
                        nlapiLogExecution('debug', 'Pacejet.Rates ship results in cart', JSON.stringify(ratingResultsList));
                    }
                    else {
                        ratingResultsList = rates.ratingResultsList;
                        ratingResultsList = _.filter(ratingResultsList, function (rate) {
                            return !!rate.consignorFreight;
                        });
                    }
                    // _.each(ratingResultsList, function (e) {
                    //     nlapiLogExecution('debug', 'ratingResult (before filtering and mapping', JSON.stringify(e,null,2));
                    // });

                    // filter out any rates that returned zero or are not in mapping table.
                    // nlapiLogExecution('debug', 'ratingResultsList.length (raw)', JSON.stringify(ratingResultsList.length,null,2));

                    //nlapiLogExecution('debug', 'ratingResultsList.length (with rate amount)', JSON.stringify(ratingResultsList.length,null,2));


                    // set rates cache here
                    var newCache = {
                        h: hashCode(JSON.stringify(request))
                        , r: ratingResultsList
                    };
                    cache = cache || [];
                    //if(results.ismultishipto) cache = [];
                    cache.push(newCache);
                    nlapiGetContext().setSessionObject(sessionCache, JSON.stringify(cache));
                    // nlapiLogExecution('audit', '_getRates: set cache', JSON.stringify(newCache,null,2));
                }
                catch (e) {
                    nlapiLogExecution('ERROR', 'Pacejet.js:_getRates: exception', e);

                    nlapiGetContext().setSessionObject(sessionCache, null);

                    var body = 'Pacejet.js\nunexpected error: ' + e.toString() + '\nrequest = ' + JSON.stringify(request, null, 2);
                    if (e instanceof nlobjError) {
                        body = 'Pacejet.js\nsystem error: \ncode = ' + e.getCode() + '\ndetails = ' + e.getDetails() + '\nrequest = ' + JSON.stringify(request, null, 2);
                    }
                    nlapiSendEmail(-5, 'joelmcconaughy@gmail.com', 'PaceJet /rates error', body, null, null, null, null, true);
                }

                // nlapiLogExecution('debug', '_getRates returning uncached result', ratingResultsList);
                return ratingResultsList;
            }

            , getShippingRates: function (results, shipListX, itemsArray, sessionCache) {

                var shipaddress = this.shippingAddress(results, shipListX);

                // build request object
                var request = {};
                var pacejetConfig = this.pacejetConfiguration();
                nlapiLogExecution('debug', 'Pacjetconfig', pacejetConfig);

                _.extend(request, shipaddress, packageDetailsList(itemsArray, results, shipListX), pacejetConfig.production);

                var rates = this.getRates(results, shipListX, itemsArray, shipaddress, request, sessionCache);
                if (results.shipaddress.match(/[-]+null$/gi)) {
                    rates.rate = rates.lowestCostConsigneeFreight;
                    return rates;
                }

                var groundMethods = this.pacejetConfiguration.groundMethods;
                var filterToGroundMethods = results.hasFreeShipItems || results.allFreeShipItems;

                this.cloneShipmethods(results);

                //filter methods
                               rates = _.map(rates, function (e) {
                                   if (pacejetConfig.PJtoNSMethodsMap[e.shipCodeXRef]) {
                                       e.shipCodeXRef = pacejetConfig.PJtoNSMethodsMap[e.shipCodeXRef];
                                   }
                                   return e;
                               });
                               nlapiLogExecution('debug', 'Pacjetconfig after', "after map");

                if (filterToGroundMethods) {
                    rates = _.filter(rates, function (e) {
                        return _.contains(groundMethods, e.shipCodeXRef);
                    });
                    // nlapiLogExecution('debug', 'rates (after ground filter)', JSON.stringify(rates,null,2));
                }

                if (results.allFreeShipItems) {
                    rates = _.map(rates, function (e) {
                        e.consigneeFreight = 0.0;
                        return e;
                    });
                    //nlapiLogExecution('debug', 'rates (after free shipping map)', JSON.stringify(rates,null,2));
                }

                var methodsArr;
                if (results.ismultishipto) {
                    methodsArr = results.multishipmethods[shipListX.address]
                }
                else {
                    methodsArr = results.shipmethods
                }

                //nlapiLogExecution('debug', 'methods before set rate', JSON.stringify(methodsArr));
                //nlapiLogExecution('debug', 'rates', JSON.stringify(rates));


                var packageMethod = {};
                var newShipmethods = [];
                _.each(methodsArr, function (method) {
                    var rate = _.findWhere(rates, {shipCodeXRef: method.internalid});
                    if (rate) {
                        //nlapiLogExecution('debug', 'setting method '+method.internalid, rate.consigneeFreight);
                        method.rate = rate.consigneeFreight;
                        method.rate_formatted = Utils.formatCurrency(rate.consigneeFreight);
                        method.cost = rate.consignorFreight;
                        newShipmethods.push(method);
                        if (shipListX.method && method.internalid == shipListX.method) {
                            //found the method for the current shipment
                            //set the rate to the first line and zero any other lines
                            packageMethod = method;
                            nlapiLogExecution('debug', 'found package method ' + method.internalid, JSON.stringify(packageMethod));
                        }
                    }
                    else {
                        nlapiLogExecution('debug', 'error with shipCodeXRef mapping', method.internalid + ' - ' + method.name);
                        method.name = method.name + '*';
                    }

                });

                newShipmethods = _.sortBy(newShipmethods, 'rate');
                if (!newShipmethods.length) {
                    //nlapiLogExecution('debug', '_filterShippingMethods', 'all shipmethods have been filtered out');
                    results.shipmethod = null;
                }

                // if shipmethod is not set or if shipmethod has been filtered out of the list, set shipmethod to the lowest cost.
                else if (!results.shipmethod || !_.find(newShipmethods, function (e) {
                    return e.internalid == results.shipmethod;
                })) {
                    //nlapiLogExecution('debug', '_filterShippingMethods', 'invalid shipmethod found, setting to lowest rate');
                    results.shipmethod = _.first(newShipmethods).internalid;
                }

                //nlapiLogExecution('debug', 'results.shipmethod (after)', JSON.stringify(results.shipmethod,null,2));

                results.shipmethods = newShipmethods;

                //nlapiLogExecution('debug', 'methods after set rate', JSON.stringify(methodsArr));
                return packageMethod;

            }

            , _hasFreeShipItems: function (itemsArray) {
                // nlapiLogExecution('debug', '_hasFreeShipItems', 'start');
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
                // nlapiLogExecution('debug', '_allFreeShipItems', 'start');
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
                //nlapiLogExecution('debug', '_cloneShipmethods', 'start');
                //nlapiLogExecution('debug', 'results.shipmethods', JSON.stringify(results.shipmethods,null,2));

                var shipmethods_orig = new Array;
                _.each(results.shipmethods, function (e) {
                    shipmethods_orig.push(_.extend({}, e));
                });

                results.shipmethods_orig = shipmethods_orig;
                //nlapiLogExecution('debug', 'results.shipmethods_orig', JSON.stringify(results.shipmethods_orig,null,2));
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

                    groundMethods: ['4'],
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
                //console.log('PaceJet.Configuration: config = ' + JSON.stringify(config,null,2));

                return pacejetConfiguration;
            }
        };

        function packageDetailsList(itemsArray, results, shipListX) {
            var productDetailsList = new Array;
            var skipFreeShipItems = results.hasFreeShipItems && !results.allFreeShipItems;

            for (var i = 0; i < itemsArray.length; i++) {
                var item = itemsArray[i];
                //nlapiLogExecution('AUDIT', 'PaceJet#getShippingObj#getShippingRates#packageDetailsList#item', JSON.stringify(item));

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