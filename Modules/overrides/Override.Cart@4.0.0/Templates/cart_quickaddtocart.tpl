{{!
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div data-view="ProductViewsPrice.Price" class="cart-quickaddtocart-price"></div>
<form class="cart-quickaddtocart" data-action="add-to-cart">
	{{#if showQuickAddToCartButton}}
		<div class="col-xs-4">
			<input name="quantity" data-action="setquantity" class="cart-quickaddtocart-quantity" type="number" min="{{minimumQuantity}}" value="{{quantity}}"/>
		</div>
		<div data-view="AddToCart" class="col-xs-8"></div>
	{{else}}
		<a href="{{url}}" class="cart-quickaddtocart-view-details-button">{{translate 'View All Options'}}</a>
	{{/if}}
</form>




{{!----
Use the following context variables when customizing this template: 
	
	itemId (Number)
	showQuickAddToCartButton (Boolean)
	minimumQuantity (Number)
	quantity (Number)

----}}
