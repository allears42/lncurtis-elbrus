{{!
	© 2017 Satellite Commerce
	Better formatting for cart line items
}}

<div class="global-views-format-payment-method">
	{{#if isCreditcard}}
		<div class="global-views-format-payment-method-header">
			{{#if showCreditCardImage}}
				<i class="fa fa-cc-{{iconClass}} global-views-format-payment-method-header-icon"></i>
			{{else}}

				{{creditCardPaymentMethodName}}
			{{/if}}
			<p class="global-views-format-payment-method-number"> &ndash; {{translate 'Ending in $(0)' creditCardNumberEnding}}</p>
		</div>
		<p class="global-views-format-payment-method-name">{{creditCard.ccname}}</p>
		<p class="global-views-format-payment-method-expdate">{{translate 'Expires $(0)' creditCard.ccexpiredate}}</p>

		{{#if showPurchaseNumber}}
			<p class="global-views-format-payment-method-purchase">{{translate 'Purchase Number: $(0)' model.purchasenumber }}</p>
	{{/if}}
	{{/if}}

	{{#if isGiftCertificate}}
		<p class="global-views-format-payment-method-gift-certificate">{{translate 'Ending in $(0)' giftCertificateEnding}}</p>
	{{/if}}

	{{#if isInvoice}}
		<p class="global-views-format-payment-method-invoice">{{translate model.paymentterms.name}}</p>
		
		{{#if showPurchaseNumber}}
			<p class="global-views-format-payment-method-purchase">{{translate 'Purchase Number: $(0)' model.purchasenumber }}</p>
		{{/if}}
	{{/if}}

	{{#if isPaypal}}
		<p class="global-views-format-payment-method-paypal">{{translate 'Payment via Paypal'}}</p>
		{{#if showPurchaseNumber}}
			<p class="global-views-format-payment-method-purchase">{{translate 'Purchase Number: $(0)' model.purchasenumber }}</p>
		{{/if}}
	{{/if}}

	{{#if isOther}}
		{{name}}

		{{#if showPurchaseNumber}}
			<p class="global-views-format-payment-method-purchase">{{translate 'Purchase Number: $(0)' model.purchasenumber }}</p>
		{{/if}}
	{{/if}}

	{{#if showStreet}}
			<p class="global-views-format-payment-method-street">{{translate 'Card Street: <span class="global-views-format-payment-method-street-value">$(0)</span>' model.ccstreet }}</p>
	{{/if}}
	{{#if showZipCode}}
		<p class="global-views-format-payment-method-zip">{{translate 'Card Zip Code: <span class="global-views-format-payment-method-zip-value">$(0)</span>' model.cczipcode }}</p>
	{{/if}}
</div>