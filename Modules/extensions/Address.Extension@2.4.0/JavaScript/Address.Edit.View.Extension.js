/*
	© 2017 JHM Services
	Manage state isn't passed through - adding it
*/

//@module Address
define(
	'Address.Edit.View.Extension'
,	[	'Address.Edit.View'

	,	'Address.Edit.Fields.View'

	,	'Backbone'
	,	'SC.Configuration'
	,	'underscore'
	,	'jQuery'
	,	'Utils'
	]
,	function (
		AddressEditView

	,	AddressEditFieldView

	,	Backbone
	,	Configuration
	,	_
	,	jQuery
	)
{
	'use strict';

	_.extend(AddressEditView.prototype, {
		childViews: {
			'Address.Edit.Fields': function ()
			{
				return new AddressEditFieldView({
					model: this.model
					,	countries: this.countries
					,	selectedCountry: this.selectedCountry
					,	hideDefaults: Configuration.get('currentTouchpoint') !== 'customercenter'
					,	application: this.options.application
					// custom: add manage
					,   manage: this.manage
					
				});
			}
		}
	,
        events: _.extend({}, AddressEditView.prototype.events, {
            'change .addressValidationField':'validateAddresses'
        })
	,
        validateAddresses: function(){
                // console.log('Main Function Triggered!');
            //var for the generated url for the service
            var addressValidationServiceURL = 'services/AddressValidation.Service.ss';
            //arr to hold all address fields
            var addressFormsArr = document.getElementsByClassName('address-edit-fields');

            //clear the address validation options from a given form
            function clearValidationResults(index){
                addressFormsArr[index].getElementsByClassName('address-validation-row')[0].innerHTML = '';
            }

            //queries the suitescript service and builds array of results for a given form
            function queryValidationApi(index){
                    // console.log('queryValidationApi called with index '+index+'!');
                //select the form we want
                var addressForm = addressFormsArr[index];
                //create the array of addresses and populate it with the inputted data
                var addressesArr = [{
                    addr1	:	addressForm.getElementsByClassName('address-validation-addr1')[0].value,
                    addr2	:	addressForm.getElementsByClassName('address-validation-addr2')[0].value,
                    state	:	addressForm.getElementsByClassName('address-validation-state')[0].getElementsByTagName('select')[0].value,
                    city	:	addressForm.getElementsByClassName('address-validation-city')[0].value,
                        zip		:	addressForm.getElementsByClassName('address-validation-zip')[0].value,
                        isresidential: jQuery(addressForm).find('input[name="isresidential"]').is(':checked')
                }];
                //create a url encoded object to send to the server
                var addressObj = {
                    addr1	:	encodeURI(addressForm.getElementsByClassName('address-validation-addr1')[0].value),
                    addr2	:	encodeURI(addressForm.getElementsByClassName('address-validation-addr2')[0].value),
                    state	:	encodeURI(addressForm.getElementsByClassName('address-validation-state')[0].getElementsByTagName('select')[0].value),
                    city	:	encodeURI(addressForm.getElementsByClassName('address-validation-city')[0].value),
                    zip		:	encodeURI(addressForm.getElementsByClassName('address-validation-zip')[0].value)
                };

                /*var testAddressesArr = [
                    {
                        addr1	:	addressForm.getElementsByClassName('address-validation-addr1')[0].value,
                        addr2	:	addressForm.getElementsByClassName('address-validation-addr2')[0].value,
                        state	:	addressForm.getElementsByClassName('address-validation-state')[0].getElementsByTagName('select')[0].value,
                        city	:	addressForm.getElementsByClassName('address-validation-city')[0].value,
                        zip		:	addressForm.getElementsByClassName('address-validation-zip')[0].value
                    },
                    {
                        addr1	:	'W '+addressForm.getElementsByClassName('address-validation-addr1')[0].value,
                        addr2	:	addressForm.getElementsByClassName('address-validation-addr2')[0].value,
                        state	:	addressForm.getElementsByClassName('address-validation-state')[0].getElementsByTagName('select')[0].value,
                        city	:	addressForm.getElementsByClassName('address-validation-city')[0].value,
                        zip		:	addressForm.getElementsByClassName('address-validation-zip')[0].value
                    },
                    {
                        addr1	:	'E '+addressForm.getElementsByClassName('address-validation-addr1')[0].value,
                        addr2	:	addressForm.getElementsByClassName('address-validation-addr2')[0].value,
                        state	:	addressForm.getElementsByClassName('address-validation-state')[0].getElementsByTagName('select')[0].value,
                        city	:	addressForm.getElementsByClassName('address-validation-city')[0].value,
                        zip		:	addressForm.getElementsByClassName('address-validation-zip')[0].value
                    }
                ];

                buildDomElements(index, testAddressesArr);

                */

                //make ajax request to service
                $.get(addressValidationServiceURL, addressObj)
                    .done(function(data) {
                                // console.log(decodeURI(data));
                            data = JSON.parse(decodeURI(data));

                            var addressValidationContainer = addressFormsArr[index].getElementsByClassName('address-validation-container')[0];

                            //check for null or no results
                            if (data && data != null && data.length > 0){
                                addressValidationContainer.style.display = 'block';
                                //loop through and decode addresses
                                for (var i = 0; i < data.length; i++){
                                    addressesArr.push(data[i]);
                                }
                                    // console.log(data);
                                //send array of decoded objects to be added to dom
                                buildDomElements(index, addressesArr);
                            }
                            //if there are no results
                            else if (data && data != null && data.length == 0){
                                addressValidationContainer.style.display = 'block';
                                    // console.log('No matches!');
                                //send array containing entry data to be added to dom
                                buildDomElements(index, addressesArr);
                            }
                        }
                    );

            }

            //update a given form with values from a given option after selection
            function updateAddressForm(index){
                    // console.log('updateAddressForm called with index '+index+'!');
                //select options row
                var addressValidationRow = addressFormsArr[index].getElementsByClassName('address-validation-row')[0];
                //select input element that holds data attributes
                var addressValidationInputs = addressValidationRow.getElementsByTagName('input');


                for (var i = 0; i < addressValidationInputs.length; i++){
                    if (addressValidationInputs[i].checked){
                        //set input elements to matching data attributes from selected radio input
                        addressFormsArr[index].getElementsByClassName('address-validation-addr1')[0].value = addressValidationInputs[i].getAttribute('data-addr1');
                        addressFormsArr[index].getElementsByClassName('address-validation-addr2')[0].value = addressValidationInputs[i].getAttribute('data-addr2');
                        addressFormsArr[index].getElementsByClassName('address-validation-state')[0].getElementsByTagName('select')[0].value = addressValidationInputs[i].getAttribute('data-state');
                        addressFormsArr[index].getElementsByClassName('address-validation-city')[0].value = addressValidationInputs[i].getAttribute('data-city');
                        addressFormsArr[index].getElementsByClassName('address-validation-zip')[0].value = addressValidationInputs[i].getAttribute('data-zip');
                            jQuery(addressFormsArr[index]).find('input[name="isresidential"]').prop('checked', addressValidationInputs[i].getAttribute('data-isresidential') == 'true');
                    }
                }
            }

            //create html objects for address validation options and add to selected form
            function buildDomElements(index, addressesArr){
                    // console.log('buildDomElements called with index '+index+' and an addressesArr of '+JSON.stringify(addressesArr)+'!');
                //clear any old options
                clearValidationResults(index);
                //select the form and row for options
                var addressValidationRow = addressFormsArr[index].getElementsByClassName('address-validation-row')[0];
                //select all verification input elements
                var addressFormInputsArr = addressFormsArr[index].getElementsByClassName('addressValidationField');
                //loop through results and create + append elements to options row

                if (addressesArr.length == 1) {
                    var validationColumn = document.createElement('div');
                    validationColumn.className += 'col-md-4 col-sm-12 col-xs-12 address-validation-column';
                    validationColumn.innerHTML = '<p>Unable to locate this address.  Are you sure this is correct?</p>';
                    addressValidationRow.appendChild(validationColumn);
                }

                for (var i = 0; i < addressesArr.length; i++){
                    var validationColumn = document.createElement('div');
                    validationColumn.className += 'col-md-4 col-sm-12 col-xs-12 address-validation-column';
                        validationColumn.innerHTML = '<label><div class="col-12"><input type="radio" id="form'+index+'Option'+i+'" class="address-validation-radio" name="validatedAddress" data-addr1="'+addressesArr[i].addr1+'" data-addr2="'+addressesArr[i].addr2+'" data-state="'+addressesArr[i].state+'" data-city="'+addressesArr[i].city+'" data-zip="'+addressesArr[i].zip+'" data-isresidential="'+addressesArr[i].isresidential+'" /></div><div class="col-12"><p class="address-validation-text"><span>'+addressesArr[i].addr1+'</span><span>'+addressesArr[i].addr2+'</span><span>'+addressesArr[i].city+', '+addressesArr[i].state+' '+addressesArr[i].zip+'</span></p></div></label>';
                    addressValidationRow.appendChild(validationColumn);
                }
                //loop through verification inputs and set data-address-validated attribute to true
                for (var i = 0; i < addressFormInputsArr.length; i++){
                    addressFormInputsArr[i].setAttribute('data-address-validated', 'true');
                }
                var allRadios = addressFormsArr[index].getElementsByClassName('address-validation-radio');
                for (var i = 0; i < allRadios.length; i++){
                    allRadios[i].addEventListener('change',function(){
                        updateAddressForm(index);
                    });
                }
            }



            //loop through address forms and check for unvalidated addresses
            for (var i = 0; i < addressFormsArr.length; i++){
                var addressFormInputsArr = addressFormsArr[i].getElementsByClassName('addressValidationField');
                var isValidated = true;
                var requiredFieldsFilled = true;

                for (var n = 0; n < addressFormInputsArr.length; n++){
                    if (addressFormInputsArr[n].getAttribute('data-address-validated') == 'false'){
                            // console.log('Non validated address found at index '+i+' input '+n);
                        isValidated = isValidated && false;
                    }
                    if (addressFormInputsArr[n].value != '' || addressFormInputsArr[n].getAttribute('name') == 'addr2'){
                        requiredFieldsFilled = requiredFieldsFilled && true;
                    }
                    else{
                        requiredFieldsFilled = requiredFieldsFilled && false;
                    }

                        // console.log('n = ' + n +', isValidated = ' + isValidated + ', requiredFieldsFilled = ' + requiredFieldsFilled);
                }

                if (isValidated == false && requiredFieldsFilled == true){
                        // console.log('Querying index '+i);
                    queryValidationApi(i);
                }
            }
        }
	});

});