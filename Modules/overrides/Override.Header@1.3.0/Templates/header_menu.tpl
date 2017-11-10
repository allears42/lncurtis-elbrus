{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<nav class="header-menu-secondary-nav">
	<ul class="header-menu-level1">
		{{#each categories}}
			{{#if text}}
				<li {{#if categories}}data-toggle="categories-menu"{{/if}}>
					<a class="{{class}} {{#if isActiveLink}}anchor-active{{/if}}" {{objectToAtrributes this}}>
						{{translate text}}
					</a>
					{{#if categories}}
					<ul class="header-menu-level-container">
							<li class="header-menu-sub-menu-header">
								{{#unless isMore}}
									<a class="header-menu-sub-menu-header-anchor" {{objectToAtrributes this}}>
										All {{translate text}}
									</a>
								{{/unless}}
								<span class="header-menu-close-menu">&times;</span>
							</li>
						<li>
							<ul class="header-menu-level2">
								{{#each categories}}
								<li>
									<a class="{{class}}" {{objectToAtrributes this}}>{{translate text}}</a>

									{{#if categories}}
									<ul class="header-menu-level3">
										{{#each categories}}
										<li>
											<a class="{{class}}" {{objectToAtrributes this}}>{{translate text}}</a>
										</li>
										{{/each}}
									</ul>
									{{/if}}
								</li>
								{{/each}}
							</ul>
						</li>
					</ul>
					{{/if}}
				</li>
			{{/if}}
		{{/each}}

	</ul>

</nav>
