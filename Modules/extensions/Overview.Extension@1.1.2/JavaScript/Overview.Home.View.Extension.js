/*
	© 2017 LN Curtis
*/

define(
    'Overview.Home.View.Extension'
    ,	[
        'Overview.Home.View'
	,	'Backbone'
    ,	'Backbone.CollectionView'
    ,	'OrderHistory.List.Tracking.Number.View'
    ,	'Handlebars'
    ,   'SC.Configuration'
    ,	'RecordViews.View'

	,	'underscore'

    ]
    ,	function(
        OverviewHomeView
	,	Backbone
    ,	BackboneCollectionView
    ,	OrderHistoryListTrackingNumberView
    ,	Handlebars
    ,   Configuration
    ,	RecordViewsView


	, 	_

    )
    {
        'use strict';

        _.extend( OverviewHomeView.prototype, {

            title: _('Welcome').translate()

		,	childViews: _.extend( OverviewHomeView.prototype.childViews,
			{
                'Order.History.Results': function ()
                {
                    var self = this
                        ,	records_collection = new Backbone.Collection(this.collection.map(function (order)
                    {
                        var dynamic_column
                        ,   status
                        ,   tooltipString = 'orderStatusTooltips.'
                        ,   statusValue;

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
                
                            status = order.get('status');
                            if(status.name === 'Pending Approval') {
                                statusValue = 'Pending Fulfillment';
                                tooltipString += 'pendingFulfillment';
                            } else {
                                statusValue = status.name;
                                tooltipString += status.internalid;
                            }

                            dynamic_column = {
                                label: _('Status:').translate()
                                ,	type: 'status'
                                ,	name: 'status'
                                ,   value: statusValue
                                ,   tooltip: Configuration.get(tooltipString)
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
                            }
                            ,	{
                                type: 'tracking-number'
                                ,	name: 'trackingNumber'
                                ,	compositeKey: 'OrderHistoryListTrackingNumberView'
                                ,	composite: new OrderHistoryListTrackingNumberView({
                                    model: new Backbone.Model({
                                        trackingNumbers: order.get('trackingnumbers')
                                    })
                                    ,	showContentOnEmpty: true
                                    ,	contentClass: ''
                                    ,	collapseElements: true
                                })
                            }
                        ];

                        columns.splice(2, 0, dynamic_column);

                        var model = new Backbone.Model({
                            title: new Handlebars.SafeString(_('<span class="tranid">$(0)</span>').translate(order.get('tranid')))
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
                        childView: RecordViewsView
                        ,	collection: records_collection
                        ,	viewsPerRow: 1
                    });
                }
			})

		,	showContent: function ()
            {
                // off events of defaults
                this.offEventsOfDefaults();

                // set the defaults
                this.defaultShippingAddress = this.addresses.findWhere({defaultshipping: 'T'});
                this.defaultCreditCard = this.creditcards.findWhere({ccdefault: 'T'});

                // on events of defaults
                this.defaultShippingAddress && this.defaultShippingAddress.on('change', this.showContent, this);
                this.defaultCreditCard && this.defaultCreditCard.on('change', this.showContent, this);

                this.title = this.model.get('firstname') ? _('Welcome, $(0)').translate(this.model.get('firstname')) : this.title;
                this.application.getLayout().showContent(this);
            }

        });

    });
