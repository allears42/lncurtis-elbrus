/*
	© 2017 LN Curtis
*/

define(
    'ErrorManagement.PageNotFound.View.Extension'
    ,	[
        'ErrorManagement.PageNotFound.View'
    ,   'SC.Configuration'
    ,   'Backbone.CompositeView'
    ,   'Home.BestSellers.View'
    ,   'Home.BestSellers.Items.Model'

    ,	'underscore'

    ]
    ,	function(
        ErrorManagementPageNotFoundView
    ,   Configuration
    ,   BackboneCompositeView
    ,   HomeBestSellersView
    ,   HomeBestSellersItemsModel

    , 	_

    )
    {
        'use strict';

        _.extend( ErrorManagementPageNotFoundView.prototype, {

            getBreadcrumbPages: function ()
            {
                return {href: '/', text: _('Error 404').translate()};
            }

        ,   childViews: _.extend({}, ErrorManagementPageNotFoundView.prototype.childViews, {

                'BestSellers': function() {

                    var homeBestSellersItemsModel = new HomeBestSellersItemsModel()
                    ,   homeBestSellersItemsPromise = homeBestSellersItemsModel.fetch();

                    return new HomeBestSellersView({
                        homeBestSellersItemsModel: homeBestSellersItemsModel
                    ,   homeBestSellersItemsPromise: homeBestSellersItemsPromise
                    });
                }
            })

        ,   getContext: _.wrap( ErrorManagementPageNotFoundView.prototype.getContext, function(fn)
            {
                var returnVariable;

                /**
                 * There is some kind of race condition happening in this view (maybe all error management views)
                 * where about 1 out of 10 times, the childViewInstances property won't get set, and the child
                 * views won't get rendered. Here we are testing for that, and if it's the case, we're manually
                 * calling the addChildViews method from Backbone.CompositeView.
                 */
                if(this.childViews && typeof this.childViewInstances == 'undefined') {

                    this.childViewInstances = {};
                    this.addChildViews(this.childViews);
                }

                returnVariable = fn.apply(this, _.toArray(arguments).slice(1));

                _.extend(returnVariable , {
                    telephone : Configuration.get("header.telephone", "#")
                ,   customerServiceHours : Configuration.get("header.customerServiceHours", "#")
               });

                return returnVariable
            })

        });

    });
