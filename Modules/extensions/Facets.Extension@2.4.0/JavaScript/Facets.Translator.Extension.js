/*
	© 2017 LN Curtis
*/

define(
    'Facets.Translator.Extension'
    ,	[
        'Facets.Translator'

        ,	'underscore'
    ]
    ,	function(
        FacetsTranslator

        , 	_
    )
    {
        'use strict';

        _.extend( FacetsTranslator.prototype, {

            getApiParams: function ()
            {
                var params = {};

                if (this.isCategoryPage)
                {
                    params.commercecategoryurl = this.categoryUrl;
                }

                _.each(this.facets, function (facet)
                {
                    switch (facet.config.behavior)
                    {
                        case 'range':
                            var value = (typeof facet.value === 'object') ? facet.value : {from: 0, to: facet.value};
                            params[facet.id + '.from'] = value.from;
                            params[facet.id + '.to'] = value.to;
                            break;
                        case 'multi':
                            params[facet.id] = facet.value.sort().join(',') ; // this coma is part of the api call so it should not be removed
                            break;
                        default:
                            params[facet.id] =  facet.value;
                    }
                });

                params.sort = this.options.order;
                params.limit = this.options.show;
                params.offset = (this.options.show * this.options.page) - this.options.show;

                params.q = this.options.keywords;

                if (this.isCategoryPage)
                {
                    params.commercecategoryurl = this.categoryUrl;
                    params.sort = params.sort.replace('relevance', 'commercecategory');
                }

                return params;
            }

        ,	cloneWithoutCategories: function ()
            {
                // Creates a new translator with the same params as this;
                var translator = new FacetsTranslator(this.facets, this.options, this.configuration, this.categoryUrl);

                _.each(translator.getAllFacets(), function (facet)
                {
                    if (facet.id === 'commercecategoryname' || facet.id === 'category')
                    {
                        translator = translator.cloneWithoutFacetId(facet.id);
                    }
                });

                return translator;
            }

        });

    });
