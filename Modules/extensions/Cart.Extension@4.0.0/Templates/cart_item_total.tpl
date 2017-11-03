{{!
	© 2017 LN Curtis
}}

{{#if isPriceEnabled}}
	<div class="cart-item-summary-item-list-actionable-amount">
		<span class="cart-item-summary-item-list-actionable-amount-label">{{translate 'Amount: ' }}</span>
		<span class="cart-item-summary-amount-value">{{ line.total_formatted}}</span>
		<!--{{#if showComparePrice}}
			<small class="muted cart-item-summary-item-view-old-price">{{ line.amount_formatted}}</small>
		{{/if}}-->
	</div>
{{/if}}




{{!----
Use the following context variables when customizing this template: 
	
	line (Object)
	line.item (Object)
	line.item.internalid (Number)
	line.item.type (String)
	line.quantity (Number)
	line.internalid (String)
	line.options (Array)
	line.location (String)
	line.fulfillmentChoice (String)
	lineId (String)
	isMinusButtonDisabled (Boolean)
	showQuantity (Boolean)
	showComparePrice (Boolean)
	showMinimumQuantity (Boolean)
	minimumQuantity (Number)
	isPriceEnabled (Boolean)

----}}
