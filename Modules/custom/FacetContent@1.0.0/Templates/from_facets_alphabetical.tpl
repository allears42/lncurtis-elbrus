{{!
	© 2016 JHM Services
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}


<div class="brands-list-container">

	<div class="cms-brands-list" data-cms-area="brands-list-featured" data-cms-area-filters="path"></div>

	<ul class="brands-list">
	{{#each byLetter}}
		<li class="brands-list-letter">
			<p>{{ letter }}</p>
			<ul class="brands-sub-list">
				{{#each values}}
				<li>
					<a href="/brand/{{url}}" data-touchpoint="home">{{label}}</a>
				</li>
				{{/each}}
			</ul>
		</li>

	{{/each}}
	</ul>

</div>