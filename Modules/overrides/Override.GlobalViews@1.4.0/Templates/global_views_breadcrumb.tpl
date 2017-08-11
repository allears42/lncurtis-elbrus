{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div id="banner-breadcrumb-top" class="content-banner banner-breadcrumb-top" data-cms-area="breadcrumb_top" data-cms-area-filters="global"></div>
<ol class="global-views-breadcrumb" itemprop="breadcrumb"  itemscope itemtype="https://schema.org/BreadcrumbList">
	{{#each pages}}
		{{#if @last}}
			<li class="global-views-breadcrumb-item-active" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
				<span itemscope itemtype="https://schema.org/Thing" itemprop="item"><span itemprop="name">{{text}}</span></span>
				<meta itemprop="position" content="{{position}}" />
			</li>
		{{else}}
			<li class="global-views-breadcrumb-item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
				<a href="{{href}}" itemscope itemtype="https://schema.org/Thing" itemprop="item"
					{{#if hasDataTouchpoint}} data-touchpoint="{{data-touchpoint}}" {{/if}}
					{{#if hasDataHashtag}} data-hashtag="{{data-hashtag}}" {{/if}}
				><span itemprop="name">{{text}}</span></a>
				<meta itemprop="position" content="{{position}}" />
			</li>
			<li class="global-views-breadcrumb-divider"><span class="global-views-breadcrumb-divider-icon"></span></li>
		{{/if}}
	{{/each}}
</ol>
<div id="banner-breadcrumb-bottom" class="content-banner banner-breadcrumb-bottom" data-cms-area="breadcrumb_bottom" data-cms-area-filters="global"></div>