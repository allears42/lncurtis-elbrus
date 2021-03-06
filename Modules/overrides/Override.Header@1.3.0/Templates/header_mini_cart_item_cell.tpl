{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<li class="header-mini-cart-item-cell" data-item-id="{{itemId}}" data-item-type="{{itemType}}">
	<a {{{linkAttributes}}}>
		<div class="header-mini-cart-item-cell-image">
			<img src="{{image}}?resizeh=60" alt="{{line.item._thumbnail.altimagetext}}">
		</div>
	</a>
	<div class="header-mini-cart-item-cell-details">
		<ul>
			<li class="header-mini-cart-item-cell-product-title">
				<a {{{linkAttributes}}} class="header-mini-cart-item-cell-title-navigable">{{line.item._name}}</a>
			</li>

			{{#if isPriceEnabled}}
				<li class="header-mini-cart-item-cell-product-price">{{line.rate_formatted}}</li>
			{{else}}
				<li>
					{{translate '<a data-touchpoint="login" data-hashtag="login-register" origin-hash="" href="#">Login</a> to see price'}}
				</li>
			{{/if}}

			<!--<div data-view="Item.SelectedOptions"></div>-->
			<li class="header-mini-cart-item-cell-product-qty">
		    	<span class="header-mini-cart-item-cell-quantity-label">
					{{translate 'Quantity: '}}
				</span>
				<span class="header-mini-cart-item-cell-quantity-value">
					{{line.quantity}}
				</span>
			</li>
			<li class="header-mini-cart-item-cell-product-stock">
		    	<div data-view="Item.Stock"></div>
			</li>
		</ul>
	</div>
</li>