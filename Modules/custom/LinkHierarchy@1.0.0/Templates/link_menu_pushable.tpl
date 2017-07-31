{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

	{{#if showHeaderText}}
		<h3>{{headerText}}</h3>
	{{/if}}

	<ul class="menu-level1">

	{{#each categories}}
		{{#if text}}
			<li {{#if categories}}data-toggle="categories-menu"{{/if}}>
				<a class="{{class}}" {{objectToAtrributes this}}>
				{{translate text}}
				</a>
				{{#if categories}}
				<ul class="menu-level-container">
					<li>
						<ul class="menu-level2">
							{{#each categories}}
							<li>
								<a class="{{class}}" {{objectToAtrributes this}}>{{translate text}}</a>

								{{#if categories}}
								<ul class="menu-level3">
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

