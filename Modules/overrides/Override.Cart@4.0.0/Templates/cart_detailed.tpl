{{!
	© 2017 LN Curtis
}}

<div class="cart-detailed">
{{#if showLines}}
	<div class="cart-detailed-view-header">
		<header class="cart-detailed-header">
			<h1 class="cart-detailed-title">
				{{pageHeader}}
				<small class="cart-detailed-title-details-count">
					{{productsAndItemsCount}}
				</small>
			</h1>
			<div class="cart-detailed-print-page">
				<a href="#" data-action="print-page"><i class="fa fa-print"></i></a>
			</div>
		</header>
	</div>
	<div data-type="alert-placeholder-main"></div>
	<div class="cart-detailed-body">
		<section class="cart-detailed-left">
			<div class="cart-detailed-proceed-to-checkout-container">
				<a class="cart-detailed-proceed-to-checkout" data-action="sticky" href="#" data-touchpoint="checkout" data-hashtag="#">
						{{translate 'Proceed to Checkout'}}
				</a>
			</div>
			<div data-confirm-message class="cart-detailed-confirm-message"></div>

			<table class="cart-detailed-product-view-cell-actionable-table-outer">
				<thead>
					<tr>
						<th class="product-views-cell-actionable-table-header-first">
							Item
						</th>
						<th class="product-views-cell-actionable-table-header-middle product-views-cell-actionable-table-header-amount">
							<span>Price</span>
						</th>
						<th class="product-views-cell-actionable-table-header-middle product-views-cell-actionable-table-header-quantity">
							<span>Quantity</span>
						</th>
						<th class="product-views-cell-actionable-table-header-last">
							Total
						</th>
					</tr>
				</thead>
				<tbody data-view="Item.ListNavigable"></tbody>
			</table>

		</section>
		<section class="cart-detailed-right">
			<div data-view="Cart.Summary"></div>
		</section>
	</div>
	<div class="cart-detailed-footer">
		<div data-type="saved-for-later-placeholder" class="cart-detailed-savedforlater"></div>
		<div data-view="RecentlyViewed.Items" class="cart-detailed-recently-viewed" itemscope="" itemtype="https://schema.org/ItemList"></div>
		<div data-view="Related.Items" class="cart-detailed-related" itemscope="" itemtype="https://schema.org/ItemList"></div>
		<div data-view="Correlated.Items" class="cart-detailed-correlated" itemscope="" itemtype="https://schema.org/ItemList"></div>
	</div>
{{else}}
	<section class="cart-detailed-body-empty">
		<h2 class="cart-detailed-body-empty-title">{{translate 'Your Shopping Cart is empty'}}</h2>
		<p class="cart-detailed-body-empty-info">
			{{translate 'Continue Shopping on our <a href="/" data-touchpoint="home">Home Page</a>' }}
		</p>
		<div data-type="saved-for-later-placeholder" class="cart-detailed-row-fluid"></div>
	</section>
{{/if}}
</div>