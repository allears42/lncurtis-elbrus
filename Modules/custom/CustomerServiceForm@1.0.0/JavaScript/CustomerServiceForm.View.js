define(
	'CustomerServiceForm.View'
,	[
		'LinkHierarchy.View'

	,	'customerserviceform.tpl'
    ,   'link_menu.tpl'

	,	'Backbone.CompositeView'
	,	'Backbone.FormView'
	,	'SC.Configuration'

	,	'CustomerServiceForm.Model'

	,	'jQuery'
	,	'Backbone'
	,	'underscore'
	,	'Profile.Model'
	,	'Utils'
	]
,	 function (
        LinkHierarchyView

	,	tpl
    ,	menu_tpl

	,	BackboneCompositeView
	,	BackboneFormView
	,	Configuration

	,	Model

	,	jQuery
	,	Backbone
	,	_
	,	ProfileModel
	)
{
	'use strict';

	return Backbone.View.extend({

		template: tpl

	,	title: _('How can we help you?').translate()

	,	page_header: _('How can we help you?').translate()

	,	events: {
			'submit form': 'saveForm'
		,	'keypress [data-action="text"]': 'preventEnter'
		}

	,	bindings: {
			'[name="firstname"]': 'firstname'
		,	'[name="lastname"]': 'lastname'
		,	'[name="email"]': 'email'
		,	'[name="issue"]': 'issue'
		,	'[name="custentity_title"]': 'custentity_title'
		,	'[name="comments"]': 'comments'
		}

	,	attributes: {
			'class': 'newCase'
		}

	,	initialize: function (options)
		{
			this.options = options;
			this.application = options.application;
			this.user = ProfileModel.getInstance();

            this.sideMenuLinks = Configuration.get("linkHierarchy.links",[]);
            var self = this;
            //TODO can make this menu dynamic?
            this.thisMenu = _.filter(self.sideMenuLinks, function (link) {
                return link.menuOwner.indexOf('customer-service') > -1;
            });
			this.model = new Model();

			this.model.on('sync', jQuery.proxy(this, 'showSuccess'));

            BackboneCompositeView.add(this);
			BackboneFormView.add(this);
		}

		// Prevents not desired behaviour when hitting enter
	,	preventEnter: function (event)
		{
			if (event.keyCode === 13)
			{
				event.preventDefault();
			}
		}

		//@method getSelectedMenu
	,	getSelectedMenu: function ()
		{
			return 'newcase';
		}
		//@method getBreadcrumbPages
	,	getBreadcrumbPages: function ()
		{
			return {
				text: this.title
			,	href: '/newcase'
			};
		}

	,	showSuccess: function ()
		{
            $('section.customer-service-form-container').hide();
            $('section.customer-service-thanks-container').show();
			
			jQuery('html, body').animate({
				scrollTop: 0
			}, 600);
		}

    ,   childViews: {
            'SideNavigation': function()
            {
                var self = this;

                //console.log('sidemneu')
                return new LinkHierarchyView({
                    childViewOptions: {
                        linkData: self.thisMenu
                        , custom_template: menu_tpl
                    }
                });
            }
        }

	,	getContext: function()
		{
			return {
				pageHeader: this.page_header
                , confirmationText: Configuration.get('customerServiceForm.confirmation', 'Thank you for submitting your message. Our customer service team will respond within 24 hours during a normal work week, but feel free to contact us at 877.488.0469 for immediate assistance Monday thru Friday from 8 a.m. to 5 p.m. Pacific Time (PT).')
			};
		}
	});
});
