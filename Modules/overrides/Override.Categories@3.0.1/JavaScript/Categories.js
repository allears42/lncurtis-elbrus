/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Categories.js
// -------------
// Utility Class to handle the Categories tree
define('Categories'
,	[
		'SC.Configuration'
	,	'underscore'
	]
,	function (
		Configuration
	,	_
	)
{
	'use strict';

	return {

		topLevelCategories: []

    ,   moreCategories: []

	,	makeNavigationTab: function (categories)
		{
		    var result = []
                ,	self = this
                ,   numberToShowBase = Configuration.get('categories.navigationTabs.showMax', 5)
                // if first level, sort by sequence, else sort alphabetically (or by custom field)
                ,   sortByField = "sequencenumber"; //sortLevel && sortLevel > 1 ? Configuration.get('categories.navigationTabs.sortBy', "name") : "sequencenumber";

                var limit = Configuration.get("categories.mainNavigationLimit", 9)
                ,   topLevelCategoriesAdded = 0;
            
            if(!SC.isPageGenerator()) {
                // added fix for sequence number not working
                categories = _.sortBy(categories, function (category) {
                    return category[sortByField] && parseInt(category[sortByField]) > -1 ? parseInt(category[sortByField]) : 1000;
                });
    
                categories = _.sortBy(categories, function (category) {
                    if (category.level && category.level === "2") {
                        if (category.categories && category.categories.length < 1) return 10000;
                        else {
                            return category[sortByField] && parseInt(category[sortByField]) > -1 ? parseInt(category[sortByField]) : category.categories.length;
                        }
                    }
                });
            }
            
            _.each(categories, function (category, index)
            {
                var href = category.fullurl

                    ,	tab = {
                    'href': href
                    ,	'text': category.name
                    ,	'data':
                    {
                        hashtag: '#' + href
                        ,	touchpoint: 'home'
                    }
                    ,	'class': 'header-menu-level' + category.level + '-anchor'
                    ,	'data-type': 'commercecategory'
                };


                if (category.categories) {
                    var subCategories = category.categories;

                    if(!SC.isPageGenerator()) {
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

                if(category.name === "More"){
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

	,	addToNavigationTabs: function (categories)
		{
			if (Configuration.get('categories.addToNavigationTabs'))
			{
				var self = this
				,	navigationData = Configuration.get('navigationData')
				,	index = -1;

				// delete previews categories on the menu
				var lastIndex = navigationData.length;

				while(lastIndex--)
				{
					if (navigationData[lastIndex]['data-type'] === 'commercecategory')
					{
						navigationData.splice(lastIndex, 1);
					}
				}

				for (var i = 0; i < navigationData.length; i++)
				{
					if (navigationData[i].placeholder === 'Categories')
					{
						index = i;

						break;
					}
				}

				if (index !== -1)
				{
					var tabs = self.makeNavigationTab(categories);

					// navigationData.splice(index, 1);

					_.each(tabs, function(tab, position)
					{
						navigationData.splice(index + position, 0, tab);
					});
				}

                /*var moreLink = _.first(_.filter(navigationData, function(navigation){
                    return navigation.placeholder === "Categories.NoSubCategories";
                })) || {};

                moreLink['categories'] = self.moreCategories;*/

				this.application.trigger('Configuration.navigationData');
			}
		}

	,	getTopLevelCategoriesUrlComponent: function()
		{
			return this.topLevelCategories;
		}

	,	mountToApp: function (application)
		{
			if (Configuration.get('categories'))
			{
				var self = this
				,	categories = SC.CATEGORIES;
				//delete SC.CATEGORIES.categories;

				this.application = application;

				_.each(categories, function (category)
				{
					self.topLevelCategories.push(category.fullurl);
				});

				this.addToNavigationTabs(categories);
			}
		}
	};
});
