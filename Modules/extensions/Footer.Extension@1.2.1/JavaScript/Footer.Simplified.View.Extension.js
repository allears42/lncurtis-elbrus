/*
	© 2017 LN Curtis
*/

define(
	'Footer.Simplified.View.Extension'
,	[
		'Footer.Simplified.View'
	,	'underscore'

	]
,	function(
		FooterSimplifiedView
	,	_

	)
{
	'use strict';

    _.extend( FooterSimplifiedView.prototype, {

		getContext: function() {
            var startDate = 2016
                , d = new Date()
                , today = d.getFullYear();

            return {
                copyrightText: Configuration.get("footer.copyrightText", "")
			, 	date: today > startDate ? startDate.toString() + " - " + today.toString() : startDate.toString()

            }
        }

    });

});
