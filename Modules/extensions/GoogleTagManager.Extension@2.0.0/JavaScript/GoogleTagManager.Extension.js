//@module GoogleTagManagerExtension

//@class GoogleTagManagerExtension @extends GoogleTagManager Adds custom events for Google Tag Manager scripts
define('GoogleTagManager.Extension'
,	[
        'Header.View'
    ,   'CustomerServiceForm.View'
    ,   'GoogleTagManager'
	,	'underscore'
]
,	function (

		HeaderView
    ,   CustomerServiceFormView
    ,   GoogleTagManager
	,	_

	)
    {
        'use strict';
        
        _.extend(HeaderView.prototype, {
            
            events: _.extend( HeaderView.prototype.events, {
                
                // data-action added to: ...\Modules\overrides\Override.Header@1.3.0\Templates\header.tpl
                'click [data-action="gtm-track-header-phone"]': 'gtmTrackCall'
            })
            
        ,   gtmTrackCall: function() {

               //onClick="ga('send', 'event', 'Header Phone Number', 'Click', 'Lead');"
                GoogleTagManager.trackEvent({
                    category: "Header Phone Number",
                    action: "Click",
                    label: "Lead"
                });
            }
            
        });
        
        _.extend(CustomerServiceFormView.prototype, {
            
            events: _.extend(CustomerServiceFormView.prototype.events, {
                
                // data-action added to: ...\Modules\custom\CustomerServiceForm@1.0.0\Templates\customerserviceform.tpl
                'submit [data-action="gtm-track-header-email"]': 'gtmTrackEmail'
            })
            
        ,   gtmTrackEmail: function() {
            
                //onClick="ga('send', 'event', 'Header Email', 'Click', 'Lead');"
                GoogleTagManager.trackEvent({
                    category: "Header Email",
                    action: "Click",
                    label: "Lead"
                });
            }
        
        });
    }
);