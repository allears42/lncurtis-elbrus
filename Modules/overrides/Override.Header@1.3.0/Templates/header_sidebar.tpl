{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="header-sidebar-wrapper">
	<div data-view="Header.Profile"></div>

	<div class="header-sidebar-menu-wrapper" data-type="header-sidebar-menu">

		<ul class="header-sidebar-menu">
			{{#if showExtendedMenu}}
			<li class="header-sidebar-menu-myaccount" data-view="Header.Menu.MyAccount"></li>
			{{/if}}
			{{#each categories}}
				{{#if text}}
					<li class="{{#if @last}}header-sidebar-menu-lastoption{{/if}}">
						<a {{objectToAtrributes this}} {{#if categories}}data-action="push-menu"{{/if}} name="{{text}}">
							<span>{{text}}</span>
							{{#if categories}}<i class="header-sidebar-menu-push-icon"></i>{{/if}}
						</a>
						{{#if categories}}
							<ul>

									<li>
										<a href="#" class="header-sidebar-menu-back" data-action="pop-menu" name="back-sidebar">
											<i class="header-sidebar-menu-pop-icon"></i>
											{{translate 'Back'}}
										</a>
									</li>
								{{#unless isMore}}
								<li>
									<a {{objectToAtrributes ../this}}>
										<span>{{translate 'All $(0)' ../text}}</span>
									</a>
								</li>
								{{/unless}}
								{{#each categories}}
								<li>
									<a {{objectToAtrributes this}} {{#if categories}}data-action="push-menu"{{/if}}>
									<span>{{text}}</span>
									{{#if categories}}<i class="header-sidebar-menu-push-icon"></i>{{/if}}
									</a>

									{{#if categories}}
									<ul>
										<li>
											<a href="#" class="header-sidebar-menu-back" data-action="pop-menu">
												<i class="header-sidebar-menu-pop-icon"></i>
												{{translate 'Back'}}
											</a>
										</li>

										<li>
											<a {{objectToAtrributes ../this}}>
												<span>{{translate 'All $(0)' ../text}}</span>
											</a>
										</li>

										{{#each categories}}
										<li>
											<a {{objectToAtrributes this}} name="{{text}}"><span>{{text}}</span></a>
										</li>
										{{/each}}
									</ul>
									{{/if}}
								</li>
								{{/each}}
							</ul>
						{{/if}}
					</li>
				{{/if}}
			{{/each}}
				<li class="header-subheader-help-links">
					<a href="#" class="header-subheader-help-link" data-action="push-menu" title="{{translate 'Help'}}">
						{{translate 'Help'}}<i class="header-sidebar-menu-push-icon"></i>
					</a>
					<ul data-view="HelpLinks"></ul>
				</li>
				<li class="">
					<a href="{{catalogsLink}}" class="header-subheader-link" title="{{translate 'Catalogs'}}" data-hashtag="{{catalogsLink}}" data-touchpoint="home">
						{{translate 'Catalogs'}}
					</a>
				</li>
				<li class="">
					<a href="{{agenciesLink}}" data-hashtag="{{agenciesLink}}" class="header-subheader-link" title="U.S. Government Agencies" data-touchpoint="home">
						U.S. Government Agencies
					</a>
				</li>

			<!--<li data-view="RequestQuoteWizardHeaderLink">
			</li>-->
		</ul>

	</div>

	{{#if showExtendedMenu}}
	<a class="header-sidebar-user-logout" href="#" data-touchpoint="logout" name="logout">
		<i class="header-sidebar-user-logout-icon"></i>
		{{translate 'Sign Out'}}
	</a>
	{{/if}}

	{{#if showLanguages}}
	<div data-view="Global.HostSelector"></div>
	{{/if}}
	{{#if showCurrencies}}
	<div data-view="Global.CurrencySelector"></div>
	{{/if}}

</div>
