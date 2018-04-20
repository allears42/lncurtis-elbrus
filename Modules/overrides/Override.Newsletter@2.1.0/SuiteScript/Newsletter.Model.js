/*
	© 2017 JHM Services
	Add logic to set required custom fields on lead / customer record
*/

//@module Newsletter
// ----------
// Handles newsletter subscription through 'lead' or 'customer' record creation/set up.
define(
	'Newsletter.Model'
,	[
		'SC.Model'
	,	'SC.Models.Init'

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

	// @class Newsletter.Model Defines the model used by the Newsletter subscription service.
	// @extends SCModel
	return SCModel.extend({

		// @property {String} name Mandatory for all ssp-libraries models
		name: 'Newsletter'

		// @property {String} validation Includes the validation criteria
	,	validation: {
			email: {
				required: true
			,	pattern: 'email'
			,	msg: 'Valid email is required'
			}
		,	firstName: {
				required: true
				,	msg: 'First name is required'
			}
		,	lastName: {
				required: true
				,	msg: 'Last name is required'
			}
		,	zipcode: {
				required: true
				,	msg: 'Zipcode is required'
			}
		}

		// @method subscribe Processes the registration of the incoming mail as a newsletter subscriber
		// Please note that a newsletter subscriber has the following value in the 'customer' or lead' records:
		// globalsubscriptionstatus == 1 : (Soft Opt-In, the value we are setting up for new subscribers)
		// globalsubscriptionstatus == 2 : lead NOT subscribed (Soft Opt-Out)
		// globalsubscriptionstatus == 3 : lead already subscribed (Confirmed Opt-In)
		// globalsubscriptionstatus == 4 : lead NOT subscribed (Confirmed Opt-Out)
		// @param {String} email
		// @returns {Newsletter.Model.SuccessfulAnswer} Customer/lead subscription operation result
	,	subscribe: function subscribe (data)
		{
            //nlapiLogExecution('DEBUG', 'subscribe - data', JSON.stringify(data, null, 2))
            this.validate(data);

			var searchFilter = new nlobjSearchFilter('email', null, 'is', data.email)
			,	searchColumnSubscriptionStatus = new nlobjSearchColumn('globalsubscriptionstatus')
			,	customers = nlapiSearchRecord('customer', null, [searchFilter], [searchColumnSubscriptionStatus])

			//Searching by 'customer' returns 'customer' and 'lead' records alltogether,
			//so we group the records by recordtype: i.e.: 'customer' and 'lead' groups.
			,	records = _.groupBy(customers, function (customer)
				{
					return customer.getRecordType();
				});

			//If there's NOT any customer or lead with this email, we set up a lead with globalsubscriptionstatus = 1
			if (!records.customer && !records.lead)
			{
				return this.createSubscription(data);
			}
			else
			{
				return records.customer ? this.updateSubscription(records.customer) : this.updateSubscription(records.lead);
			}
		}

		// @method createSubscription Create a new 'lead' record with globalsubscriptionstatus = 1 (Soft Opt-In)
		// @parameter {String} email
		// @returns {subscriptionDone} Custom object with confirmation of lead record creation
	,	createSubscription: function createSubscription (data)
		{
            // nlapiLogExecution('DEBUG', 'createSubscription - data', JSON.stringify(data, null, 2));

            var site_id = ModelsInit.session.getSiteSettings(['siteid']).siteid;
            var isLNCurtisSite = (site_id == 2);
            // nlapiLogExecution('DEBUG', 'createSubscription - isLNCurtisSite', JSON.stringify(isLNCurtisSite, null, 2));

            //default values for all customers
            var defaultValues = {
                // default lead attributes
                isperson: 'T'
                , custentity_customer_class: 1 	// LN Curtis and sons
                , salesrep: 53161 	// LNCS Pacific North
                , category: 8 	// Person
                , custentity_accountclass: 3 	// C
                , custentity_targetmarket: 1 	// Fire
                , custentity_salesregion: 1 	// Pacific North
                , custentity_internal_notes: (isLNCurtisSite)
					? 'Lead created from LNCurtis.com Newsletter Signup form'
					: 'Lead created from CurtisBlueLine.com Newsletter Signup form'
				, custentity_website_source: site_id
                , subsidiary: 1 	// LN Curtis & sons
                , custentity_department: 36 	// 001 - LNCS Oakland
                , entitystatus: 6 	// LEAD-Unqualified
                , customform: 67    // LNCS CUSTOMER - CS
                , accessrole: 1085  // WEB B2C CUSTOMER CENTER
				, weblead: 'T'

            };

			var record = nlapiCreateRecord('lead');
			record.setFieldValue('entityid', data.email);
			record.setFieldValue('firstname', data.firstName || SC.Configuration.newsletter.genericFirstName);
			record.setFieldValue('lastname', data.lastName || SC.Configuration.newsletter.genericLastName);
			record.setFieldValue('email', data.email);
			record.setFieldValue('subsidiary', ModelsInit.session.getShopperSubsidiary());
			record.setFieldValue('companyname', data.firstName || SC.Configuration.newsletter.genericFirstName + ' ' + data.lastName || SC.Configuration.newsletter.genericLastName);
			record.setFieldValue('globalsubscriptionstatus', 1);

            record.setFieldValue('custentity_customer_class', defaultValues['custentity_customer_class']);
            record.setFieldValue('salesrep', defaultValues['salesrep']);
            record.setFieldValue('category', defaultValues['category']);
            record.setFieldValue('custentity_targetmarket', defaultValues['custentity_targetmarket']);
            record.setFieldValue('custentity_salesregion', defaultValues['custentity_salesregion']);
            record.setFieldValue('custentity_department', defaultValues['custentity_department']);

            record.setFieldValue('custentity_internal_notes', defaultValues['custentity_internal_notes']);
            record.setFieldValue('custentity_website_source', defaultValues['custentity_website_source']);
            record.setFieldValue('weblead', defaultValues['weblead']);

            nlapiSubmitRecord(record);
   
			return this.subscriptionDone;
		}

		// @method updateSubscription Update globalsubscriptionstatus of the records received
		// @parameter {Array<nlObjSearchObject>} subscribers Array of customer or leads.
		// @returns {Newsletter.Model.SubscriptionDone} Customer/lead subscription operation result
	,	updateSubscription: function updateSubscription (subscribers)
		{
			var subscribers_data = _.map(subscribers, function (subscriber)
				{
					return {
						'id': subscriber.getId()
					,	'status': subscriber.getValue('globalsubscriptionstatus')
					};
				})

				// We count the subscribers by its statuses
			,	subscribers_count = _.countBy(subscribers_data, function (subscriber)
				{
					return subscriber['status'];
				});

			// Set up the quantity of the subscribers statuses. If it is NaN, is converted to number zero.
			subscribers_count['1'] = subscribers_count['1'] || 0;
			subscribers_count['2'] = subscribers_count['2'] || 0;
			subscribers_count['3'] = subscribers_count['3'] || 0;
			subscribers_count['4'] = subscribers_count['4'] || 0;

			// If every customer is in 'Confirmed Opt-Out' status ('4'), we cannot subscribe them.
			if ((subscribers_count['4']) === subscribers.length)
			{
				throw this.buildErrorAnswer('ERR_USER_STATUS_DISABLED');
			}
			// If everyone is among 'Soft Opt-In' ('1'), 'Confirmed Opt-In' ('3') or 'Confirmed Opt-Out' ('4'),
			// we cannot subscribe them, and we answer with an 'already subscribed' message.
			else if (subscribers_count['1'] + subscribers_count['3'] + subscribers_count['4'] === subscribers.length)
			{
				throw this.buildErrorAnswer('ERR_USER_STATUS_ALREADY_SUBSCRIBED');
			}
			// If some subscribers are in 'Soft Opt-Out' change every customer with status 'Soft Opt-Out' (2) to 'Soft Opt-In' (1)
			else if (subscribers_count['2'])
			{

				// Get the customers able to be subscribed
				var customers_to_subscribe = _.filter(subscribers_data, function (subscriber)
				{
					return subscriber.status === 2;
				});

				//Updating all subscribers to 'Soft Opt-In' status.
				//Potentially demanding operation on large amount
				//of subscribers; documentation points using nlapiSubmitField
				//as the cheaper way to update lines.
				_.each(customers_to_subscribe,  function (subscriber)
				{
                    var fields = ['globalsubscriptionstatus'
                        , 'custentity_customer_class'
                        , 'salesrep'
                        , 'category'
                        , 'custentity_targetmarket'
                        , 'custentity_salesregion'
                        , 'custentity_department'],
                        values = [1
                            , 1
                            , 53161
                            , 8
                            , 1
                            , 1
                            , 36];
					nlapiSubmitField('customer', subscriber.id, fields, values, false);
				});

				return this.subscriptionDone;
			}
			else
			{
				throw this.buildErrorAnswer('ERROR');
			}
		}

		//@property {Newsletter.Model.SuccessfulAnswer} subscriptionDone
	,	subscriptionDone: {
			code: 'OK'
		,	message: 'Subscription successful!'
		}

		//@method buildErrorAnswer Build the error answer
		//@param {String} String with error code
		//@return {Newsletter.Model.ErrorAnswer} Subscription fail object.
	,	buildErrorAnswer: function buildErrorAnswer (code)
		{
			return {
				status: 500
			,	code: code
			,	message: 'Error trying to set up subscription.'
			};
		}
	});
});

//@class Newsletter.Model.SuccessfulAnswer Subscription successful object.
//@property {String} code
//@property {String} message

//@class Newsletter.Model.ErrorAnswer Subscription failed object.
//@property {String} status Http error status.
//@property {String} code String with response code.
//@property {String} message