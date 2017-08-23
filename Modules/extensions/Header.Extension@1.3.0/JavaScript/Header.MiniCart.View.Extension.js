/*
	© 2017 LN Curtis
*/

// @module Header
define(
	'Header.MiniCart.View.Extension'
,	[
		'Header.MiniCart.View'

	,	'underscore'
	]
,	function(
        HeaderMiniCartView

	,	_
	)
{
	'use strict';

	_.extend( HeaderMiniCartView.prototype, {

       getContext: _.wrap( HeaderMiniCartView.prototype.getContext, function(fn)
        {
            var returnVariable = fn.apply(self, _.toArray(arguments).slice(1));

            _.extend( returnVariable , {
                showItemCount: this.itemsInCart > 0
            });

            return returnVariable
        })

	});
});