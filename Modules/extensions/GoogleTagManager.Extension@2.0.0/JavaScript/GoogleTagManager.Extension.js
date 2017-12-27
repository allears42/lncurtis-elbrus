//@module GoogleTagManagerExtension

//@class GoogleTagManagerExtension @extends GoogleTagManager Adds custom events for Google Tag Manager scripts
define('GoogleTagManager.Extension'
,	[
        'Header.View'
    ,   'CustomerServiceForm.View'
    ,   'Tracker'
	,	'underscore'
    ,   'Backbone'
]
,	function (

		HeaderView
    ,   CustomerServiceFormView
    ,   Tracker
	,	_
    ,   Backbone

	)
    {
        'use strict';
        
        _.extend(HeaderView.prototype, {
            
            events: _.extend( HeaderView.prototype.events, {
                
                // data-action added to: ...\Modules\overrides\Override.Header@1.3.0\Templates\header.tpl
                'click [data-action="gtm-track-header-phone"]': 'gtmTrackCall'
            })
            
        ,   gtmTrackCall: function() {

                Tracker.getInstance().trackEvent({
                    category: "Header Phone Number",
                    action: "Click",
                    label: "Lead",
                    value: 1,
                    page: '/' + Backbone.history.fragment
                });
            }
            
        });
        
        _.extend(CustomerServiceFormView.prototype, {
            
            events: _.extend(CustomerServiceFormView.prototype.events, {
                
                // data-action added to: ...\Modules\custom\CustomerServiceForm@1.0.0\Templates\customerserviceform.tpl
                'submit [data-action="gtm-track-header-email"]': 'gtmTrackEmail'
            })
            
        ,   gtmTrackEmail: function() {
            
                Tracker.getInstance().trackEvent({
                    category: "Header Email",
                    action: "Click",
                    label: "Lead",
                    value: 1,
                    page: '/' + Backbone.history.fragment
                });
            }
        
        });
    }
);