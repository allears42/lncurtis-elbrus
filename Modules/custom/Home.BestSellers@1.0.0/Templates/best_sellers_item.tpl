<div class="facets-item-cell-grid bestseller" data-type="item" data-item-id="{{itemId}}" itemprop="itemListElement" itemscope="" itemtype="http://schema.org/Product" data-track-productlist-list="{{track_productlist_list}}" data-track-productlist-category="{{track_productlist_category}}" data-track-productlist-position="{{track_productlist_position}}" data-sku="{{sku}}">
    <meta itemprop="url" content="{{url}}"/>

    <div class="facets-item-cell-grid-image-wrapper">
        <a class="facets-item-cell-grid-link-image" href="{{url}}">
            <img class="facets-item-cell-grid-image" src="{{resizeImage thumbnail.url 'thumbnail'}}" alt="{{thumbnail.altimagetext}}" itemprop="image"/>
        </a>
        <!--{{#if isEnvironmentBrowser}}-->
        <!--<div class="facets-item-cell-grid-quick-view-wrapper">-->
            <!--<a href="{{url}}" class="facets-item-cell-grid-quick-view-link" data-toggle="show-in-modal">-->
                <!--<i class="facets-item-cell-grid-quick-view-icon"></i>-->
                <!--{{translate 'Quick View'}}-->
            <!--</a>-->
        <!--</div>-->
        <!--{{/if}}-->
    </div>

    <div class="facets-item-cell-grid-details">
        <a class="facets-item-cell-grid-title" href="{{url}}">
            <span itemprop="name">{{name}}</span>
        </a>

        <div class="facets-item-cell-grid-price bestseller-price" data-view="Bestseller.Price"></div>
        <a href="{{url}}" class="view-more-button">{{translate 'View More'}}</a>
    </div>
</div>


