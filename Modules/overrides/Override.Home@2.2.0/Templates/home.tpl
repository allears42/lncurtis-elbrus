{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="home">
	{{#if isDesktop}}
		<table class="row home-feature-outer">
		<tbody>
			<tr>
				<td class="col-sm-8 home-slider-container">
					<div class="home-image-slider">
						<ul data-slider class="home-image-slider-list">
							{{#each carouselImages}}
							<li>
								<div class="home-slide-main-container {{classnames}}">
									{{#if href}}
										<a href="{{href}}" data-touchpoint="{{dataTouchpoint}}" data-hashtag="{{dataHashtag}}" >
									{{/if}}
									<img src="{{resizeImage imageURL ../../imageHomeSize}}" alt="{{altText}}" />
									{{#unless href}}
										<div class="home-slide-caption">
											{{{slideText}}}
										</div>
									{{/unless}}
									{{#if href}}
										</a>
									{{/if}}
								</div>
							</li>
							{{/each}}
						</ul>
					</div>
				</td>
				<td class="col-sm-4">
					<div class="row">
						<div class="col-md-12 col-sm-12 col-xs-12">
							<div class="home-category-right home-category-right-top" data-cms-area="home_banner_1" data-cms-area-filters="path"></div>
						</div>
						<div class="col-md-12 col-sm-12 col-xs-12">
							<div class="home-category-right  home-category-right-bottom" data-cms-area="home_banner_2" data-cms-area-filters="path"></div>
						</div>
					</div>
				</td>
			</tr>
		</tbody>
	</table>
	{{else}}
		<div class="row home-feature-outer">
		<div class="col-md-8 col-sm-12 home-slider-container">
			<div class="home-image-slider">
				<ul data-slider class="home-image-slider-list">
					{{#each carouselImages}}
					<li>
						<div class="home-slide-main-container {{classnames}}">
							{{#if href}}
								<a href="{{href}}" data-touchpoint="{{dataTouchpoint}}" data-hashtag="{{dataHashtag}}" >
							{{/if}}
							<img src="{{resizeImage imageURL ../../imageHomeSize}}" alt="{{altText}}" />
							{{#unless href}}
								<div class="home-slide-caption">
								{{{slideText}}}
								</div>
							{{/unless}}
							{{#if href}}
								</a>
							{{/if}}
						</div>
					</li>
					{{/each}}
				</ul>
			</div>
		</div>
		<div class="col-md-4 col-sm-12 ">
			<div class="row">
				<div class="col-md-12 col-xs-6 home-category-right-outer">
					<div class="home-category-right home-category-right-top" data-cms-area="home_banner_1" data-cms-area-filters="path"></div>
				</div>
				<div class="col-md-12 col-xs-6 home-category-right-outer">
					<div class="home-category-right  home-category-right-bottom" data-cms-area="home_banner_2" data-cms-area-filters="path"></div>
				</div>
			</div>
		</div>
	</div>
	{{/if}}
	<div class="row home-feature-outer home-featured-products">
		<div class="col-sm-4">
			<div class="home-featured-product" data-cms-area="home_featured_1" data-cms-area-filters="path"></div>
		</div>
		<div class="col-sm-4">
			<div class="home-featured-product" data-cms-area="home_featured_2" data-cms-area-filters="path"></div>
		</div>
		<div class="col-sm-4">
			<div class="home-featured-product" data-cms-area="home_featured_3" data-cms-area-filters="path"></div>
		</div>
	</div>
	<div class="row home-feature-outer">
		<div class="home-banner col-xs-12" data-cms-area="home_full_banner_1" data-cms-area-filters="path"></div>
	</div>
	<div data-view="BestSellers"></div>

	<!--<div class="row home-feature-outer">
		{{#if isTablet}}
			<table class="home-feature-images">
				<tbody>
					<tr class="">
						<td class="col-sm-6">
							<div class="home-feature-image home-feature-image-first" data-cms-area="home_feature_image_1" data-cms-area-filters="path"></div>
							<div class="row home-feature-image-last home-feature-image">
								<div class="col-sm-6">
									<div class="home-feature-image home-feature-image-left" data-cms-area="home_feature_image_2" data-cms-area-filters="path"></div>
								</div>
								<div class="col-sm-6">
									<div class="home-feature-image home-feature-image-right" data-cms-area="home_feature_image_3" data-cms-area-filters="path"></div>
								</div>
							</div>
						</td>
						<td class="col-sm-6 home-feature-image-text">
							<div class="home-feature-image-text-inner" data-cms-area="home_feature_image_text_1" data-cms-area-filters="path"></div>
						</td>
					</tr>
				</tbody>
			</table>

		{{else}}
			<div class="col-sm-6">
				<div class="home-feature-image home-feature-image-first" data-cms-area="home_feature_image_1" data-cms-area-filters="path"></div>
				<div class="row home-feature-image-last home-feature-image">
					<div class="col-xs-6">
						<div class="home-feature-image home-feature-image-left" data-cms-area="home_feature_image_2" data-cms-area-filters="path"></div>
					</div>
					<div class="col-xs-6">
						<div class="home-feature-image home-feature-image-right" data-cms-area="home_feature_image_3" data-cms-area-filters="path"></div>
					</div>
				</div>
			</div>
			<div class="col-sm-6">
				<div class="home-feature-image-text" data-cms-area="home_feature_image_text_1" data-cms-area-filters="path"></div>
			</div>
		{{/if}}

	</div>-->
	<div class="row home-feature-outer">
		<div class="home-features col-xs-12" data-cms-area="home_feature_heros" data-cms-area-filters="path"></div>
	</div>
	<div class="home-merchandizing-zone">
		<div data-id="your-merchandising-zone" data-type="merchandising-zone"></div>
	</div>
</div>

