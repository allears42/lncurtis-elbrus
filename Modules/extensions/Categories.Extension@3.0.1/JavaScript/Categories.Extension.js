/*
	© 2017 LN Curtis
	Custom extension logic for...
*/

define(
    'Categories.Extension'
    , [
        'Categories'
    ,   'underscore'
    ]
    , function (
        Categories
    ,   _
    )

    {
        'use strict';

        _.extend(Categories,
            {

                moreCategories: []

            ,   makeNavigationTab: function (categories)
                {
                    var result = []
                    ,   self = this
                    ,   numberToShowBase = Configuration.get('categories.navigationTabs.showMax', 5)
                    // if first level, sort by sequence, else sort alphabetically (or by custom field)
                    ,   sortByField = "sequencenumber"; //sortLevel && sortLevel > 1 ? Configuration.get('categories.navigationTabs.sortBy', "name") : "sequencenumber";

                    var limit = Configuration.get("categories.mainNavigationLimit", 9)
                    ,   topLevelCategoriesAdded = 0;

                    if (!SC.isPageGenerator()) {
                        // added fix for sequence number not working
                        categories = _.sortBy(categories, function (category) {
                            return category[sortByField] && parseInt(category[sortByField]) > -1 ? parseInt(
                                category[sortByField]) : 1000;
                        });

                        categories = _.sortBy(categories, function (category) {
                            if (category.level && category.level === "2") {
                                if (category.categories && category.categories.length < 1) return 10000;
                                else {
                                    return category[sortByField] && parseInt(category[sortByField]) > -1 ? parseInt(
                                        category[sortByField]) : category.categories.length;
                                }
                            }
                        });
                    }

                    _.each(categories, function (category) {
                        var href = category.fullurl

                            , tab = {
                            'href': href
                            , 'text': category.name
                            , 'data':
                                {
                                    hashtag: '#' + href
                                    , touchpoint: 'home'
                                }
                            , 'class': 'header-menu-level' + category.level + '-anchor'
                            , 'data-type': 'commercecategory'
                        };


                        if (category.categories) {
                            var subCategories = category.categories;

                            if (!SC.isPageGenerator()) {
                                if (category.level === "2") {
                                    var numberToShow = numberToShowBase;

                                    if (numberToShow > subCategories.length) {
                                        numberToShow = subCategories.length
                                    }

                                    subCategories = subCategories.slice(0, numberToShow);

                                }
                            }

                            tab.categories = self.makeNavigationTab(subCategories, parseInt(category.level));
                        }

                        if (category.name === "More") {
                            tab.isMore = true;
                        }

                        if (category.level === "1") {
                            if (topLevelCategoriesAdded < limit) result.push(tab);
                            topLevelCategoriesAdded++;
                        }
                        else {
                            result.push(tab)
                        }
                    });

                    return result;
                }

            });

    });
