/*
 © 2017 JHM Services
 */

//@module Newsletter
define(
    'Newsletter.Router'
    ,	[
        'Newsletter.View',
        'Newsletter.Model'
        
        ,	'Backbone'
    ]
    ,	function (
        NewsletterView
        ,   NewsletterModel
        ,	Backbone
    )
    {
        'use strict';
        
        // @lass Newsletter.Router @extends Backbone.Router
        return Backbone.Router.extend({
            
            routes: {
                'newsletter': 'NewsletterPage'
            }
            
            ,	initialize: function (Application)
            {
                this.application = Application;
            }
            
            // @method NewsletterPage dispatch the 'go to Newsletter page' route
            ,	NewsletterPage: function ()
            {
                var view = new NewsletterView({
                    'model': new NewsletterModel()
                    ,	'application': this.application
                });
                
                view.showContent();
            }
        });
    });