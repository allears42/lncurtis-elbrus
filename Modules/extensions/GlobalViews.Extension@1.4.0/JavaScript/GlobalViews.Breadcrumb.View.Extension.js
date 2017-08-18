/*
	© 2017 LN Curtis
*/

define(
	'GlobalViews.Breadcrumb.View.Extension'
,	[
		'GlobalViews.Breadcrumb.View'

	,	'underscore'
	]
,	function(
        GlobalViewsBreadcrumbView

	, 	_
	)
{
	'use strict';
	
	_.extend( GlobalViewsBreadcrumbView.prototype, {

        getContext: function ()
        {
            _.each(this.pages, function(page,index)
            {
                if (page['data-touchpoint'])
                {
                    page.hasDataTouchpoint = true;
                }

                if (page['data-hashtag'])
                {
                    page.hasDataHashtag = true;
                }

                page.position = index+1;
            });

            //@class GlobalViews.Breadcrumb.View.Context
            return {
                // @property {Array<Object>} pages
                pages: this.pages
            };
        }

	});

});
