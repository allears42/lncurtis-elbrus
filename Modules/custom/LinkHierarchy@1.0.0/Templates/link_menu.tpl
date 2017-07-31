{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

	{{#if showHeaderText}}
		<h3>{{headerText}}</h3>
	{{/if}}

	<ul class="menu-level1-no-fly">
	{{#each categories}}
		{{#if text}}
			<li>
				{{#if href}}
					<a class="{{class}}" {{objectToAtrributes this}} data-hashtag="{{dataHashtag}}"  data-touchpoint="{{dataTouchpoint}}" target="{{target}}">
				{{else}}
					<p class="{{class}}">
				{{/if}}
				{{translate text}}
				{{#if href}}
					</a>
				{{else}}
					</p>
				{{/if}}
				{{#if categories}}
				<ul class="menu-level-container-no-fly">
					<li>
						<ul class="menu-level2-no-fly">
							{{#each categories}}
							<li>
								{{#if href}}
								<a class="{{class}}" {{objectToAtrributes this}}  data-hashtag="{{dataHashtag}}" data-touchpoint="{{dataTouchpoint}}">
									{{else}}
									<p class="{{class}}">
										{{/if}}
										{{translate text}}
										{{#if href}}
								</a>
								{{else}}
								</p>
								{{/if}}

								{{#if categories}}
								<ul class="menu-level3-no-fly">
									{{#each categories}}
									<li>
										{{#if href}}
										<a class="{{class}}" {{objectToAtrributes this}}  data-touchpoint="{{dataTouchpoint}}">
											{{else}}
											<p class="{{class}}">
												{{/if}}
												{{translate text}}
												{{#if href}}
										</a>
										{{else}}
										
										</p>
										{{/if}}
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

