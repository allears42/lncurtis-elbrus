define('ProductBadging.View'
,   [
        'Backbone'
    ,   'underscore'
    ,   'product_badging.tpl'
    ,   'SC.Configuration'
    ]
,   function
    (
        Backbone
    ,   _
    ,   product_badging_tpl
    ,   Configuration
    )
{
    'use strict';

    return Backbone.View.extend({

        template: product_badging_tpl

    ,   initialize: function()
        {
            this.model.on('change', this.render, this);
        }

    ,   getContext: function()
        {
            var badgeString
            ,   badgeArr
            ,   allBadges = Configuration.get('productBadging')
            ,   currConfigObj
            ,   badgesToDisplayArr = []
            ,   currBadgeToDisplay
            ,   item = this.model.get('item')
            ,   selectedChilds;

            if(allBadges && allBadges.hasOwnProperty('Badges')) {

                // If item exists here, we have a request from the PDP. Check for selected child item
                if(item) {

                    if(_.isFunction(this.model.getSelectedMatrixChilds)) {
                        selectedChilds = this.model.getSelectedMatrixChilds();
                    } else {
                        selectedChilds = [];
                    }

                    if(selectedChilds.length && selectedChilds.length == 1) {
                        item = selectedChilds[0];
                    }
                    // Otherwise, this request came from the facet browse view; we have no product info, so use this model
                } else {
                    item = this.model;
                }

                badgeString = item.get('_product_badges');

                if(allBadges && allBadges.hasOwnProperty('Badges') && badgeString && badgeString != '&nbsp;') {

                    allBadges = allBadges.Badges;
                    badgeArr = badgeString.split(', ');

                    // Iterate over this item's selected badges
                    _.each(badgeArr, function(currBadge) {

                        // Find matching badge in configuration object
                        currConfigObj = _.find(allBadges, function(configBadge) {

                            return configBadge.badgeTypeDisplay == currBadge;
                        });

                        // If we have a match, create an obj with all required data and push to our array
                        if(currConfigObj) {

                            currBadgeToDisplay = {
                                text: currBadge
                                ,   class: currConfigObj.badgeColor
                            };

                            badgesToDisplayArr.push(currBadgeToDisplay);
                        }
                    })
                }
            }




            return {
                badges: badgesToDisplayArr
            }

        }
    });
});