/*
	© 2017 LN Curtis
*/

define(
	'Footer.View.Extension'
,	[
        'Footer.View'
    ,   'LinkHierarchy.View'
    ,   'LinkHierarchy.Images.View'
    ,   'LinkHierarchy.Social.View'
	,	'SC.Configuration'

	,	'link_menu.tpl'
	,	'Backbone.CompositeView'

    ,	'underscore'
    ,	'jQuery'
	]
,	function (
		FooterView
	,	LinkHierarchyView
	,	LinkHierarchyImageView
	,	LinkHierarchySocialView
	,	Configuration

	,	link_menu_tpl

    ,   BackboneCompositeView

    ,   _
    ,   jQuery
	)
{
	'use strict';

	// @class Footer.View @extends Backbone.View
	_.extend( FooterView.prototype, {

		childViews: _.extend( FooterView.prototype.childViews,
		{
            'FamilyOfBrands': function()
            {
                return new LinkHierarchyView({
                    childViewOptions: {
                        configurationObject: "footer.familyOfBrands"
                        , headerText: Configuration.get("footer.familyOfBrandsHeader", "")
                    }
                });
            }
		,	'Footer.Navigation': function()
			{
				return new LinkHierarchyView({
					childViewOptions: {
						configurationObject: "footer.navigationLinks"
						, custom_template: link_menu_tpl
					}
				});
			}
		,	'Footer.Seals': function()
			{
				return new LinkHierarchyImageView({
					childViewOptions: {
						configurationObject: "footer.seals"
					}
				});
			}
		,	'Footer.Social': function()
			{
				return new LinkHierarchySocialView({
					childViewOptions: {
						configurationObject: "footer.social"
					}
				});
			}
		})
		
	,	initialize: function (options)
		{
			/*'#main-container'*/
			this.application = options.application;
			
			BackboneCompositeView.add(this);
			
			//after appended to DOM, we add the footer height as the content bottom padding, so the footer doesn't go on top of the content
			//wrap it in a setTimeout because if not, calling height() can take >150 ms in slow devices - forces the browser to re-compute the layout.
			this.application.getLayout().on('afterAppendToDom', function ()
			{
				var headerMargin = 25;
				
				setTimeout(function ()
				{
					// custom - this throws and error in the SEO Debugger
					if(jQuery('#site-header') && jQuery('#site-header').length > 0) {
						// TODO REMOVE this HARDCODED Ids!, this parameters should be pass in by each specific layout, for this the header and footer SHOULD BE removed from the
						// ApplicationSkeleton.Layout as this is generic and should not have any concrete view
						var contentHeight = jQuery(window).innerHeight() - jQuery('#site-header')[0].offsetHeight - headerMargin - jQuery('#site-footer')[0].offsetHeight;
						jQuery('#main-container').css('min-height', contentHeight);
					}
				},10);
			});
			
		}

	,	getContext: _.wrap( FooterView.prototype.getContext, function(fn)
		{
			var returnVariable = fn.apply(this, _.toArray(arguments).slice(1))
			, 	startDate = 2016
			, 	d = new Date()
			, 	today = d.getFullYear();

			_.extend( returnVariable,
			{
                footerLogo: _.getAbsoluteUrl(Configuration.get("footer.logo", ""))
			,   companyAddress: Configuration.get("footer.companyAddress", "")
			,   phoneTollFree: Configuration.get("footer.phoneTollFree", "")
			,   viewOtherLocationsText: Configuration.get("footer.viewOtherLocationsText", "")
			,   viewOtherLocationsLink: Configuration.get("footer.viewOtherLocationsLink", "")
			,   subscribeButtonText: Configuration.get("newsletter.subscribeButtonText", "")
			,   copyrightText: Configuration.get("footer.copyrightText", "")
			,   date : today > startDate ? startDate.toString()+" - "+today.toString() : startDate.toString()
            });

			return returnVariable

		})

	});
});
