<div class="msa-form-container">
    <p class="title">{{title}}</p>
    <p class="description">{{desc}}</p>

    {{#if showForm}}
        <div class="image">
            <img src="{{imagePath}}" />
        </div>
        <form class="form">
            <div data-confirm-message></div>
            <div class="form-control">
                <div class="row">
                    <div data-validation="control-group" class="col-md-6">
                        <label for="firstname">First Name:</label>
                        <input type="text" name="firstname" id="firstname" placeholder="first name" maxlength="25">
                        <div data-validation="control" class="error-wrapper"></div>
                    </div>
                    <div data-validation="control-group" class="col-md-6">
                        <label for="lastname">Last Name:</label>
                        <input type="text" name="lastname" id="lastname" placeholder="last name" maxlength="35">
                        <div data-validation="control" class="error-wrapper"></div>
                    </div>
                </div>
                <div class="row">
                    <div data-validation="control-group" class="col-sm-12">
                        <label for="email">Email:<span class="input-required">*</span></label>
                        <input type="text" name="email" id="email" placeholder="username@domain.com" maxlength="45">
                        <div data-validation="control" class="error-wrapper"></div>
                    </div>
                </div>
                <div class="row">
                    <div data-validation="control-group" class="col-md-5">
                        <label for="zipcode">Zip Code:</label>
                        <input type="text" name="zipcode" id="zipcode" placeholder="zip code" maxlength="10">
                        <div data-validation="control" class="error-wrapper"></div>
                    </div>
                    <div class="col-md-7">
                        <button type="submit" class="submit-button">Contact Me</button>
                    </div>
                </div>
            </div>
        </form>
    {{else}}
        <p class="successMessage">{{successMessage}}</p>
    {{/if}}


</div>
