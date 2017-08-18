/*
	© 2017 LN Curtis

*/

define(
    'Facets.Extension'
    ,	[
            'Facets'
        ,	'Facets.Model'
        ,	'Facets.Router'

        ,	'facets_faceted_navigation_item.tpl'
        ,	'facets_faceted_navigation_item_color.tpl'
        ,	'facets_faceted_navigation_item_range.tpl'

        ,	'underscore'
        ,   'Utils'
    ]
    ,	function(

            Facets
        ,   Model
        ,   Router

        ,   facets_item_cell_grid_tpl
        ,   facets_item_cell_table_tpl
        ,   facets_item_cell_list_tpl

        , 	_
        ,   Utils
    )
    {
        'use strict';

        _.extend( Facets, {

            setTranslatorConfig: _.wrap( Facets.setTranslatorConfig, function(fn)
            {
                // todo@shelby: is this logic even necessary?

                var self = this
                ,   application = _.toArray(arguments)[1];

                // fix for bug in how these options get loaded.
                var screenType = _.getDeviceType()
                ,   displayOptions = application.getConfig('itemsDisplayOptions')
                ,   sortOptions = application.getConfig('sortOptions');

                // Phone Specific
                if (screenType === 'phone')
                {
                    displayOptions = application.getConfig('itemsDisplayOptionsPhone');
                    sortOptions = application.getConfig('sortOptionsPhone');
                }
                // Tablet Specific
                else if (screenType === 'tablet')
                {
                    displayOptions = application.getConfig('itemsDisplayOptionsTablet');
                    sortOptions = application.getConfig('sortOptionsTablet');
                }

                fn.apply(self, _.toArray(arguments).slice(1));

            })

        ,   prepareItemDisplayOptions: function (application)
            {
            /*---------------------------
            itemsDisplayOptions is set when the user loads the page with the current width of the screen device, NOT the width of the browser.
            This option is NOT responsive, so if the user loads the page with the desktop resolution, even if he resize the browser, he will still see the view of the desktop.

            Display type and columns supported by screen resolution:

            Mobile
            Display types -> List, Table
                List -> columns  [1, 2]
                Table -> columns [1, 2]

            Tablet
            Display types  -> List, Table
                List -> columns [1, 2, 3, 4, 6, 12]
                Table -> columns [1, 2, 3, 4, 6, 12]

            Desktop
            Display types	->
                List -> columns [1, 2, 3, 4, 6, 12]
                Table -> columns [1, 2, 3, 4, 6, 12]
                Grid -> columns [1, 2, 3, 4, 6, 12]
            --------------------------*/

            if (!Utils.isPageGenerator())
            {
                var screenType = Utils.getDeviceType();

                // Phone Specific
                if (screenType === 'phone')
                {
                    application.Configuration.itemsDisplayOptions = application.Configuration.itemsDisplayOptionsPhone;
                    application.Configuration.sortOptions = application.Configuration.sortOptionsPhone;
                    application.Configuration.defaultPaginationSettings = application.Configuration.defaultPaginationSettingsPhone;
                }
                // Tablet Specific
                else if (screenType === 'tablet')
                {
                    application.Configuration.itemsDisplayOptions = application.Configuration.itemsDisplayOptionsTablet;
                    application.Configuration.sortOptions = application.Configuration.sortOptionsTablet;
                    application.Configuration.defaultPaginationSettings = application.Configuration.defaultPaginationSettingsTablet;
                }
            }
        }

        ,   mountToApp: function (application)
            {
                //Post-process the configuration
                application.Configuration.facets = application.Configuration.facets || [];

                this.prepareItemDisplayOptions(application);

                var facets = application.Configuration.get('facets');

                facets = _.sortBy(facets, function (facet1, facet2)
                {
                    return facet1.priority > facet2.priority ? 0 : 1;
                });

                _.each(facets, function (facet)
                {
                    facet.colors = application.getLayout().getColorPalette(facet.colors);
                });

                this.setTranslatorConfig(application);

                var routerInstance = new Router(application);

                this.prepareRouter(application, routerInstance);

                // Wires some config to the model
                // Model.mountToApp(application);

                // set up facet configuration parsers
                var self = this;
                _.each(application.Configuration.get('facets'), function(facet)
                {
                    if(facet.parser)
                    {
                        facet.parser = self.facetConfigParsers[facet.parser];
                    }
                    if(!facet.parser)
                    {
                        facet.parser = self.facetConfigParsers['default'];
                    }
                });

                return routerInstance;
            }

        });

    });
