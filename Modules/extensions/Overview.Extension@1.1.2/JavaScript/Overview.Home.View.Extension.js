/*
	© 2017 LN Curtis
*/

define(
    'Overview.Home.View.Extension'
    ,	[
        'Overview.Home.View'
	,	'Backbone'

	,	'underscore'

    ]
    ,	function(
        OverviewHomeView
	,	Backbone
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
                                ,	value: order.get('status').name == "Pending Approval" ? "Pending Fulfillment" : order.get('status').name
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
