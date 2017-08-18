/*
	© 2017 LN Curtis
*/

// @module Header
define(
	'Header.MiniCart.View.Extension'
,	[
		'Header.MiniCart.View'
    ,   'LiveOrder.Model'
    ,   "Backbone"
	,	'Backbone.CompositeView'

	,	'underscore'
	]
,	function(
        HeaderMiniCartView
    ,   LiveOrderModel
    ,   Backbone
	,	BackboneCompositeView

	,	_
	)
{
	'use strict';

	_.extend( HeaderMiniCartView.prototype, {

        initialize: function()
        {
            BackboneCompositeView.add(this);

            var self = this;

            this.isLoading = true;
            this.itemsInCart = 0;

            this.model = LiveOrderModel.getInstance();

            LiveOrderModel.loadCart().done( function ()
            {
                self.itemsInCart = self.model.getTotalItemCount();
                self.isLoading = false;
                self.render();

                self.model.on('change', function ()
                {
                    self.itemsInCart = self.model.getTotalItemCount();
                    self.render();
                });

            });

            this.model.get('lines').on('add remove', this.render, this);

        }

    ,   getContext: _.wrap( HeaderMiniCartView.prototype.getContext, function(fn)
        {
            var self = this
            ,   returnVariable = fn.apply(self, _.toArray(arguments).slice(1));

            _.extend( returnVariable , {
                showItemCount: this.itemsInCart > 0
            ,	subTotal: false
            ,	lines: !this.isLoading ? self.model.get('lines') : new Backbone.Collection()

            });

            return returnVariable
        })

	});
});