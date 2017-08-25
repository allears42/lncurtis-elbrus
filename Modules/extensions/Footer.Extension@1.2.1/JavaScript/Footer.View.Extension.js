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

    ,	'underscore'
	]
,	function (
		FooterView
	,	LinkHierarchyView
	,	LinkHierarchyImageView
	,	LinkHierarchySocialView
	,	Configuration

	,	link_menu_tpl

    ,   _
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
            })

		})

	});
});
