import $ from 'jquery';
import {load} from '@shopify/theme-sections';
// import cart from 'Scripts/cart';
import ajaxCart from 'Scripts/ajaxCart';
import Swiper from 'swiper';
import 'picturefill';
import 'Scripts/jquery.plugins.js';

class App {
	constructor() {
		this.init();

		// ajaxCart.init();
	}

	init() {
		this.initPdpReviewsSlider();
	}

	// JS FOR PDP Additional Products Slider END

	// JS FOR PDP Reviews Slider START

	initPdpReviewsSlider() {
		document.addEventListener('DOMContentLoaded', function() {
			var pdpReviewSlider = new Swiper(".pdp-reviews-slider", {
				breakpoints: {
					320: {
						slidesPerView: 1.3,
						slidesPerGroup: 1,
						spaceBetween: 24,
						centeredSlides: true,
					},
					769: {
						spaceBetween: 24,
						slidesPerGroup: 1,
						slidesPerView: 'auto',
						centeredSlides: false,
						autoplay: {
							delay: 7000,
							disableOnInteraction: false,
							reverseDirection: true,
						},
					}
				},
				speed: 300,
				loop: true,
				slideToClickedSlide: true,
				pagination: {
					el: ".swiper-pag",
					clickable: true,
				},
			});
		});
	}

	// JS FOR PDP Reviews Slider END
}

const app = new App();
window.app = app;
