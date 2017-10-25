{{!
	© 2017 LN Curtis
}}

{{#if isOneValue}}
	<div class="product-views-option-dropdown product-views-option-dropdown-one-option print-hide" data-id="{{itemOptionId}}" data-type="option" data-cart-option-id="{{cartOptionId}}">
		<p class="product-views-option-tile-title ">
			<strong>{{label}}</strong>:
			{{#if showSelectedValue}}
				<span > {{selectedValue.label}}</span>
				<input type="hidden" name="{{cartOptionId}}" data-value="{{cartOptionId}}">
			{{/if}}
		</p>
	</div>
{{else}}

	<div data-validation="control-group">
		<div data-validation="control">
			<div id="{{cartOptionId}}-container" class="product-views-option-dropdown product-views-option-tile-title-with-control print-hide" data-type="option" data-cart-option-id="{{cartOptionId}}" data-item-option-id="{{itemOptionId}}">
				<div class="{{cartOptionId}}-controls-group">
					{{#if showLabel}}
						<label class="product-views-option-dropdown-label" for="{{cartOptionId}}">
							{{label}}
							{{#if showRequiredLabel}}<span class="product-views-option-dropdown-label-required">*</span>{{/if}}
							{{#if showSelectedValue}}
								: <span data-value="{{cartOptionId}}" class="product-views-selected-option">{{selectedValue.label}}</span>
							{{/if}}

							{{#if showTooltip}}<i class="product-views-option-icon-question-sign" data-toggle="tooltip" title="" data-original-title="{{tooltip}}"></i>{{/if}}
						</label>
					{{/if}}
					<div class="{{cartOptionId}}-controls product-views-option-dropdown-control">
						<select name="{{cartOptionId}}" id="{{cartOptionId}}" class="product-views-option-dropdown-select" data-toggle="select-option">
							<option value="">{{translate '- Select -'}}</option>
							{{#each values}}
								{{#if internalId}}
									<option data-stickit-bind-val="{{internalId}}"
											value="{{internalId}}"
											data-label="{{../../cartOptionId}}"
											{{#if isActive}}selected{{/if}}
											data-active="{{isActive}}"
											data-available="{{isAvailable}}"
											{{#unless isAvailable}}disabled{{/unless}}>
										{{label}}
									</option>
								{{/if}}
							{{/each}}
						</select>
					</div>
				</div>
			</div>
		</div>
	</div>
{{/if}}

{{#if showSelectedOption}}
	<p class="print-only container-fluid"><strong>{{label}}:</strong> {{selectedOption.label}}</p>
{{else}}
	<p class="print-only container-fluid">
		<strong>{{label}}s</strong>
	</p>
	<div class="print-only print-available-options container-fluid">
		{{#each values}}<span>{{label}}</span> {{/each}}
	</div>
{{/if}}

{{!----
The context variables for this template are not currently documented. Use the {{log this}} helper to view the context variables in the Console of your browser's developer tools.

----}}
