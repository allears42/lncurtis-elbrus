<div id="order-wizard-ship-complete" class="">
    <h3 class="order-wizard-paymentmethod-purchasenumber-module-title">
        Ship Complete?
    </h3>
    <div class="order-wizard-ship-complete">
        <label for="custbody_jhm_ship_complete_web" class="order-wizard-address-module-checkbox">

            <input
                type="checkbox"
                name="custbody_jhm_ship_complete_web"
                id="custbody_jhm_ship_complete_web"
                value="{{model.options.custbody_jhm_ship_complete_web}}"
                {{#ifEquals model.options.custbody_jhm_ship_complete_web 'T'}}checked="true"{{/ifEquals}}
            >
            {{translate 'Check this box if you want us to ship this order only when all products are available.'}}
        </label>

    </div>
</div>