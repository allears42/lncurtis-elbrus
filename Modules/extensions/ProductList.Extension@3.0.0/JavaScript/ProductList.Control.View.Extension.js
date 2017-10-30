/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ProductList
define('ProductList.Control.View.Extension'
	,	[
			'ProductList.Control.View'

		,	'Profile.Model'

		,	'SC.Configuration'
		,	'underscore'
		]
	,	function(
			ProductListControlView
	  
		,	ProfileModel

		,	Configuration
		,	_
		)
{
	'use strict';

	_.extend(ProductListControlView.prototype, {
		
		getContext: _.wrap( ProductListControlView.prototype.getContext, function(fn)
		{
			var returnVariable = fn.apply(this, _.toArray(arguments).slice(1));
			
			_.extend(returnVariable , {
				isLoggedIn: ProfileModel.getInstance().get('isLoggedIn') === 'T'
			});
			
			return returnVariable
		})
	});
});
