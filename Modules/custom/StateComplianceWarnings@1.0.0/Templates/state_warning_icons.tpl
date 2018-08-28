
{{#if showWarnings}}
    <div class="warning-icon-container">
        {{#if showCAProp65Warning}}
            <img src="{{warningIconCA}}" data-toggle="popover" title="WARNING" data-content="{{tooltipTextCA}}" data-placement="bottom" />
        {{/if}}
        {{#if showWASB6413Warning}}
            <img src="{{warningIconWA}}" data-toggle="popover" data-content="{{tooltipTextWA}}" data-placement="bottom" />
        {{/if}}
    </div>
{{/if}}