/*
	© 2017 LN Curtis
	Custom extension logic for Backbone.CollectionView
*/

define(
    'Backbone.CollectionView.Extension'
    ,	[
        'Backbone.CollectionView'

        ,	'underscore'
    ]
    ,	function(
        BackboneCollectionView

        , 	_
    )
    {
        'use strict';

        _.extend( BackboneCollectionView.prototype, {

			createChildElement: function ()
			{
				var data = this.placeholderData || {}
					,	tag_name = data.childTagName || this.childViewOptions.childTagName || 'div'
					,	element = jQuery('<' + tag_name + '></' + tag_name + '>');

				if (data.childId)
				{
					element.attr('id', data.childId);
				}

				if (data.childClass)
				{
					element.addClass(data.childClass);
				}

				if (data.childDataAction)
				{
					element.attr('data-action', data.childDataAction);
				}

				if (data.childDataType)
				{
					element.attr('data-type', data.childDataType);
				}

				return element;

			}
        });
    });
