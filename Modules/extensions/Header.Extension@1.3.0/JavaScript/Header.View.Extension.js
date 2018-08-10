/*
	© 2017 LN Curtis
*/

define(
    'Header.View.Extension'
    ,	[
        'Header.View'
	,	'Header.Logo.View'
	,	'Header.Menu.View'
	,	'LinkHierarchy.View'
	,	'SC.Configuration'

	,	'underscore'
	,	'Utils'
    ]
    ,	function(
        HeaderView
	,	HeaderLogoView
	,	HeaderMenuView
	,	LinkHierarchyView
	,	Configuration

	, 	_
	, 	Utils
    )
    {
        'use strict';

        _.extend( HeaderView.prototype, {

			initialize: _.wrap(HeaderView.prototype.initialize, function(fn, options) {

				var self = this;
				fn.apply(this, _.toArray(arguments).slice(1));
				this.application = options.application;

				this.application.getLayout().on('afterAppendToDom afterAppendView', function() {
					self.addAffixBehavior();
				});

				_.bindAll(this, 'addAffixBehavior');
				_.bindAll(this, 'clearAffixRelatedStyles');
				jQuery(window).resize(function() {
					self.clearAffixRelatedStyles();
					self.addAffixBehavior();
				})
			})

		,	verifyShowSiteSearch: function ()
            {
                /*
                var hash = Backbone.history.getFragment() || '';
                hash = hash.indexOf('?') === -1 ? hash : hash.substring(0, hash.indexOf('?'));
                var is_home = hash === '' || hash === '/';

                if (is_home)
				{
					this.showSiteSearch(null, true);
				}
				else
				{
					// This hide sitesearch when navigate
					this.hideSiteSearch();
				}
				*/

                if (_.getDeviceType() === 'phone'){
                    this.hideSiteSearch();
                }
            }
            
		,	childViews: _.extend( HeaderView.prototype.childViews,
			{
                'Header.Logo': function()
                {
                    // adding seoURL
                    this.options.seoURL = window.location.protocol + '//' + window.location.hostname;
                    return new HeaderLogoView(this.options);
                }

			,	'HelpLinks': function()
				{
					return new LinkHierarchyView({
						childViewOptions: {
							configurationObject: "header.helpLinks"
						}
					});
				}
				
			,	'Header.Menu': function()
			{
				if (Utils.isInShopping() ||  SC.ENVIRONMENT.SCTouchpoint === 'myaccount') {
					var header_view_options = _.extend(
						{
							application: this.options.application
						}
						, this.options.headerProfileViewOptions || {});
					
					return new HeaderMenuView(header_view_options);
				}
			}

			})

		,	addAffixBehavior: function()
			{
				var $headerAffixElement = this.$('#header-affix-element')
				,	$paddingElement = this.$('#main')
				// ,	screenWidth = Utils.getViewportWidth()
				,	self = this;

				// if (screenWidth > 767) {

					// Adds Twitter affix behavior to nav bar
					$headerAffixElement.affix({
						offset: {
							top: function() {return self.$('.header-content').outerHeight(true)}
						}
					// Add margin to top of body content to prevent it from bouncing up behind affixed navbar
					}).on('affix.bs.affix', function() {
						$paddingElement.css('margin-top', $headerAffixElement.outerHeight(true) + 'px');

					// Remove margin from top of body content when navbar is unaffixed
					}).on('affix-top.bs.affix', function() {
						$paddingElement.css('margin-top', '0');
					});
				// }

			}

		,	clearAffixRelatedStyles: function()
			{
				jQuery('#breadcrumb-affix-element').css('margin-top', '0');

			}

		,	getContext: _.wrap( HeaderView.prototype.getContext, function(fn)
			{
                var self = this
				,   returnVariable = fn.apply(self, _.toArray(arguments).slice(1));

                _.extend(returnVariable , {
						catalogsLink : Configuration.get("header.catalogsLink", "#")
					,   agenciesLink : Configuration.get("header.agenciesLink", "#")
					,   telephone : Configuration.get("header.telephone", "#")
					,   contactLink : Configuration.get("header.contactLink", "#")
					,   contactText : Configuration.get("header.contactText", "#")
					,   customerServiceHours : Configuration.get("header.customerServiceHours", "#")

            	});

                return returnVariable

        	})
         
    	});
    });
