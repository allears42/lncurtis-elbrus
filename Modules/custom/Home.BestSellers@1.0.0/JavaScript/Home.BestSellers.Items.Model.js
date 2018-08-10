define('Home.BestSellers.Items.Model'
,   [
        'Backbone'
    ,   'underscore'
    ,   'Profile.Model'
    ,   'jQuery'
    ,   'SC.Configuration'
    ]
,   function
    (
        Backbone
    ,   _
    ,   ProfileModel
    ,   jQuery
    ,   Configuration
    )
{
    'use strict';

    return Backbone.Model.extend({

        url: function()
        {
            var profile = ProfileModel.getInstance()
            ,	url = _.addParamsToUrl(
                        profile.getSearchApiUrl()
                    ,   this.searchParams
                    ,	profile.isAvoidingDoubleRedirect()
                    );

            return url;
        }
        
    ,   sortMap: {}

    ,   initialize: function()
        {
            this.item1 = Configuration.get('homepageBestsellers.itemOne');
            this.item2 = Configuration.get('homepageBestsellers.itemTwo');
            this.item3 = Configuration.get('homepageBestsellers.itemThree');
            this.item4 = Configuration.get('homepageBestsellers.itemFour');
            
            this.sortMap[this.item1] = 1;
            this.sortMap[this.item2] = 2;
            this.sortMap[this.item3] = 3;
            this.sortMap[this.item4] = 4;

            var searchParamObject = {
                fieldset: 'search'
            ,   id: this.item1 + ',' + this.item2 + ',' + this.item3 + ',' + this.item4
            };

            this.searchParams = searchParamObject;
        }

    ,   parse: function(response)
        {
            var self = this
            ,   internalid;
            
            _.each(response.items, function(item) {
                
                internalid = item.internalid;
                item.bestsellerSort = self.sortMap[internalid];
            });
            
            return response;
        }
    });
});