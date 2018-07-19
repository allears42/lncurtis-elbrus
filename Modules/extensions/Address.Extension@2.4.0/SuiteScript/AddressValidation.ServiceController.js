/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Address.ServiceController.js
// ----------------
// Service to manage addresses requests
define(
	'AddressValidation.ServiceController'
,	[
		'ServiceController'
	,	'SmartyStreetsCredentials'
	,	'Application'
	]
,	function(
		ServiceController, Creds
	)
	{
		'use strict';

		// @class Address.ServiceController Manage addresses requests
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name:'AddressValidation.ServiceController'

			// @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
			// The values in this object are the validation needed for the current service.
			// Can have values for all the request methods ('common' values) and specific for each one.
		,	options: {

			}

			// @method get The call to Address.Service.ss with http method 'get' is managed by this function
			// @return {Address.Model.Attributes | Array<Address.Model.Attributes>} one or all user addresses
		,	get: function()
			{
				var auth_id = Creds.auth_id;
				var auth_token = Creds.auth_token;
				var addressObj = {
					addr1:this.request.getParameter('addr1'),
                    addr2:this.request.getParameter('addr2'),
                    state:this.request.getParameter('state'),
                    city:this.request.getParameter('city'),
                    zip:this.request.getParameter('zip')
				};
				var qStr = 'street='+addressObj.addr1 +	'&street2='+addressObj.addr2 + '&state='+addressObj.state + '&city='+addressObj.city + '&zipcode='+addressObj.zip +	'&auth-token='+auth_token +	'&auth-id='+auth_id;

                var API_URL = 'https://us-street.api.smartystreets.com/street-address?'+qStr;
                var resp = nlapiRequestURL(API_URL);
                resp = resp.getBody();
				
				nlapiLogExecution('DEBUG', 'SmartyStreets API_URL:', API_URL);
				nlapiLogExecution('DEBUG', 'SmartyStreets Reply:', resp);
                resp = decodeURI(resp);
				
				
                try {
	                resp = JSON.parse(resp);
	
	                var responseArr = [];
	
	                if (resp && resp != null && resp.length > 0) {
		                for (var i = 0; i < resp.length; i++) {
			                var responseObject = {
				                'addr1': resp[i].delivery_line_1,
				                'addr2': '',
				                'state': resp[i].components.state_abbreviation,
				                'city': resp[i].components.city_name,
				                'zip': resp[i].components.zipcode
			                };
			                if (resp[i].hasOwnProperty('delivery_line_2') == true) {
				                responseObject.addr2 = resp[i].delivery_line_2;
			                }
			                responseObject.isresidential = resp[i].hasOwnProperty('metadata') && resp[i].metadata.hasOwnProperty('rdi') && resp[i].metadata.rdi == 'Residential';
			
			                responseArr.push(responseObject);
		                }
	                }
	
	                nlapiLogExecution('DEBUG', 'Response:', JSON.stringify(responseArr));
	
	                return (encodeURI(JSON.stringify(responseArr)));
                }
                catch(e) {
	                nlapiLogExecution('ERROR', 'Error with SmartyStreets Address Validation', JSON.stringify(e));
	                nlapiLogExecution('ERROR', 'API Response', JSON.stringify(resp));
	                
	                return {
		
		                errorCode:"ERR_ADDRESS_VALIDATION"
	                ,   errorMessage: 'SmartyStreets Error: ' + resp
	                ,   errorStatusCode: "400"
	                }
                }
			}
		});
	}
);