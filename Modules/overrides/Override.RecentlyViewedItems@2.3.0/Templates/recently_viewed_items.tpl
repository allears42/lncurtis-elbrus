{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if showCells}}
	<aside class="recently-viewed-items">
		<div data-type="alert-placeholder-module"></div>
		<h3>{{translate 'Recently viewed'}}</h3>
		<div data-type="backbone.collection.view.rows"></div>
	</aside>
{{/if}}