/*
	© 2017 LN Curtis
*/

define(
	'ModuleDefinition'
,	[
		'ModuleUsed'

	,	'underscore'

	]
,	function(
        ModuleUsed

	, 	_

	)
{
	'use strict';
	
	_.extend( ModuleUsed.prototype, {


	/*,	extendedFunction: _.wrap( ModuleUsed.prototype.extendedFunction, function(fn)
		{
            var self = this
			,   returnVariable = fn.apply(self, _.toArray(arguments).slice(1));

            _.extend(returnVariable , {
                newKey: 'newValue'
            });

            return returnVariable
		})*/

	});

});
