{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="facets-item-cell-grid item-cell" data-type="item" data-item-id="{{itemId}}" itemprop="itemListElement" itemscope="" itemtype="https://schema.org/Product" data-track-productlist-list="{{track_productlist_list}}" data-track-productlist-category="{{track_productlist_category}}" data-track-productlist-position="{{track_productlist_position}}" data-sku="{{sku}}">
	<meta itemprop="url" content="{{seoURL}}"/>

	<div class="facets-item-cell-grid-image-wrapper">
		<a class="facets-item-cell-grid-link-image" href="{{url}}">
			<img class="facets-item-cell-grid-image" src="{{resizeImage thumbnail.url 'list_grid'}}" alt="{{thumbnail.altimagetext}}" itemprop="image"/>
		</a>
		{{#if isEnvironmentBrowser}}
		<a href="{{url}}" class="facets-item-cell-grid-quick-view-wrapper"  data-toggle="show-in-modal">
			<span class="facets-item-cell-grid-quick-view-link">
				<i class="facets-item-cell-grid-quick-view-icon"></i>
				<span>{{translate 'Quick'}}</span>
				{{translate 'View'}}
			</span>
		</a>
		{{/if}}
	</div>

	<div class="facets-item-cell-grid-details">
		<a class="facets-item-cell-grid-title" href="{{url}}">
			<span itemprop="name">{{name}}</span>
		</a>

		<div class="facets-item-cell-grid-price" data-view="ItemViews.Price">
		</div>

		<!--{{#if showRating}}
		<div class="facets-item-cell-grid-rating" itemprop="aggregateRating" itemscope="" itemtype="http://schema.org/AggregateRating" data-view="GlobalViews.StarRating">
		</div>
		{{/if}}-->

		<div data-view="ItemDetails.Options"></div>
		<!--<div class="facets-item-cell-grid-stock">
			<div data-view="ItemViews.Stock"></div>
		</div>-->
		<!--<div class="facets-item-cell-grid-sku">
			Item # {{sku}}
		</div>-->
		{{#if canAddToCart}}
		<form class="facets-item-cell-grid-add-to-cart" data-toggle="add-to-cart">
			<input class="facets-item-cell-grid-add-to-cart-itemid" type="hidden" value="{{itemId}}" name="item_id"/>
			<div class="col-xs-4">
				<input name="quantity" class="facets-item-cell-grid-add-to-cart-quantity" min="{{minQuantity}}" value="{{minQuantity}}" {{#if setMaxQuantity}}max="{{maxQuantity}}"{{/if}}/>
			</div>
			<div class="col-xs-8 facets-item-cell-grid-add-to-cart-button-outer">
				<input type="submit" class="facets-item-cell-grid-add-to-cart-button" value="{{translate 'Add to Cart'}}"/>
			</div>
			<div data-type="alert-placeholder-module"></div>
		</form>
		{{else}}
			<a href="{{url}}" class="facets-item-cell-grid-view-details-button">{{translate 'View All Options'}}</a>
		{{/if}}
	</div>
</div>
