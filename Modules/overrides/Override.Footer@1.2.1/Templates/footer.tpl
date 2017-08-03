{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div data-view="Global.BackToTop"></div>
<div class="footer-content">
	<div class="container">
		<div id="banner-footer" class="content-banner banner-footer" data-cms-area="global_banner_footer" data-cms-area-filters="global"></div>
		<div class="row">
			<div class="footer-content-left">
				<!--<div class="footer-logo">
					<img src="{{footerLogo}}" alt="LN Curtis Logo" />
				</div>-->
				<div class="row">
					<div class="col-xs-12 col-md-12">
						<h3>Headquarters Address</h3>

						<div itemscope itemtype="https://schema.org/Corporation">
							<address itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
								{{{companyAddress}}}
							</address>
						</div>

						<div class="footer-phone">
							<a hre="tel:{{phoneTollFree}}" target="_blank">{{phoneTollFree}}</a> (Toll Free)
						</div>
						<div class="footer-other-locations">
							<a href="{{viewOtherLocationsLink}}" data-touchpoint="home">{{viewOtherLocationsText}}</a>
						</div>
					</div>
					<div class=" col-xs-12 col-md-12">
						<div data-view="FamilyOfBrands" class="family-of-brands"></div>
					</div>
				</div>
			</div>
			<div class="footer-content-nav">
				{{#if showFooterNavigationLinks}}
					<div data-view="Footer.Navigation" class="footer-navigation-links"></div>
				{{/if}}
			</div>
			<div class="footer-content-right">
				<!--<div data-view="FooterContent"></div>-->
				<div data-view="Footer.Seals"></div>
				<div class="footer-social">
					<h3>Connect</h3>
					<a href="#newsletter" data-toggle="show-in-modal" class="newsletter-modal-trigger"><i class="fa fa-envelope"></i> {{subscribeButtonText}}</a>
					<div data-view="Footer.Social" ></div>
				</div>
			</div>
		</div>
		<div class="footer-content-copyright">
			&copy {{date}} {{copyrightText}}
		</div>
	</div>
</div>