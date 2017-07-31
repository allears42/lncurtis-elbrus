define(
	'CustomerServiceForm.Model'
,	[
		'SC.Model'
	,	'Models.Init'

	,	'underscore'
	,	'Utils'
	]

,	function (
		SCModel
	,	ModelsInit

	,	_
	)
{
	'use strict';

	// @class CustomerServiceForm.Model Defines the model used by the CustomerServiceForm subscription service.
	// @extends SCModel
	return SCModel.extend({

		// @property {String} name Mandatory for all ssp-libraries models
		name: 'CustomerServiceForm'

		// @property {String} validation Includes the validation criteria
	,	validation: {
            firstname: {
                required: true
                ,	msg: 'First Name is required'
            }

		,	lastname: {
                required: true
                ,	msg: 'Last Name is required'
            }

		,   email: {
				required: true
			,	pattern: 'email'
			,	msg: 'Valid email is required'
			}

		,	issue: {
                required: true
                ,	msg: 'Message Subject is required'
            }

		,	custentity_title: {
				required: true
				,	msg: 'Message Title is required'
			}

		,	comments: {
				required: true
				,	msg: 'Message is required'
			}
		}

	,	sendCase: function subscribe (data)
		{
			this.validate(data);
            return this.createCustomerServiceRecord(data)
		}

	,	createCustomerServiceRecord: function createCustomerServiceRecord (data)
		{
            var record = nlapiCreateRecord( 'customrecord_form_customer_service' );
            record.setFieldValue('name', data.email);
            record.setFieldValue('custrecord_form_cs_first', data.firstname || '');
            record.setFieldValue('custrecord_form_cs_last', data.lastname || '');
            record.setFieldValue('custrecord_form_cs_email', data.email);
            record.setFieldValue('custrecord_form_cs_subject', data.issue || '');
            record.setFieldValue('custrecord_form_cs_title', data.custentity_title || '');
            record.setFieldValue('custrecord_form_cs_comments', data.comments || '');
			nlapiSubmitRecord(record);
			return this.subscriptionDone;
		}

	,	subscriptionDone: {
			code: 'OK'
		,	message: 'Submission successful!'
		}

		//@method buildErrorAnswer Build the error answer
		//@param {String} String with error code
		//@return {CustomerServiceForm.Model.ErrorAnswer} Subscription fail object.
	,	buildErrorAnswer: function buildErrorAnswer (code)
		{
			return {
				status: 500
			,	code: code
			,	message: 'Error trying to submit case.'
			};
		}
	});
});

