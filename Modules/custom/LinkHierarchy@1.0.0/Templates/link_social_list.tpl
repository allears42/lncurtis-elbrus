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
		{{#if href}}
			<li>
				<a {{objectToAtrributes this}} target="{{target}}">
					<i class="fa {{class}}"></i>
				</a>
			</li>
		{{/if}}
	{{/each}}
</ul>

