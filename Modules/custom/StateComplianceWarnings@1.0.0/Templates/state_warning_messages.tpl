
{{#if showWarnings}}
    <div class="warning-text-container">
        <p class="compliance-header">Compliance</p>

        {{#if showCAProp65Warning}}
        <div class="warning-text-item">
            <div class="warning-icon">
                <img src="{{warningIconCA}}" />
            </div>
            <p class="warning-text">{{{CAProp65WarningText}}}</p>
        </div>

        {{/if}}

        {{#if showWASB6413Warning}}
        <div class="warning-text-item">
            <div class="warning-icon">
                <img src="{{warningIconWA}}" />
            </div>
            <p class="warning-text">{{{WASB6413WarningText}}}</p>
        </div>

        {{/if}}
    </div>
{{/if}}