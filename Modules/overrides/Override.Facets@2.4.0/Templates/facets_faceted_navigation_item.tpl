{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if showFacet}}
	<div class="facets-faceted-navigation-item-facet-group" id="{{htmlId}}" data-type="rendered-facet" data-facet-id="{{facetId}}">
		{{#if showHeading}}
			{{#if isUncollapsible}}
				<div class="facets-faceted-navigation-item-facet-group-expander">
					<span class="h4-proxy facets-faceted-navigation-item-facet-group-title">
						{{facetDisplayName}}
						{{#if showRemoveLink}}
						<a class="facets-faceted-navigation-item-filter-delete" href="{{removeLink}}">
							<i class="facets-faceted-navigation-item-filter-delete-icon"></i>
						</a>
						{{/if}}
					</span>
				</div>
			{{else}}
				<a href="#" class="facets-faceted-navigation-item-facet-group-expander {{#if isCollapsed}}collapsed{{/if}}" data-toggle="collapse" data-target="#{{htmlId}} .facets-faceted-navigation-item-facet-group-wrapper" data-type="collapse" title="{{facetDisplayName}}">
					<i class="facets-faceted-navigation-item-facet-group-expander-icon"></i>
					<span class="h4-proxy facets-faceted-navigation-item-facet-group-title">{{facetDisplayName}}</span>
					{{#if showRemoveLink}}
						<a class="facets-faceted-navigation-item-filter-delete" href="{{removeLink}}">
							<i class="facets-faceted-navigation-item-filter-delete-icon"></i>
						</a>
					{{/if}}
				</a>
			{{/if}}
		{{/if}}

		<div class="{{#if isCollapsed}} collapse {{else}} collapse in {{/if}} facets-faceted-navigation-item-facet-group-wrapper">
			<div class="facets-faceted-navigation-item-facet-group-content">
				<ul class="facets-faceted-navigation-item-facet-optionlist">
					{{#each displayValues}}
						<li>
							<a class="facets-faceted-navigation-item-facet-option {{#if isActive}}option-active{{/if}}" href="{{link}}" title="{{label}}">
								{{#if ../isMultiSelect}}
									<input type="checkbox" class="facets-faceted-navigation-item-facet-multi" {{#if isActive}}checked {{/if}} />
								{{/if}}

								<span>{{displayName}}</span>
								
								{{#unless ../isMultiSelect}}
									{{#if isActive}}
										<i class="facets-faceted-navigation-item-facet-option-circle"></i>
									{{/if}}
								{{/unless}}
							</a>
						</li>
					{{/each}}
				</ul>				
				{{#if showExtraValues}}
					<ul class="facets-faceted-navigation-item-facet-optionlist-extra {{#if isSubItemsCollapsed}} collapse {{else}} collapse in{{/if}}">
						{{#each extraValues}}
							<li>
								<a class="facets-faceted-navigation-item-facet-option {{#if isActive}}option-active{{/if}}" href="{{link}}" title="{{label}}">
									{{#if ../../isMultiSelect}}
										<input type="checkbox" class="facets-faceted-navigation-item-facet-multi" {{#if isActive}}checked {{/if}} />
									{{/if}}

									<span>{{displayName}}</span>
									
									{{#unless ../../isMultiSelect}}
										{{#if isActive}}
											<i class="facets-faceted-navigation-item-facet-option-circle"></i>
										{{/if}}
									{{/unless}}
								</a>
							</li>
						{{/each}}
					</ul>
					<div class="facets-faceted-navigation-item-optionlist-extra-wrapper">
						<button class="facets-faceted-navigation-item-optionlist-extra-button" data-toggle="collapse" data-target="#{{htmlId}} .facets-faceted-navigation-item-facet-optionlist-extra" data-action="see-more" {{#if isSubItemsCollapsed}} {{else}} data-collapsed="false"{{/if}}>
							<span data-type="see-more" {{#unless isSubItemsCollapsed}}class="facets-faceted-navigation-item-alt-caption"{{/unless}}>
								{{translate 'See More'}}
							</span>
							<span data-type="see-less" {{#if isSubItemsCollapsed}}class="facets-faceted-navigation-item-alt-caption"{{/if}}>
								{{translate 'See Less'}}
							</span>
						</button>
					</div>
				{{/if}}
			</div>
		</div>

	</div>
{{/if}}