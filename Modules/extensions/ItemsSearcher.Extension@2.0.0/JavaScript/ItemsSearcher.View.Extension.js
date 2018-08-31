/*
 © 2017 JHM Services
 Allows you to add additional search restrictions to individual typeahead instantiations. To do this, add an object
 named additionalSearchParamsObj to options passed in to new ItemsSearcherView. Add all new search restrictions
 to this object.
 */

define('ItemsSearcher.View.Extension'
,   [
        'ItemsSearcher.View'
    ,   'ItemsSearcher.Utils'
    ,   'underscore'
    ,   'jQuery'
    ]
,   function
    (
        ItemsSearcherView
    ,   ItemsSearcherUtils
    ,   _
    ,   jQuery
    )
{
    'use strict';

    _.extend(ItemsSearcherView.prototype, {

        loadSuggestionItemsSource: function loadSuggestionItemsSource (query, callback)
        {
            var self = this
            ,   data;

            self.options.ajaxDone = false;
            self.options.results = {};
            self.options.query = ItemsSearcherUtils.formatKeywords(query);
            this.collection = new this.options.collection([], this.options.collectionOptions);

            // if the character length from the query is over the min length
            if (self.options.query.length >= self.options.minLength)
            {
                self.options.labels = ['see-all-' + self.options.query];
                callback(self.options.labels);

                self.$searchElement.data('ttTypeahead').dropdown.moveCursorDown();
            }

            data = {
                q: jQuery.trim(self.options.query)
            ,	sort: self.options.sort
            ,	limit: self.options.limit
            ,	offset: 0
            };

            if(self.options.hasOwnProperty('additionalSearchParamsObj')) {
                _.extend(data, self.options.additionalSearchParamsObj);
            }

            // silent = true makes it invisible to any listener that is waiting for the data to load
            // We can use jQuery's .done, as the fetch method returns a promise
            // http://api.jquery.com/deferred.done/
            self.collection.fetch(
                {
                    data: data
                ,	killerId: _.uniqueId('ajax_killer_')
                }
            ,	{
                    silent: true
                }
            ).done(function ()
            {
                self.collection = self.postItemsSuggestionObtained.executeAll(self.collection, self.options) || self.collection;

                self.options.ajaxDone = true;
                self.options.labels = self.options.showSeeAll ? ['see-all-' + self.options.query].concat(self.getItemIds(self.collection)) : self.getItemIds(self.collection);

                if (!self.options.labels.length)
                {
                    self.options.labels = ['see-all-' + self.options.query];
                }

                callback(self.options.labels);

                self.selectFirstIfRequire();
            });
        }
    });
});