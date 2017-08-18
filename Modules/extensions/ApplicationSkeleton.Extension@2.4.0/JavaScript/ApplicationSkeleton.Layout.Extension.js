/*
	© 2017 LN Curtis
	Custom extension logic for ApplicationSkeleton.Layout
*/

define(
	'ApplicationSkeleton.Layout.Extension'
,	[
		'ApplicationSkeleton.Layout'

	,	'Tracker'

	,	'underscore'
	]
,	function(
        ApplicationSkeletonLayout

	,	Tracker

	, 	_
	)
{
	'use strict';

	_.extend( ApplicationSkeletonLayout.prototype, {

        _showContent: _.wrap( ApplicationSkeletonLayout.prototype._showContent, function(fn)
		{

        	var self = this
			,	view = _.toArray(arguments)[1];

			fn.apply(self, _.toArray(arguments).slice(1)).done( function() {

                if (!view.enhancedPage)
                {
                    Tracker.getInstance().trackPageview('/' + Backbone.history.fragment);
                }

			});
        })

	,	showInModal: function (view, options)
		{
			var promise_result = jQuery.Deferred();

			options = jQuery.extend({ modalOptions: {} }, options);

			view.events = view.events || {};
			// We add the mousedown event on the 'Cancel' button to hide the modal, otherwise,
			// the validation could add a validation error and move the position of the 'Cancel' button
			// and fail to close the modal on the click event (Issue: 343974).
			// Order of the events: mousedown, blur, click
			view.events['mousedown [data-dismiss="modal"]'] = function(e)
			{
				e.preventDefault();
			};

			// TODO this fix should be applied globally for all modals on mobile in the future
			// TODO REMOVE THIS PARTICULAR CODE FORM HERE!
			view.events['mousedown .address-edit-form-button-submit'] = function(e)
			{
				e.preventDefault();
			};

			// we tell the view its being shown in a Modal
			view.inModal = true;

			// we need a different variable to know if the view has already been rendered in a modal
			// this is to add the Modal container only once to the DOM
			if (!view.hasRenderedInModal)
			{
				var element_id = view.$el.attr('id');

				GlobalViewsModalView.prototype.attributes = {};
				GlobalViewsModalView.prototype.className = 'modal fade ' + (view.modalClass || element_id ? ('modal-'+ element_id) : '');
				GlobalViewsModalView.prototype.attributes.id = view.modalId || element_id ? ('modal-'+ element_id) : 'modal';

				var current_modal_view = new GlobalViewsModalView({
					childViewIstance: view
				,	pageHeader: view.page_header || view.title || view.model && view.model.get('page_header') || ''
				});

				this.$containerModal = view.$containerModal = current_modal_view.$el;

				this.modalCurrentView = view;
				this._currentView = view;

				view.options.layout = this;
			}

			this.trigger('beforeAppendView', view);

			if (!view.hasRenderedInModal)
			{
				var self = this;
				// if there was a modal opened we wait for close it
				this.closeModal().done(function () {
					self._showModalInDOM(view, options, current_modal_view, promise_result);
				});
			}
			else
			{
				this._renderModalView(view, current_modal_view);
				promise_result.resolveWith(this, [view]);
			}

			return promise_result;
		}

	});

});
