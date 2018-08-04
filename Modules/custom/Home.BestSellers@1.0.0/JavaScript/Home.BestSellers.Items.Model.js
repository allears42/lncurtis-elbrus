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
            // var item1 = Configuration.get('homepageBestsellers.itemOne')
            // ,   item2 = Configuration.get('homepageBestsellers.itemTwo')
            // ,   item3 = Configuration.get('homepageBestsellers.itemThree')
            // ,   item4 = Configuration.get('homepageBestsellers.itemFour');

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
            // ,   id: '19108,19135,278603,278604'
            //     ,   id: '19108,19135,278603'
            //     ,   id: item1 + ',' + item2 + ',' + item3 + ',' + item4
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
                // item.set('bestsellerSort', self.sortMap[internalid]);
                item.bestsellerSort = self.sortMap[internalid];
            });

            console.log('RESPONSE: ', response.items);
            
            return response;
        }
    });
});