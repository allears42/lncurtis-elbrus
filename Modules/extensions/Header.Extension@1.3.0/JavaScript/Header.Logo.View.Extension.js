/*
	© 2017 LN Curtis
*/

// @module Header
define(
	'Header.Logo.View.Extension'
,	[
        'Header.Logo.View'

	,	'underscore'
	]
,	function(
        HeaderLogoView

	,	_
	)
{
	'use strict';

	// @class Header.Logo.View @extends Backbone.View
	_.extend( HeaderLogoView.prototype, {

		getContext: _.wrap( HeaderLogoView.prototype.getContext, function(fn) {

            var self = this
			,   returnVariable = fn.apply(self, _.toArray( arguments).slice(1));

            _.extend(returnVariable , {
                seoURL: this.options && ( this.options.seoURL || this.options.headerLinkHref ) || '/'
            });

            return returnVariable
        })

	});
});
