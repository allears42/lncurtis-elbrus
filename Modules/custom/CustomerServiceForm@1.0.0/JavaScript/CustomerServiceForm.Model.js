define(
    'CustomerServiceForm.Model'
    ,	[
        'Backbone'
        ,	'underscore'
        ,	'Utils'
    ]
    ,	function (
        Backbone
        ,	_
    )
    {
        'use strict';
        // @class Case.Model Model for handling Support Cases (CRUD) @extends Backbone.Model

        //@method validateLength. Validates message length. (0 < length <= 4000)
        function validateLength (value, name)
        {
            var max_length = 4000;

            if (value && value.length > max_length)
            {
                return _('$(0) must be at most $(1) characters').translate('Message', max_length);
            }
        }

        //@method validateMessage. Validates message entered by the user. Checks length 0 < length <= 4000.
        function validateMessage (value, name)
        {
			if (!value)
			{
				return _('$(0) is required').translate('Message');
			}

			return validateLength(value, name);
        }

        return Backbone.Model.extend(
            {
                urlRoot: _.getAbsoluteUrl('services/CustomerServiceForm.Service.ss')

                , validation: {
                firstname: {
                    required: true
                    , msg: _('First Name is required').translate()
                }

                , lastname: {
                    required: true
                    , msg: _('Last Name is required').translate()
                }

                , email: {
                    required: true
                    , pattern: 'email'
                    , msg: _('Please provide a valid email').translate()
                }

                , issue: {
                    required: true
                    , min: 1
                    , msg: _('Message Subject is required').translate()
                }

                , custentity_title: {
                    required: true
                    , msg: _('Message Title is required').translate()
                }

                , comments: {
                    fn: validateMessage
                }
            }
        });
    });