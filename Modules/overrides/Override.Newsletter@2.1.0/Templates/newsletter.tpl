
<div class="container-fluid">
	<div class="row">
		<div class="newsletter-modal-intro">
			<div class="newsletter-cms-intro" data-cms-area="newsletter_intro" data-cms-area-filters="path"></div>
			<p>{{{additionalText}}}</p>
			<div class="newsletter-cms-intro" data-cms-area="newsletter_intro_after" data-cms-area-filters="path"></div>
		</div>
		<form class="newsletter-suscription-form col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-xs-12 col-lg-6 col-lg-offset-3" data-action="newsletter-subscribe" novalidate>
			<div data-validation="control-group">
				<div class="newsletter-subscription-form-container {{#if showErrorMessage}}error{{/if}}" data-validation="control">
					<div class="row">
						<div class="col-sm-6">
							<label class="std-form-label" for="firstname">
								{{translate 'First Name '}}
							</label>
							<input name="firstName" id="firstName" type="text" class="newsletter-suscription-form-input newsletter-suscription-form-input-name"
									placeholder="{{translate 'first name'}}" />
						</div>
						<div class="col-sm-6">
							<label class="std-form-label" for="lastname">
								{{translate 'Last Name '}}
							</label>
							<input name="lastName" id="lastName" type="text" class="newsletter-suscription-form-input newsletter-suscription-form-input-name"
									placeholder="{{translate 'last name'}}"  />
						</div>

					</div>
					<div class="row">
						<div class="col-sm-12">
							<label for="email" class="std-form-label">
								{{translate 'Email <small class="std-form-required">*</small>'}}
							</label>
							<input name="email" id="email" type="email" class="newsletter-suscription-form-input" placeholder="{{translate 'username@domain.com'}}" />
						</div>
					</div>
					<div class="row">
						<div class="col-sm-4">
							<label for="zipcode" class="std-form-label">
								{{translate 'Zipcode'}}
							</label>
							<input name="zipcode" id="zipcode" class="newsletter-suscription-form-input" placeholder="{{translate 'zipcode'}}" />
						</div>
					</div>
					<div class="row">
						<div class="col-sm-12">
							<button type="submit" class="newsletter-subscription-form-button-subscribe">
								{{translate 'Subscribe'}}
							</button>
						</div>
					</div>
					<input name="custentity_customer_class" id="custentity_customer_class" type="hidden" value="1" />
					<input name="salesrep" id="salesrep" type="hidden" value="53161"  />
					<input name="category" id="category" type="hidden" value="8"  />
					<input name="custentity_targetmarket" id="custentity_targetmarket" type="hidden" value="1"  />
					<input name="custentity_salesregion" id="custentity_salesregion" type="hidden" value="1"  />
					<input name="custentity_department" id="custentity_department" type="hidden" value="36"  />
				</div>
			</div>
			<div id="newsletter_grecaptcha" class="newsletter-grecaptcha"></div>
			<br>
			<div class="newsletter-alert-placeholder" data-type="alert-placeholder">
				{{#if isFeedback}}
				<div data-view="GlobalMessageFeedback"></div>
				{{/if}}
			</div>
		</form>

		<div class="newsletter-cms-outro" data-cms-area="newsletter_outro" data-cms-area-filters="path"></div>
	</div>
</div>