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
		this.customSelect();
		this.initProductQuantityActions();
		// ajaxCart.init();
	}

	init() {
		this.initPdpReviewsSlider();
	}

	// JS FOR PDP Additional Products Slider END

	// JS FOR PDP Reviews Slider START
	customSelect() {
		let selectHeader = document.querySelectorAll('.select__header');
		let selectItem = document.querySelectorAll('.select__item');

		selectHeader.forEach(item =>  {
			item.addEventListener('click', selectToggle)
		});

		selectItem.forEach(item =>  {
			item.addEventListener('click', selectChoose)
		});

		function selectToggle() {
			this.parentElement.classList.toggle('select--is-active');
		}

		function selectChoose() {
			let text = this.innerText;
			let select = this.closest('.select');
			let currentText = select.querySelector('.select__current');

			currentText.innerText = text;
			select.classList.remove('select--is-active');
		}

		window.addEventListener('click', (e) => {
			for (const select of document.querySelectorAll('.select')) {
				if (!select.contains(e.target)) {
					select.classList.remove('select--is-active');
				}
			}
		});
	}

	getResourses = async (url) => {
		let res = await fetch(url);

		if(!res.ok) {
			throw new Error(`${res.status}`)
		}

		return await res.json()
	}

	updateAjaxCartData() {
		const cartHeaderQty = document.querySelector('.header__basket--counter');
		const subtotalPriceDiv = document.querySelector('.cart__subtotal-count');
		const cartData = this.getResourses('/cart.js')

		cartData.then(cart => {
			const quantityWrappers = document.querySelectorAll('.cart__product-actions');
			const subtotalPrice = cart.total_price / 100;

			quantityWrappers.forEach(quantityWrapper => {
				const variantId = quantityWrapper.getAttribute('data-variant-id');
				const currVariant = cart.items.find(item => item.id === +variantId);
				const cartQty = quantityWrapper.querySelector('[data-cart-qty]');
				const cartTotal = quantityWrapper.querySelector('[data-item-total]');
				const itemTotalPrice = (currVariant.price * currVariant.quantity / 100);

				cartQty.innerText = currVariant.quantity;
				cartTotal.innerText = itemTotalPrice.toLocaleString().replace(',', ' ') + ` грн`;
			});

			subtotalPriceDiv.innerText = subtotalPrice.toLocaleString().replace(',', ' ') + ` грн`;
			cartHeaderQty.innerText = cart.item_count;
		});
	}

	updateCartItemAjax(id, qty) {
		let $this = this;
		$.ajax({
			type: "POST",
			url: '/cart/update.js',
			data: {
				updates: {
					[`${id}`]: qty
				}
			},
			dataType: 'json',
			async: false,
			success: function (cart) {
				$this.updateAjaxCartData();
			},
			error: function (jqXhr, textStatus, errorMessage) {
				console.log('Error: ' + errorMessage);
			}
		});
	}

	initProductQuantityActions() {
		const quantityWrappers = document.querySelectorAll('.cart__product-actions');

		quantityWrappers.forEach(quantityWrapper => {
			const quantityButtons = quantityWrapper.querySelectorAll('.cart__product-quantity-button');
			const maxQuantity = quantityWrapper.getAttribute('data-max-quantity');
			const variantId = quantityWrapper.getAttribute('data-variant-id');

			quantityButtons.forEach(button => {
				button.addEventListener('click', () => {
					let cartData = this.getResourses('/cart.js');
					cartData.then(res => {
						const btnValue = button.getAttribute('data-value');
						const currItem = res.items.find(item => item.id === +variantId);
						const newQuantity = currItem.quantity + +btnValue;

						if (+newQuantity > 0 && +newQuantity <= maxQuantity) {
							this.updateCartItemAjax(variantId, newQuantity)
						}
					});
				})
			})
		})
	}

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
