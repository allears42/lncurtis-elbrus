define('StateComplianceWarnings.View'
,   [
        'Backbone'
    ,	'SC.Configuration'
    ,   'state_warning_icons.tpl'
    ]
,   function
    (
        Backbone
    ,	Configuration
    ,   state_warning_icons_tpl
    )
{
    'use strict';

    return Backbone.View.extend({

        template: state_warning_icons_tpl

    ,   events: {
            'mouseover [data-toggle="popover"]': 'openPopover'
        }

    ,   initialize: function(options)
        {
            if(options.hasOwnProperty('template') && options.template) {
                this.template = options.template;
            }

            this.model.on('change', this.render, this);
        }

    ,	openPopover: function (e)
        {
            e.preventDefault();
            e.stopPropagation();

            var $link = this.$(e.target);

            $link.popover({
                trigger: 'manual'
            ,	html: true
            }).popover('toggle');

            // add more close popover
            this.closePopover($link);
        }

    ,	closePopover: function (link)
        {
            // close mouseout
            link.on('mouseout', function (e)
            {
                e.preventDefault();
                link.popover('hide');
            });

            // close for mobile
            this.$el.one('click', '[data-type="close-popover"]', function (e)
            {
                e.preventDefault();
                link.popover('hide');
            });
        }

    ,   getContext: function()
        {
            var item = this.model.get('item')
            ,   selectedChilds
            ,	showWarnings
            ,	CAProp65WarningText = ''
            ,	WASB6413WarningText = '';

            if(_.isFunction(this.model.getSelectedMatrixChilds)) {
                selectedChilds = this.model.getSelectedMatrixChilds();
            } else {
                selectedChilds = [];
            }

            if(selectedChilds.length && selectedChilds.length == 1) {
                item = selectedChilds[0];
            }

            showWarnings = item.get('_showWarningIcons');

            if(showWarnings) {
                CAProp65WarningText = item.get('_ca_prop_65_warning_text');
                WASB6413WarningText = item.get('_wa_sb_6413_warning_text');
            }

            return {
                showCAProp65Warning: item.get('_show_ca_prop_65_warning')
            ,	showWASB6413Warning: item.get('_show_wa_sb_6413_warning')
            ,	warningIconCA: Configuration.get('stateWarnings.californiaIcon', '/images/warning_ca_65-3.png')
            ,	warningIconWA: Configuration.get('stateWarnings.washingtonIcon', '/images/warning_wa_6413-3.png')
            ,	tooltipTextCA: CAProp65WarningText
            ,	tooltipTextWA: WASB6413WarningText
            ,	showWarnings: showWarnings
            ,	CAProp65WarningText: CAProp65WarningText
            ,	WASB6413WarningText: WASB6413WarningText
            }
        }

    })
});