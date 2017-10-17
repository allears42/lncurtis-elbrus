{{!
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="product-details-full">
	<div data-cms-area="item_details_banner" data-cms-area-filters="page_type"></div>

	<header class="product-details-full-header">
		<div id="banner-content-top" class="product-details-full-banner-top"></div>
	</header>

	<!--<div class="product-details-full-divider-desktop"></div>-->
	<article class="product-details-full-content" itemscope itemtype="https://schema.org/Product">
		<meta itemprop="url" content="{{itemUrl}}">
		<div id="banner-details-top" class="product-details-full-banner-top-details"></div>

		<section class="product-details-full-main-content">
			<div class="product-details-full-content-header">
				<h1 class="product-details-full-content-header-title" itemprop="name">{{pageHeader}}</h1>
				<!--<div class="product-details-full-rating" data-view="Global.StarRating"></div>-->
				<div data-cms-area="item_info" data-cms-area-filters="path"></div>
			</div>
			<div class="product-details-full-main-content-left">
				<div class="product-details-full-image-gallery-container">
					<div id="banner-image-top" class="content-banner banner-image-top"></div>
					<div data-view="Product.ImageGallery"></div>
					<div id="banner-image-bottom" class="content-banner banner-image-bottom"></div>
				</div>
			</div>

			<div class="product-details-full-main-content-right">

				<div class="product-details-upper-info-outer">
					<div data-view="Product.Price"></div>
					<div data-view="Product.Sku" class="product-details-sku-container"></div>
				</div>
				<div class="product-details-full-divider"></div>

				<div class="product-details-full-main">
					{{#if isItemProperlyConfigured}}
						<form id="product-details-full-form" data-action="submit-form" method="POST">

							<section class="product-details-full-info">
								<div id="banner-summary-bottom" class="product-details-full-banner-summary-bottom"></div>
							</section>

							<section class="product-details-options-single">

								<div data-view="Product.Options.Single" class="product-details-options-singles"></div>
							</section>

							<section data-view="Product.Options"></section>

							<div data-view="Quantity.Pricing"></div>
							{{#unless isCallForPricing}}
								<div data-view="Product.Stock.Info"></div>
							{{/unless}}

							{{#if isPriceEnabled}}
								<div data-view="Quantity"></div>
								<section class="product-details-full-actions row">
									{{#unless isCallForPricing}}
										<div class="col-sm-6">
											<div class="product-details-full-actions-container">
												<div data-view="MainActionView"></div>
											</div>
										</div>
									{{/unless}}
									<div class="col-sm-6">
										{{#if callForPricing}}
											<div data-view="Product.Stock.Info"></div>
											<div data-view="StockDescription"></div>
										{{/if}}
										<div class="product-details-full-actions-container">
											<div data-view="AddToProductList" class="product-details-full-actions-addtowishlist"></div>
											<!--<div data-view="ProductDetails.AddToQuote" class="product-details-full-actions-addtoquote"></div>-->
										</div>
									</div>

								</section>
							{{/if}}

							{{#unless isCallForPricing}}
								<div data-view="StockDescription"></div>
							{{/unless}}

							<div data-view="SocialSharing.Flyout" class="product-details-full-social-sharing"></div>

							<div class="product-details-full-main-bottom-banner">
								<div id="banner-summary-bottom" class="product-details-full-banner-summary-bottom"></div>
							</div>
						</form>
						<div class="row">
							<div class="col-sm-6 col-md-8 col-lg-7">
								<a class="product-details-curtis-commitment" href="#" data-toggle="modal" data-target="#the_curtis_difference">
									<p class="curtis-commitment-line-one"><span>The Curtis</span>Difference</p>
									<p class="curtis-commitment-line-two">Our Commitment<span>To You</span></p>
								</a>
								<div class=" modal fade" id="the_curtis_difference" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
									<div class="modal-dialog global-views-modal" role="document">
										<div class="global-views-modal-content">
											<div id="curtis_care_content" data-cms-area="curtis_care_content" data-cms-area-filters="page_type"></div>
											<div class="modal-header global-views-modal-content-header">
												<button type="button" class="global-views-modal-content-header-close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
												<h2 class="global-views-modal-content-header-title">{{curtisCarePopoverTitle}}</h2>
											</div>
											<div class=" global-views-modal-content-body">
												{{{curtisCarePopover}}}
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="col-sm-6 col-md-4 col-lg-5">
								<div class="product-details-print-page">
									<a href="#" data-action="print-page"><i class="fa fa-print"></i></a>
								</div>
								<div class="product-details-email-page">
									<a href="mailto:?subject=Curtis Product Info&body=I thought you might have interest in this product from Curtis: {{origin}}{{itemUrl}}" target="_blank"><i class="fa fa-envelope"></i></a>
								</div>
							</div>
						</div>
					{{else}}
						<div data-view="GlobalViewsMessageView.WronglyConfigureItem"></div>
					{{/if}}

					<div id="banner-details-bottom" class="product-details-full-banner-details-bottom" data-cms-area="item_info_bottom" data-cms-area-filters="page_type"></div>
				</div>
			</div>

		</section>

		<section data-view="Product.Information"></section>

		<div class="product-details-full-divider-desktop"></div>

		<!--<div data-view="ProductReviews.Center"></div>-->

		<div class="product-details-full-content-related-items">
			<div data-view="Related.Items"></div>
		</div>

		<div class="product-details-full-content-correlated-items">
			<div data-view="Correlated.Items"></div>
		</div>
		<div id="banner-details-bottom" class="content-banner banner-details-bottom" data-cms-area="item_details_banner_bottom" data-cms-area-filters="page_type"></div>
	</article>
</div>



{{!----
Use the following context variables when customizing this template: 
	
	model (Object)
	model.item (Object)
	model.item.internalid (Number)
	model.item.type (String)
	model.quantity (Number)
	model.options (Array)
	model.options.0 (Object)
	model.options.0.cartOptionId (String)
	model.options.0.itemOptionId (String)
	model.options.0.label (String)
	model.options.0.type (String)
	model.location (String)
	model.fulfillmentChoice (String)
	pageHeader (String)
	itemUrl (String)
	isItemProperlyConfigured (Boolean)
	isPriceEnabled (Boolean)

----}}
