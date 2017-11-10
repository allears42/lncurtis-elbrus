/*
	© 2017 LN Curtis
*/

define(
    'OrderHistory.List.View.Extension'
    ,	[
        'OrderHistory.List.View'
    ,   'Backbone'
    ,   'Backbone.CollectionView'
    ,	'RecordViews.Actionable.View'
    ,	'OrderHistory.List.Tracking.Number.View'
    ,	'Handlebars'
    ,   'SC.Configuration'

    ,	'underscore'

    ]
    ,	function(
        OrderHistoryListView
    ,   Backbone
    ,   BackboneCollectionView
    ,   RecordViewsActionableView
    ,   OrderHistoryListTrackingNumberView
    ,   Handlebars
    ,   Configuration

    , 	_

    )
    {
        'use strict';

        _.extend( OrderHistoryListView.prototype, {

            childViews: _.extend( OrderHistoryListView.prototype.childViews,
            {
                'Order.History.Results': function ()
                {
                    var self = this
                    ,	records_collection = new Backbone.Collection(this.collection.map(function (order)
                    {
                        var dynamic_column;

                        if (self.isSCISIntegrationEnabled)
                        {
                            dynamic_column = {
                                label: _('Origin:').translate()
                                ,	type: 'origin'
                                ,	name: 'origin'
                                ,	value: _.findWhere(Configuration.get('transactionRecordOriginMapping'), { origin: order.get('origin') || null }).name
                            };
                        }
                        else
                        {
                            dynamic_column = {
                                label: _('Status:').translate()
                                ,	type: 'status'
                                ,	name: 'status'
                                ,	value: order.get('status').name === "Pending Approval" ? "Pending Fufillment" : order.get('status').name
                            };
                        }

                        var columns = [
                            {
                                label: _('Date:').translate()
                                ,	type: 'date'
                                ,	name: 'date'
                                ,	value: order.get('trandate')
                            }
                            ,	{
                                label: _('Amount:').translate()
                                ,	type: 'currency'
                                ,	name: 'amount'
                                ,	value: order.get('amount_formatted')
                            }];

                        if (!_.isUndefined(dynamic_column))
                        {
                            columns.push(dynamic_column);
                        }

                        var model = new Backbone.Model({title: new Handlebars.SafeString(_('<span class="tranid">$(0)</span>').translate(order.get('tranid')))
                            ,	touchpoint: 'customercenter'
                            ,	detailsURL: '/purchases/view/' + order.get('recordtype')  + '/' + order.get('internalid')
                            ,	recordType: order.get('recordtype')
                            ,	id: order.get('internalid')
                            ,	internalid: order.get('internalid')
                            ,	trackingNumbers: order.get('trackingnumbers')
                            ,	columns: columns
                        });

                        return model;
                    }));

                    return new BackboneCollectionView({
                        childView: RecordViewsActionableView
                        ,	collection: records_collection
                        ,	viewsPerRow: 1
                        ,	childViewOptions: {
                            actionView: OrderHistoryListTrackingNumberView
                            ,	actionOptions: {
                                showContentOnEmpty: true
                                ,	contentClass: ''
                                ,	collapseElements: true
                            }
                        }
                    });
                }
            })

        });

    });
