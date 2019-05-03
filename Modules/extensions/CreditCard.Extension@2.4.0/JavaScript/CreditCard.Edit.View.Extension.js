define('CreditCard.Edit.View.Extension'
,   [
        'CreditCard.Edit.View'
    ]
,   function
    (
        CreditCardEditView
    )
{
    'use strict';

    _.extend(CreditCardEditView.prototype, {

        setPaymethodKey: function (e)
        {
            var cc_number = jQuery(e.target).val().replace(/\s/g, '')
            ,	form = jQuery(e.target).closest('form')
            ,	paymenthod_key = this.paymenthodKeyCreditCart(cc_number);

            jQuery(e.target).val(cc_number);

            form.find('[name="paymentmethod"]').val(paymenthod_key || 0);

            if (paymenthod_key && this.showCardsImgs)
            {
                form.find('[data-image="creditcard-icon"]').each(function (index, img)
                {
                    var $img = jQuery(img);
                    if ($img.data('value') === paymenthod_key)
                    {
                        $img.addClass('creditcard-edit-card-selected');
                        $img.removeClass('creditcard-edit-card-no-selected');
                    } else {
                        $img.addClass('creditcard-edit-card-no-selected');
                        $img.removeClass('creditcard-edit-card-selected');
                    }
                });
                form.find('[data-value="creditcard-img-container"]').css('display', 'block');
            }
        }
    });
});