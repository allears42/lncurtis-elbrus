/*
	© 2017 LN Curtis
*/

define(
    'NavigationHelper.Plugins.Standard.Extension'
    ,	[
        'NavigationHelper.Plugins.Standard'
    ,   'SC.Configuration'

    ,	'underscore'

    ]
    ,	function(
        NavigationHelperPluginsStandard
    ,   Configuration

    , 	_

    )
    {
        'use strict';

        _.extend( NavigationHelperPluginsStandard.prototype, {

            clickNavigation: function (layout, e)
            {
                e.preventDefault();

                //close all parent menus
                jQuery('[data-toggle="categories-menu"]').removeClass('open');

                // Grabs info from the event element
                var context = layout.generateNavigationContext(e)
                    ,	href = layout.getUrl(context) || ''
                    //TODO: Check if the pressed button can be included in the isTargetBlank function.Check how it is used in NavigationHelper.Plugins.DataTouchPoints.setHashtag
                    ,	target_is_blank = layout.isTargetBlank(e) || e.button === 1
                    ,	target_is_modal_or_pusher = context.target_data.toggle === 'show-in-modal' || (context.target_data.toggle === 'show-in-pusher' && _.isPhoneDevice())
                    ,	is_disabled = context.$target.attr('disabled')
                    ,	is_dropdown = context.target_data.toggle === 'dropdown'
                    ,	is_external;

                if (is_disabled)
                {
                    e.stopPropagation();
                    return e;
                }

                if (context.target_data.originalHref && !target_is_blank)
                {
                    href = context.target_data.originalHref;
                }

                // Pusher fix
                layout.$el.removeClass('sc-pushing');

                if (href === '#' || href === '' || is_dropdown)
                {
                    return e;
                }

                // The navigation is within the same browser window
                if (!target_is_blank)
                {
                    // There is a modal open
                    if (layout.$containerModal)
                    {
                        layout.$containerModal.modal('hide');
                    }

                    //Wants to open this link in a modal or pusher
                    if (!target_is_modal_or_pusher)
                    {
                        is_external = ~href.indexOf('http:') || ~href.indexOf('https:') || ~href.indexOf('mailto:') || ~href.indexOf('tel:');

                        if (is_external)
                        {
                            _.getWindow().document.location.href = href;
                        }
                        else
                        {
                            Backbone.history.navigate(href, {trigger: true});
                            this.handleActiveNavigation();
                        }
                    }
                }
                else
                {
                    _.getWindow().open(href, _.uniqueId('window'));
                }

                return e;
            }

        ,   handleActiveNavigation: function ()
            {
                _.each(Configuration.navigationData, function(entry)
                {
                    if (entry.href && entry.href !== "#" && entry.href.length > 1) {
                        if (document.location.hash.indexOf(entry.data.hashtag.replace("/", "")) > -1
                            || document.location.hash.indexOf(entry.data.hashtag) > -1
                            || document.location.pathname.indexOf(entry.href) > -1) {
                            $(".anchor-active").removeClass("anchor-active");
                            $(".header-secondary-wrapper [data-hashtag='"+entry.data.hashtag+"']").addClass("anchor-active");
                        }
                    }
                });
            }

        });

    });
