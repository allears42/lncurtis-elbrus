{{!
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="product-details-information-content">
	{{#if showInformation}}
		{{#each details}}
			{{!-- Mobile buttons --}}
			<button class="product-details-information-pusher" data-target="product-details-information-{{ @index }}" data-type="sc-pusher">
				{{ name }} <i></i>
				<p class="product-details-information-hint"> {{{trimHtml content 150}}} </p>
			</button>
		{{/each}}

		<!-- size chart pusher -->
		{{#if showSizeChart}}
			<button class="product-details-information-pusher" data-target="product-details-information-size-chart" data-type="sc-pusher">
				Size Chart <i></i>
			</button>
		{{/if}}

		<!-- reviews pusher -->
		{{#if showReviews}}
			<button class="product-details-information-pusher" data-target="product-details-information-reviews" data-type="sc-pusher">
				Reviews<i></i>
			</button>
		{{/if}}

		<div class="product-details-information-content-container">

			<div id="banner-content-top" class="content-banner banner-content-top"></div>

			<div role="tabpanel">
				{{!-- When more than one detail is shown, these are the tab headers  --}}
				<ul class="product-details-information-content-tabs" role="tablist">
					{{#each details}}
						<li class="product-details-information-tab-title {{#if @first}} active {{/if}}" role="presentation">
							<a href="#" data-action="selected-tab" data-id="{{@index}}" data-target="#product-details-information-tab-{{@index}}" data-toggle="tab">{{name}}</a>
						</li>
					{{/each}}
					<!-- size chart link -->
					{{#if showSizeChart}}
						<li class="product-details-information-tab-title size-charts" role="presentation">
							<a href="#" data-target="#size_chart" data-toggle="tab">Size Chart</a>
						</li>
					{{/if}}
					<!-- reviews link -->
					{{#if showReviews}}
						<li class="product-details-information-tab-title reviews" role="presentation">
							<a href="#" data-target="#reviews" data-toggle="tab">Reviews</a>
						</li>
					{{/if}}
				</ul>
				{{!-- Tab Contents --}}
				<div class="product-details-information-tab-content" data-type="information-content" data-action="tab-content">
					{{#each details}}
						<div role="tabpanel" class="product-details-information-tab-content-panel {{#if @first}}active{{/if}}" id="product-details-information-tab-{{@index}}" itemprop="{{itemprop}}" data-action="pushable" data-id="product-details-information-{{ @index }}">
							<!--{{#if ../showHeader}}<h2 class="product-details-information-tab-content-panel-title">{{name}}</h2>{{/if}}-->
							<div id="product-details-information-tab-content-container-{{@index}}" class="product-details-information-tab-content-container" data-type="information-content-text">{{{content}}}</div>
						</div>
					{{/each}}
					<!--<div class="product-details-information-tab-action" data-type="information-content-text-actions">
						<a href="#" class="product-details-information-tab-action-more" data-action="show-more">{{translate 'See More'}}</a>
						<a href="#" class="product-details-information-tab-action-less" data-action="show-more">{{translate 'See Less'}}</a>
					</div>-->
					{{#if showSizeChart}}
						<div role="tabpanel" class="product-details-information-tab-content-panel" id="size_chart" itemprop="{{itemprop}}" data-action="pushable" data-id="product-details-information-size-chart">
							<section id="product-details-information-tab-content-container-size-chart">
								<div class="item-details-more-info-content-container" >
									<img src="{{sizeChart.url}}" alt="{{model._pageTitle}} size chart" />
								</div>
							</section>
						</div>
					{{/if}}
					{{#if showReviews}}
						<div role="tabpanel" class="product-details-information-tab-content-panel" id="reviews" itemprop="{{itemprop}}" data-action="pushable" data-id="product-details-information-reviews">
							<section id="product-details-information-tab-content-container-reviews">
								<h2>{{ translate 'Reviews' }}</h2>
								<div class="product-details-product-review-pusher-rating" data-view="Global.StarRating"></div><i></i>

								<div data-view="ProductReviews.Center"></div>
							</section>
						</div>

					{{/if}}
				</div>
			</div>
			<div id="banner-content-bottom" class="content-banner banner-content-bottom"></div>
		</div>
	{{/if}}
</div>



{{!----
Use the following context variables when customizing this template: 
	
	showInformation (Boolean)
	showHeader (Boolean)
	details (Array)

----}}
