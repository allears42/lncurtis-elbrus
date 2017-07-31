// Pacejet.Model.js
// -------
// Implements carrier and rates apis

define(
    'Pacejet.Model'
    ,	[
        'SC.Model'
        ,	'Application'
        ,	'Profile.Model'
        ,	'StoreItem.Model'
        ,	'Models.Init'
        ,	'SiteSettings.Model'
        ,	'Utils'
        ,	'ExternalPayment.Model'
        ,	'underscore'
    ]
    ,	function (
        SCModel
        ,	Application
        ,	Profile
        ,	StoreItem
        ,	ModelsInit
        ,	SiteSettings
        ,	Utils
        ,	ExternalPayment
        ,	_
    ) {
        'use strict';

        // @class LiveOrder.Model Defines the model used by the LiveOrder.Service.ss service
        // Available methods allow fetching and updating Shopping Cart's data. Works against the
        // Shopping session order, this is, nlapiGetWebContainer().getShoppingSession().getOrder()
        // @extends SCModel
        return SCModel.extend({

        	//TODO: update for LN Curtis

            // Pacejet Configuration
            pacejetConfiguration: {
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
                    }, "CustomFields": [
                        {
                            "name": "AutoPackShipment",
                            "value": "TRUE"
                        }
                    ]
                },

                //defaultMethod: '477143',  //sandbox pre-refresh
                defaultMethod: '484045',  //production

                groundMethods: [ '4' ],
                groundMethodsPacejet: [ 'U04' ],

                PJtoNSMethodsMap : {
                    // '75517': '80673' // USPS Priority Mail
                    // , '207448': '207448' // USPS Priority Express
                    'U04': '4' // UPS Ground
                    // , 'U01': '57597' // UPS 2nd Day Air
                    // , 'U05': '72497' // UPS Next Day Air
                }

                /*
                production: {
                    Location: 'Talas'
                    , LicenseID: '3e27ce3e-8bba-fb17-f705-60c6a8969eda'
                    , LicenseKey: 'a3f5c22d-338c-4943-e5fa-9c6114f2a59a'
                    , Origin: {
                        "CompanyName": "Talas",
                        "Address1": "330 Morgan Ave",
                        "City": "Brooklyn",
                        "StateOrProvinceCode": "NY",
                        "PostalCode": "11211",
                        "CountryCode": "US",
                        "ContactName": "Aaron Salik",
                        "Email": "aaron@talisonline.com",
                        "Phone": "212-219-0770"
                    }
                    , "ShipmentDetail": {
                        "WeightUOM": "LB"
                    }
                }
                */
            }

// Pacejet integration

//TODO: move as much of this as possible to the Pacejet.Model.js module since we have to integrate this into both the shopping and checkout versions of Model.js.

//TODO: filter the shipping methods unconditionally.  handle the case where we have filtered out the selected method, set to first available method and save the fact that we set it.

//TODO: determine if we can call PaceJet
// 0. if there is at least one line item
// 1. if we are logged in and there is a shipping address in the order and there is a selected shipping address.
// 2. if there is an address passed into the data, then we can look up and select the lowest cost shipping method

//TODO: after getting the look up, if we set the default shipping method then select the lowest rate.

            ,	updateOrder: function (order_fields, results, order, data)
            {
                try {
                    //nlapiLogExecution('debug', 'updateOrder', 'start');
                    // nlapiLogExecution('debug', 'results', JSON.stringify(_.omit(results, ['lines']),null,2));
                    // nlapiLogExecution('debug', 'order', order);
                    // nlapiLogExecution('debug', 'order_fields', JSON.stringify(order_fields,null,2));
                    // nlapiLogExecution('debug', 'data', JSON.stringify(data,null,2));
                    // nlapiLogExecution('debug', 'results.keys', JSON.stringify(_.keys(results),null,2));
                    //nlapiLogExecution('debug', 'results.shipmethods', JSON.stringify(results.shipmethods,null,2));
                    //nlapiLogExecution('debug', 'results.shipmethod', JSON.stringify(results.shipmethod,null,2));
                    // nlapiLogExecution('debug', 'results.addresses', JSON.stringify(results.addresses,null,2));
                    // nlapiLogExecution('debug', 'results.address', JSON.stringify(results.address,null,2));
                    // nlapiLogExecution('debug', 'results.summary (before)', JSON.stringify(results.summary,null,2));

                    results.hasFreeShipItems = this._hasFreeShipItems(order_fields);
                    results.allFreeShipItems = this._allFreeShipItems(order_fields);
                    //nlapiLogExecution('debug', 'FreeShipItems', 'allFreeShipItems = ' + results.allFreeShipItems + ', hasFreeShipItems = ' + results.hasFreeShipItems);

                    this._updateShippingRates(results, order, data);

                    //nlapiLogExecution('debug', 'updateOrder: results.summary (after)', JSON.stringify(results.summary,null,2));
                    //nlapiLogExecution('debug', 'updateOrder: results.shipmethods', JSON.stringify(results.shipmethods,null,2));
                }
                catch (e) {
                    nlapiLogExecution('debug', 'updateOrder: exception', e);
                }

                return results;
            }

            ,   _hasFreeShipItems: function (order_fields) {
                // nlapiLogExecution('debug', '_hasFreeShipItems', 'start');
                try {
                    return _.reduce(order_fields.items, function (memo, e) {
                        return memo || !!e.custitem_web_free_ship;
                    }, false);
                }
                catch (e) {
                    nlapiLogExecution('debug', '_hasFreeShipItems: exception', e);
                    return false;
                }
            }

            ,   _allFreeShipItems: function (order_fields) {
                // nlapiLogExecution('debug', '_allFreeShipItems', 'start');
                try {
                    return _.reduce(order_fields.items, function (memo, e) {
                        return memo && !!e.custitem_web_free_ship;
                    }, true);
                }
                catch (e) {
                    nlapiLogExecution('debug', '_allFreeShipItems: exception', e);
                    return false;
                }
            }

            ,	_getRates: function (shipaddress, order, results)
            {
                var ratingResultsList = [];
                var request = {};

                try {
                    //nlapiLogExecution('debug', '_getRates', 'start');
                    //nlapiLogExecution('debug', 'hasFreeShipItems', results.hasFreeShipItems);
                    //nlapiLogExecution('debug', 'allFreeShipItems', results.allFreeShipItems);

                    var pacejetConfig = this.pacejetConfiguration.production;

                    _.extend(request, shipaddress, this._packageDetailsList(order, results), pacejetConfig);
                    // nlapiLogExecution('audit', 'rates request', JSON.stringify(request,null,2));

                    // cache requests since LiveOver.Model#get is called repeatedly through the checkout process
                    var cache = {};
                    try { cache = JSON.parse(nlapiGetContext().getSessionObject('pjrcache')); } catch (ignore) {}
                    // nlapiLogExecution('audit', '_getRates: get cache', JSON.stringify(cache,null,2));
                    if ( cache && cache.h && cache.h == this._hashCode(JSON.stringify(request)) ) {
                        //nlapiLogExecution('debug', '_getRates returning cached result', JSON.stringify(cache.r,null,2));
                        return cache.r;
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

                    var ts = new Date().getTime();

                    // uncomment this to test client-side failure case.
                    // throw "test of client-side rates failure";

                    var pacejetResponse = nlapiRequestURL(pacejetUrl, JSON.stringify(request), pacejetHeaders);
                    //nlapiLogExecution('debug', 'Pacejet.Rates: elapsed time in ms', new Date().getTime() - ts);
                    // nlapiLogExecution('debug', 'pacejetResponse', pacejetResponse);

                    var rates = JSON.parse( pacejetResponse.getBody() );
                    // nlapiLogExecution('debug', 'rates', JSON.stringify(rates,null,2));

                    ratingResultsList = rates.ratingResultsList;

                    // _.each(ratingResultsList, function (e) {
                    //     nlapiLogExecution('debug', 'ratingResult (before filtering and mapping', JSON.stringify(e,null,2));
                    // });

                    // filter out any rates that returned zero or are not in mapping table.
                    // nlapiLogExecution('debug', 'ratingResultsList.length (raw)', JSON.stringify(ratingResultsList.length,null,2));
                    ratingResultsList = _.filter(ratingResultsList, function (rate) {
                        return !!rate.consignorFreight;
                    });
                    //nlapiLogExecution('debug', 'ratingResultsList.length (with rate amount)', JSON.stringify(ratingResultsList.length,null,2));

                    // set rates cache here
                    var newCache = {
                        h: this._hashCode(JSON.stringify(request))
                        , r: ratingResultsList
                    };
                    nlapiGetContext().setSessionObject('pjrcache', JSON.stringify(newCache));
                    // nlapiLogExecution('audit', '_getRates: set cache', JSON.stringify(newCache,null,2));
                }
                catch (e) {
                    nlapiLogExecution('debug', 'Pacejet.js:_getRates: exception', e);

                    nlapiGetContext().setSessionObject('pjrcache', null);

                    var body = 'Pacejet.js\nunexpected error: ' + e.toString() + '\nrequest = ' + JSON.stringify(request,null,2);
                    if ( e instanceof nlobjError ) {
                        body = 'Pacejet.js\nsystem error: \ncode = ' + e.getCode() + '\ndetails = ' + e.getDetails() + '\nrequest = ' + JSON.stringify(request,null,2);
                    }
                    nlapiSendEmail(-5, 'joelmcconaughy@gmail.com', 'PaceJet /rates error', body, null, null, null, null, true);
                }

                // nlapiLogExecution('debug', '_getRates returning uncached result', ratingResultsList);
                return ratingResultsList;
            }

            ,	_updateShippingRates: function (results, order, data)
            {
                //nlapiLogExecution('debug', '_updateShippingRates', 'start');
                //nlapiLogExecution('debug', 'hasFreeShipItems', results.hasFreeShipItems);
                //nlapiLogExecution('debug', 'allFreeShipItems', results.allFreeShipItems);
                //nlapiLogExecution('debug', 'results', results);
                //nlapiLogExecution('debug', 'order', order);
                //nlapiLogExecution('debug', 'data', data);
                //nlapiLogExecution('debug', '_updateShippingRates: data', JSON.stringify(data,null,2));
                //nlapiLogExecution('debug', 'isLoggedIn2', nlapiGetWebContainer().getShoppingSession().isLoggedIn2());

                try {
                    var request = {},
                        self = this;

                    // this is the update case where a new shipmethod has been selected, it gets passed in the data object.
                    //nlapiLogExecution('debug', 'results.shipmethod(before)', results.shipmethod);
                    //nlapiLogExecution('debug', 'data.shipmethod(before)', data.shipmethod);
                    results.shipmethod = (data && data.shipmethod) || (results && results.shipmethod) || null;
                    //nlapiLogExecution('debug', 'results.shipmethod', results.shipmethod);
                    // nlapiLogExecution('debug', 'results.shipaddress', results.shipaddress);

                    var address = data && _.find(data.addresses, function (a) {
                        return a.internalid === data.shipaddress;
                    });

                    if (!address && results && results.addresses && results.addresses.length) {
                        // nlapiLogExecution('debug', 'looking in results address list', '');

                        for (var i=0; i < results.addresses.length; i++) {
                            if (results.addresses[i].internalid == results.shipaddress) {
                                address = _.clone(results.addresses[i]);
                                break;
                            }
                        }
                        // nlapiLogExecution('debug', '_updateShippingRates: results.address', JSON.stringify(address,null,2));
                    }

                    var shipaddress = this._shippingAddress(order, address);

                    // look up rates and update both shipmethods and summary
                    if (shipaddress) {
                        //nlapiLogExecution('debug', '_updateShippingRates', 'have address, call pacejet');

                        var ratingResultsList = this._getRates(shipaddress, order, results);

                        // if there are no results, set shipping method and rates to the default.
                        if (!ratingResultsList || !ratingResultsList.length) {
                            //nlapiLogExecution('debug', 'returning default ship method', '');
                            //nlapiLogExecution('debug', 'setting custbody_pacejet_rates_status false', '');

                            try {
                                nlapiGetWebContainer().getShoppingSession().isLoggedIn2() && order.setCustomFieldValues({ 'custbody_pacejet_rates_status': 'F' });
                            }
                            catch (e) {
                                // ignore when in cart, only supported in checkout.
                            }

                            var defaultMethod = this.pacejetConfiguration.defaultMethod;
                            results.shipmethods = _.filter(results.shipmethods, function (e) {
                                return e.internalid == defaultMethod;
                            });
                            results.shipmethod = (results.shipmethods.length > 0) ? defaultMethod : null;

                            return;
                        }

                        //nlapiLogExecution('debug', 'setting custbody_pacejet_rates_status true', '');

                        try {
                            nlapiGetWebContainer().getShoppingSession().isLoggedIn2() && order.setCustomFieldValues({ 'custbody_pacejet_rates_status': 'T' });
                        }
                        catch (e) {
                            // ignore when in cart, only supported in checkout.
                        }

                        //  if there are shipmethods
                        if (results.shipmethods && results.shipmethods.length) {
                            // nlapiLogExecution('debug', '_updateShippingRates', 'found shipmethods');

                            // save original shipmethods array since order submission fails if we do not sent the original array
                            this._cloneShipmethods(results);

                            //  remove any that do not match a rate.
                            //  if there is no selected shipping method, set the selected shipmethod to the one that matches the lowest rate.
                            //nlapiLogExecution('debug', '_updateShippingRates: results.shipmethods.length (before filter)', results.shipmethods.length);
                            this._filterShippingMethods(results, ratingResultsList, results.hasFreeShipItems, results.allFreeShipItems);
                            //nlapiLogExecution('debug', '_updateShippingRates: results.shipmethods.length (after filter)', results.shipmethods.length);

                            //  update the summary total and rate
                            if (results.shipmethods.length) {
                                var selectedShipmethod = _.find(results.shipmethods, function (e) { return e.internalid == results.shipmethod; });
                                //nlapiLogExecution('debug', 'selectedShipmethod', JSON.stringify(selectedShipmethod,null,2));
                                if (selectedShipmethod) {
                                    // update the total by the delta between the existing shipping amount and the pacejet-provided rate
                                    results.summary.total = results.summary.total - results.summary.shippingcost + selectedShipmethod.rate;
                                    results.summary.total_formatted = Utils.formatCurrency(results.summary.total);

                                    results.summary.shippingcost = results.allFreeShipItems ? 0.0 : selectedShipmethod.rate;
                                    results.summary.shippingcost_formatted = Utils.formatCurrency(results.summary.shippingcost);
                                }
                            }
                        }

                        //  else set the summary rate to the lowest rate
                        else {

                            //TODO: need to filter the ratingResults but the list of methods but we only know the NS ID.
                            // We need to add the PaceJet ID to the table as well.

                            //nlapiLogExecution('debug', '_updateShippingRates', 'no shipmethods');
                            var lowestRate = _.chain(ratingResultsList)
                                .filter(function (e) { return _.contains(self.pacejetConfiguration.groundMethodsPacejet, e.shipCodeXRef); })
                                .sortBy('consigneeFreight')
                                .first()
                                .value();
                            //nlapiLogExecution('debug', 'lowestRate', JSON.stringify(lowestRate,null,2));

                            lowestRate = lowestRate || { consigneeFreight: 0.0 };

                            results.summary.total = results.summary.total - results.summary.shippingcost + lowestRate.consigneeFreight;
                            results.summary.total_formatted = Utils.formatCurrency(results.summary.total);
                            results.summary.shippingcost = results.allFreeShipItems ? 0.0 : lowestRate.consigneeFreight;
                            results.summary.shippingcost_formatted = Utils.formatCurrency(results.summary.shippingcost);
                        }
                    }

                    // no update needed as the default shipping amount is zero
                    else {
                        //nlapiLogExecution('debug', '_updateShippingRates', 'no address, skip rate update');
                    }
                }
                catch (e) {
                    nlapiLogExecution('error', '_updateShippingRates: exception', e);
                }

            }

            ,	_cloneShipmethods: function (results) {
                //nlapiLogExecution('debug', '_cloneShipmethods', 'start');
                //nlapiLogExecution('debug', 'results.shipmethods', JSON.stringify(results.shipmethods,null,2));

                var shipmethods_orig = new Array;
                _.each(results.shipmethods, function (e) {
                    shipmethods_orig.push(_.extend({}, e));
                });

                results.shipmethods_orig = shipmethods_orig;
                //nlapiLogExecution('debug', 'results.shipmethods_orig', JSON.stringify(results.shipmethods_orig,null,2));
            }

            // Filter shipmethods down to just those that have a matching result from pacejet look up, sort results lowest to highest, and set default shipmethod if not set to the lowest rate.
            ,	_filterShippingMethods: function(results, ratingResultsList)
            {
                //nlapiLogExecution('debug', '_filterShippingMethods', 'start');
                //nlapiLogExecution('debug', '_filterShippingMethods: ratingResultsList.length', ratingResultsList.length);

                var PJtoNSMethodsMap = this.pacejetConfiguration.PJtoNSMethodsMap;
                var groundMethods = this.pacejetConfiguration.groundMethods;
                // nlapiLogExecution('debug', 'groundMethods', JSON.stringify(groundMethods,null,2));

                var filterToGroundMethods = results.hasFreeShipItems || results.allFreeShipItems;
                //nlapiLogExecution('debug', 'filterToGroundMethods', filterToGroundMethods);

                if (results && results.shipmethods && results.shipmethods.length) {

                    ratingResultsList = _.map(ratingResultsList, function (e) {
                        return _.pick(e, ['consigneeFreight', 'shipCodeXRef']);
                    });
                    // nlapiLogExecution('debug', 'ratingResultsList (after pick)', JSON.stringify(ratingResultsList,null,2));

                    // Remove any pacejet results that do not have a corresponding entry in the table
                    ratingResultsList = _.filter(ratingResultsList, function (e) {
                        return !!PJtoNSMethodsMap[e.shipCodeXRef || 'notmapped'];
                    });
                    // nlapiLogExecution('debug', 'ratingResultsList (after filter)', JSON.stringify(ratingResultsList,null,2));

                    // Map the PaceJet shipping cross ref to the corresponding NetSuite shipmethod
                    ratingResultsList = _.map(ratingResultsList, function (e) {
                        e.shipCodeXRef = PJtoNSMethodsMap[e.shipCodeXRef];
                        return e;
                    });
                    // nlapiLogExecution('debug', 'ratingResultsList (after mapping)', JSON.stringify(ratingResultsList,null,2));

                    if (filterToGroundMethods) {
                        ratingResultsList = _.filter(ratingResultsList, function (e) {
                            return _.contains(groundMethods, e.shipCodeXRef);
                        });
                        // nlapiLogExecution('debug', 'ratingResultsList (after ground filter)', JSON.stringify(ratingResultsList,null,2));
                    }

                    if (results.allFreeShipItems) {
                        ratingResultsList = _.map(ratingResultsList, function (e) {
                            e.consigneeFreight = 0.0;
                            return e;
                        });
                        //nlapiLogExecution('debug', 'ratingResultsList (after free shipping map)', JSON.stringify(ratingResultsList,null,2));
                    }

                    var ratingHash = new Object;
                    _.each(ratingResultsList, function (e) {
                        ratingHash[e.shipCodeXRef] = e.consigneeFreight;
                    });
                    //nlapiLogExecution('debug', 'ratingHash = ' + JSON.stringify(ratingHash,null,2));

                    var shipmethods = results.shipmethods;
                    // nlapiLogExecution('debug', 'shipmethods.length', JSON.stringify(shipmethods.length,null,2));

                    //nlapiLogExecution('debug', 'shipmethods (unfiltered)', JSON.stringify(shipmethods,null,2));
                    shipmethods = _.filter(shipmethods, function (e) {
                        return ratingHash[e.internalid] != undefined;
                    });
                    //nlapiLogExecution('debug', 'shipmethods (filtered)', JSON.stringify(shipmethods,null,2));
                    // nlapiLogExecution('debug', 'shipmethods.length (filtered)', JSON.stringify(shipmethods.length,null,2));

                    _.each(shipmethods, function (e) {
                        e.rate = ratingHash[e.internalid];
                        e.rate_formatted = Utils.formatCurrency(e.rate);
                    });
                    //nlapiLogExecution('debug', 'shipmethods (rates)', JSON.stringify(shipmethods,null,2));

                    // sort in lowest cost order.  note:this isn't strictly necessary as the client collection has a comparator.
                    shipmethods = _.sortBy(shipmethods, 'rate');
                    // nlapiLogExecution('debug', 'shipmethods (sorted)', JSON.stringify(shipmethods,null,2));

                    //nlapiLogExecution('debug', 'results.shipmethod (before)', JSON.stringify(results.shipmethod,null,2));

                    // we have filtered out all the shipmethods so set default to null
                    if (!shipmethods.length) {
                        //nlapiLogExecution('debug', '_filterShippingMethods', 'all shipmethods have been filtered out');
                        results.shipmethod = null;
                    }

                    // if shipmethod is not set or if shipmethod has been filtered out of the list, set shipmethod to the lowest cost.
                    else if (!results.shipmethod || !_.find(shipmethods, function (e) { return e.internalid == results.shipmethod; })) {
                        //nlapiLogExecution('debug', '_filterShippingMethods', 'invalid shipmethod found, setting to lowest rate');
                        results.shipmethod = _.first(shipmethods).internalid;
                    }

                    //nlapiLogExecution('debug', 'results.shipmethod (after)', JSON.stringify(results.shipmethod,null,2));

                    results.shipmethods = shipmethods;
                }
            }

            ,	_packageDetailsList: function (order, results) {
                nlapiLogExecution('debug', '_packageDetailsList', 'start');
                nlapiLogExecution('debug', 'hasFreeShipItems', results.hasFreeShipItems);
                nlapiLogExecution('debug', 'allFreeShipItems', results.allFreeShipItems);

                var skipFreeShipItems = results.hasFreeShipItems && !results.allFreeShipItems;
                nlapiLogExecution('debug', 'skipFreeShipItems', skipFreeShipItems);

                var items = order.getItems() || [];
                //nlapiLogExecution('debug', 'items.length', items.length);

                var productDetailsList = new Array;
                for (var i = 0; i < items.length; i++) {

                    var item = items[i];
                    //nlapiLogExecution('debug', 'item.keys', JSON.stringify(_.keys(item),null,2));
                    //nlapiLogExecution('debug', 'item.amount', JSON.stringify(item.amount,null,2));
                    //nlapiLogExecution('debug', 'item.name', JSON.stringify(item.name,null,2));
                    //nlapiLogExecution('debug', 'item.itemid', JSON.stringify(item.itemid,null,2));
                    // nlapiLogExecution('debug', '_.keys(item)', JSON.stringify(_.filter(_.keys(item), function (e) {
                    //     return /^custitem_/.test(e);
                    // }),null,2));
                    // nlapiLogExecution('debug', 'item.custitem_web_free_ship', JSON.stringify(item.custitem_web_free_ship,null,2));
                    // nlapiLogExecution('debug', 'typeof item.custitem_web_free_ship', JSON.stringify( typeof item.custitem_web_free_ship,null,2));

                    // if there are some free shipping items, exclude them from the PaceJet calculation
                    if (skipFreeShipItems && item.custitem_web_free_ship) {
                        nlapiLogExecution('debug', 'skipping free shipping item ' + i, '');
                        continue;
                    }

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

                        "Dimensions":{
                            "Length": item.custitem_pacejet_item_length,
                            "Width": item.custitem_pacejet_item_width,
                            "Height": item.custitem_pacejet_item_height,
                            "Units":"IN"
                        },

                        "AutoPack": "true",

                        "CustomFields": [
                            {
                                "Name": "countryofmanufacture"
                                , "Value": item.countryofmanufacture
                            }
                            , {
                                "Name": "schedulebnumber"
                                , "Value": item.schedulebnumber
                            }
                            , {
                                "Name": "custitem_pacejet_oversize"
                                , "Value": item.custitem_pacejet_oversize
                            }
                        ]
                    };
                    productDetailsList.push(productDetails);
                };
                nlapiLogExecution('debug', 'productDetailsList', JSON.stringify(productDetailsList,null));

                return { PackageDetailsList: [{ ProductDetailsList: productDetailsList }] };
            }

            ,	_shippingAddress: function (order, address) {
                //nlapiLogExecution('debug', '_shippingAddress', 'start');
                //nlapiLogExecution('debug', 'isLoggedIn2', nlapiGetWebContainer().getShoppingSession().isLoggedIn2());
                //nlapiLogExecution('debug', 'address', JSON.stringify(address,null,2));

                var Destination = null;

                // if we are logged in and there is shipaddress in the order, then format and return the address.
                if (nlapiGetWebContainer().getShoppingSession().isLoggedIn2()) {
                    var shipaddress = order.getFieldValues(['shipaddress']);
                    // nlapiLogExecution('debug', 'shipaddress (order)', JSON.stringify(shipaddress,null,2));

                    shipaddress = (shipaddress && shipaddress.shipaddress) || null;
                    //nlapiLogExecution('debug', 'shipaddress (extracted)', JSON.stringify(shipaddress,null,2));

                    if (shipaddress) {
                        // nlapiLogExecution('debug', 'returning shipaddress from order');

                        // map NetSuite address fields to Pacejet fields
                        Destination = { Destination: {
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
                            , "Residential" : shipaddress.isresidential == 'T' ? 'true' : 'false'
                        }
                        };
                    }
                }

                // if address has a valid zip and country, we are estimating from cart so return minimal address passed into GET
                if (!Destination && address && address.zip && address.country) {
                    //nlapiLogExecution('debug', 'shipaddress (address)', JSON.stringify(address,null,2));
                    Destination = { Destination: {
                        "PostalCode": address.zip
                        , "CountryCode": address.country
                        , "Residential" : 'false'
                    }};
                }

                //nlapiLogExecution('debug', '_shippingAddress: returning Destination', JSON.stringify(Destination,null,2));
                return Destination;
            }

            ,	_hashCode: function (s)
            {
                var hash = 0;
                if (s.length == 0) return hash;
                for (var i = 0; i < s.length; i++) {
                    var char = s.charCodeAt(i);
                    hash = ((hash<<5)-hash)+char;
                    hash = hash & hash; // Convert to 32bit integer
                }
                return hash;
            }

        });
    });


