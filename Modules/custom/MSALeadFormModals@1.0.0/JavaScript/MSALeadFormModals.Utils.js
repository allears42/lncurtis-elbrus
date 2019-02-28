define('MSALeadFormModals.Utils'
,   [
        'jQuery'
    ]
,   function
    (
       jQuery
    )
{
    'use strict';

    var cookiePrefix = 'msa-lead-campaign-';

    function getCookieName(model)
    {
        return cookiePrefix + model.get('custevent_jhm_msa_lead_campaign');
    }

    function setCookie(model)
    {
        jQuery.cookie(getCookieName(model), true, {path: '/', expires: 365});
    }

    function getCookie(model)
    {
        return jQuery.cookie(getCookieName(model));
    }

    return {
        getCookie: getCookie
    ,   setCookie: setCookie
    }
});