{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="address-edit-fields">
	<div data-type="alert-placeholder"></div>

	<small class="address-edit-fields">{{translate 'Required'}} <span class="address-edit-fields-required">*</span></small>
	<div class="address-edit-fields-group" data-input="fullname" data-validation="control-group">
		<label class="address-edit-fields-group-label" for="{{manage}}fullname">
			{{translate 'Full Name'}} <span class="address-edit-fields-group-label-required">*</span>
		</label>
		<div  class="address-edit-fields-group-form-controls" data-validation="control">
			<input type="text" class="address-edit-fields-group-input" id="{{manage}}fullname" name="fullname" value="{{fullName}}">
		</div>
	</div>
	{{#if showCompanyField}}
	<div class="address-edit-fields-group" {{#if isCompanyFieldMandatory}} data-input="company" data-validation="control-group" {{/if}}>
		<label class="address-edit-fields-group-label" for="{{manage}}company">
			{{translate 'Company'}}
			{{#if isCompanyFieldMandatory}}
				 <span class="address-edit-fields-group-label-required">*</span>
			{{else}}
				<p class="address-edit-fields-company-optional-label">{{translate '(optional)'}}</p>
			{{/if}}
		</label>
		<div  class="address-edit-fields-group-form-controls" {{#if isCompanyFieldMandatory}} data-validation="control" {{/if}}>
			<input type="text" class="address-edit-fields-group-input" id="{{manage}}company" name="company" value="{{company}}" >
		</div>
	</div>
	{{/if}}

	<div class="row">
		<div class="col-md-7 col-xs-12 col-sm-7">
			<div class="address-edit-fields-group" data-input="addr1" data-validation="control-group">
				<label class="address-edit-fields-group-label" for="{{manage}}addr1">
					{{translate 'Address'}} <span class="address-edit-fields-input-required">*</span>
				</label>
				<div class="address-edit-fields-group-form-controls" data-validation="control">
					<input type="text" onchange="this.setAttribute('data-address-validated','false');" class="address-validation-addr1 addressValidationField address-edit-fields-group-input" id="{{manage}}addr1" name="addr1" data-address-validated="false" value="{{addressLine1}}" placeholder="Example: 1234 Main Street">
					<p class="address-edit-fields-input-help">{{translate 'Example: 1234 Main Street'}}</p>
				</div>
			</div>
		</div>
		<div class="col-md-5 col-xs-12 col-sm-5">
			{{#if showAddressFormSecondAddress}}
			<div class="address-edit-fields-group address-edit-fields-group-big" data-input="addr2">
				<label for="{{manage}}addr2" class="address-edit-fields-group-label">
					{{translate 'Address 2'}}
				</label>
				<div>
						<input type="text" onchange="this.setAttribute('data-address-validated','false');" data-address-validated="false" class="address-validation-addr2 addressValidationField address-edit-fields-group-input" id="{{manage}}addr2" name="addr2" value="{{addressLine2}}" placeholder="Apt or Suite (optional)">
						<p class="address-edit-fields-input-help">{{translate 'Apt or Suite'}}</p>
				</div>
			</div>
			{{/if}}
		</div>
	</div>

	<div class="address-edit-fields-group {{#unless showCountriesField}} hide {{/unless}}" data-view="CountriesDropdown" data-input="country" data-validation="control-group">
	</div>
	<div class="row">
		<div class="col-md-5 col-xs-12 col-sm-5">
			<div class="address-edit-fields-group" data-input="city" data-validation="control-group">
				<label class="address-edit-fields-group-label" for="{{manage}}city">
					{{translate 'City'}} <span class="address-edit-fields-input-required">*</span>
				</label>
				<div  class="address-edit-fields-group-form-controls" data-validation="control">
					<input type="text" onchange="this.setAttribute('data-address-validated','false');" data-address-validated="false" class="address-validation-city addressValidationField address-edit-fields-group-input" id="{{manage}}city" name="city" value="{{city}}">
				</div>
			</div>
		</div>
		<div class="col-md-4 col-xs-12 col-sm-4 address-edit-fields-address">
			<div class="address-validation-state addressValidationField address-edit-fields-group" data-address-validated="false" data-input="state" data-view="StatesView" data-validation="control-group">
			</div>
			{{#if showShippingMessage}}
				<a data-action="show-shipping-info" class="order-wizard-address-module-shipping-restriction-link">States that we can't ship to</a>
			{{/if}}
		</div>
		<div class="col-md-3 col-xs-12 col-sm-3 address-edit-fields-zip">
			<div class="address-edit-fields-group" data-input="zip" {{#if isZipOptional}} style="display: none;" {{/if}} data-validation="control-group">
				<label class="address-edit-fields-group-label" for="{{manage}}zip">
					{{translate 'Zip Code'}} <span class="address-edit-fields-input-required">*</span>
				</label>
				<div  class="address-edit-fields-group-form-controls" data-validation="control">
					<input type="text" onchange="this.setAttribute('data-address-validated','false');" data-address-validated="false" class="address-validation-zip addressValidationField address-edit-fields-group-input-zip" id="{{manage}}zip" name="zip" value="{{zip}}" data-type="zip" placeholder="Example: 94117">
					<p class="address-edit-fields-input-help">{{translate 'Example: 94117'}}</p>
				</div>
			</div>
		</div>
	</div>

	<div class="address-edit-fields-group"  data-input="phone" data-validation="control-group">
		<label class="address-edit-fields-group-label" for="{{manage}}phone">
			{{translate 'Phone Number'}} <span class="address-edit-fields-input-required">*</span>
		</label>
		<div  class="address-edit-fields-group-form-controls" data-validation="control">
			<input type="tel" class="address-edit-fields-group-input" id="{{manage}}phone" name="phone" value="{{phone}}" data-action="inputphone">
			<p class="address-edit-fields-input-help">{{translate 'Example: 555-123-1234'}}</p>
		</div>
	</div>

	<!-- Anchor for address validation controls -->
    <div class="container-fluid address-validation-container" style="display:none;">
        <h3 class="address-validation-alert">PLEASE VERIFY YOUR ADDRESS...</h3>
        <div class="row address-validation-row"></div>
    </div>

	<div class="address-edit-fields-group" data-input="isresidential">
		<label class="address-edit-fields-group-input-checkbox">
			<input type="checkbox" id="{{manage}}isresidential" value="T" data-unchecked-value="F" name="isresidential" {{#if isAddressResidential}} checked {{/if}} >
			{{translate 'This is a Residential Address'}}
			<i class="address-edit-fields-icon-question-sign" data-toggle="tooltip" title="" data-original-title="{{translate 'Indicating that this is a residential address will help us determine the best delivery method for your items.'}}"></i>
		</label>
	</div>


	{{#if showDefaultControls}}
		<div class="address-edit-fields-group" data-input="defaultbilling">
			<label class="address-edit-fields-group-input-checkbox">
				<input type="checkbox" id="{{manage}}defaultbilling" value="T" data-unchecked-value="F" name="defaultbilling" {{#if isAddressDefaultBilling}} checked {{/if}}>
				{{#if isCurrentTouchPointCheckout}}
					{{translate 'Save as my primary billing address'}}
				{{else}}
					{{translate 'Make this my default billing address'}}
				{{/if}}
			</label>
		</div>

		<div class="address-edit-fields-group" data-input="defaultshipping">
			<label class="address-edit-fields-group-input-checkbox">
				<input type="checkbox" id="{{manage}}defaultshipping" value="T" data-unchecked-value="F" name="defaultshipping" {{#if isAddressDefaultShipping}} checked {{/if}}>
				{{#if isCurrentTouchPointCheckout}}
					{{translate 'Save as my primary shipping address'}}
				{{else}}
					{{translate 'Make this my default shipping address'}}
				{{/if}}
			</label>
		</div>
	{{/if}}
</div>