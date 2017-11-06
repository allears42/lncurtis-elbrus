
<div class="container">
    <div class="row">
        <div class="col-lg-9 col-sm-8 col-xs-12 pull-right">
            <section class="customer-service-form-container">

				<div data-cms-area="customer-service-above" data-cms-area-filters="path"></div>


                <div class="std-alert-placeholder" data-type="alert-placeholder"></div>
                <small class="std-required">
                    {{translate 'Required'}}<span class="std-form-required">*</span>
                </small>

                <form action="#" class="std-form customer-service-form" data-action="gtm-track-header-email" novalidate>

					<div class="row">
						<div class="std-form-controls-group col-md-6" data-validation="control-group">
							<label class="std-form-label" for="firstname">
								{{translate 'First Name <small class="std-form-required">*</small>'}}
							</label>
							<div class="std-form-controls" data-validation="control">
								<input data-action="text" autofocus type="text" name="firstname" id="firstname" class="std-form-input" value="" maxlength="300"/>
							</div>
						</div>

                    	<div class="std-form-controls-group  col-md-6" data-validation="control-group">
                        <label class="std-form-label" for="lastname">
                            {{translate 'Last Name <small class="std-form-required">*</small>'}}
                        </label>
                        <div class="std-form-controls" data-validation="control">
                            <input data-action="text" type="text" name="lastname" id="lastname" class="std-form-input" value="" maxlength="300"/>
                        </div>
                    </div>
					</div>
                    <div class="std-form-controls-group" data-validation="control-group">
                        <label for="email" class="std-form-label">
                            {{translate 'Email <small class="std-form-required">*</small>'}}
                        </label>
                        <div class="std-form-controls" data-validation="control">
                            <input type="email" name="email" id="email" placeholder="{{translate 'yourname@company.com'}}" data-case-email class="std-form-input" value="" maxlength="300"/>
                        </div>
                    </div>

                    <div class="std-form-controls-group" data-validation="control-group">
                        <label class="std-form-label" for="issue">
                            {{translate 'Message Subject <small class="std-form-required">*</small>'}}
                        </label>

                        <div class="std-form-controls" data-validation="control">
                            <select name="issue" id="issue" class="std-form-select">
                                <option value="0">-- Select Subject --</option>
                                <option value="1">Billing Support</option>
                                <option value="2">Shipping/Delivery Support</option>
                                <option value="4">Product Issue</option>
                                <option value="9">General Inquiry</option>
                                <option value="10">Other Support</option>
                            </select>
                        </div>
                    </div>

                    <div class="std-form-controls-group" data-validation="control-group">
                        <label class="std-form-label" for="custentity_title">
                            {{translate 'Message Title <small class="std-form-required">*</small>'}}
                        </label>
                        <div class="std-form-controls" data-validation="control">
                            <input data-action="text" type="text" name="custentity_title" id="custentity_title" class="std-form-input" value="" maxlength="300"/>
                        </div>
                    </div>

                    <div class="std-form-controls-group" data-validation="control-group">
                        <label  class="std-form-label" for="message">
                            {{translate 'Message <small class="std-form-required">*</small>'}}
                        </label>
                        <div class="std-form-controls" data-validation="control">
                            <textarea name="comments" id="comments" class="std-form-textarea std-form-input"></textarea>
                        </div>
                    </div>

                    <div class="std-form-controls-group">
                        <button type="submit" class="std-button-submit">{{translate 'Submit'}}</button>
                    </div>
                </form>

				<div data-cms-area="customer-service-below" data-cms-area-filters="path"></div>
            </section>

            <section class="customer-service-thanks-container">
                <p>{{confirmationText}}</p>
            </section>
        </div>

		<div class="cms-page-divider"></div>
		<div class="col-lg-3 col-sm-4 col-xs-12">
			<div class="" data-view="SideNavigation"></div>
		</div>
    </div>
</div>
