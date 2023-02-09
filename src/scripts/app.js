import $ from 'jquery';
import Swiper from 'swiper';
import 'picturefill';
import 'Scripts/jquery.plugins.js';

class App {
	constructor() {
		this.init();
		this.customSelect();
		this.initProductQuantityActions();
		this.initRemoveItemAction();
		this.initAddProductAction();
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
		const totalPriceDiv = document.querySelector('.ajax-cart__products-price--count');
		const subTotalPriceDiv = document.querySelector('.ajax-cart__total-price--count');
		const cartData = this.getResourses('/cart.js')
		const deliveryPrice = 60;

		cartData.then(cart => {
			const quantityWrappers = document.querySelectorAll('.ajax-cart__product');
			const subtotalPrice = cart.total_price / 100;

			cart.items.forEach(item => {
				const wrapper = Array.from(quantityWrappers).find(w => +w.getAttribute('data-variant-id') === item.id);
				if (wrapper) {
					const cartQty = wrapper.querySelector('[data-cart-qty]');
					cartQty.innerText = item.quantity;
				} else {
					if (quantityWrappers.length === 0) {
						this.showAjaxCartButtons();
						this.hideEmptyCartContent();
					}
					this.createCartProduct(item);
				}
			});

			totalPriceDiv.innerText = subtotalPrice.toLocaleString().replace(',', ' ') + ` грн`;
			subTotalPriceDiv.innerText = (subtotalPrice + deliveryPrice).toLocaleString().replace(',', ' ') + ` грн`;
			cartHeaderQty.innerText = cart.item_count;

			if (cart.items.length === 0) {
				this.hideAjaxCartButtons();
			}
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
			success: function () {
				$this.updateAjaxCartData();
			},
			error: function (jqXhr, textStatus, errorMessage) {
				console.log('Error: ' + errorMessage);
			}
		});
	}

	createCartProduct(productData) {
		const productsList = document.querySelector('.ajax-cart__products-list');
		const price = (productData.price / 100).toLocaleString().replace(',', ' ') ;

		const newProduct = `
			<li
				class="ajax-cart__product"
				data-max-quantity=10
				data-variant-id=${productData.id}
			>
				<div class="ajax-cart__product-logo">
					<img src=${productData.image} alt=${productData.image}>
				</div>
				<div class="ajax-cart__product-info">
					<div class="ajax-cart__product-title">${productData.product_title}</div>
					<div class="ajax-cart__product-size">Розмір: ${productData.variant_title}</div>
					<div class="ajax-cart__product-price">${price} грн</div>

					<div class="ajax-cart_product-quantity">
						<button class="ajax-cart__quantity-button" type="button" data-value="-1">-</button>
						<div data-cart-qty>${productData.quantity}</div>
						<button class="ajax-cart__quantity-button" type="button" data-value="+1">+</button>
					</div>
				</div>
				<div class="ajax-cart__product-delete" data-variant-id=${productData.id}>
					<svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" clip-rule="evenodd" d="M1.875 5.5C1.875 5.15482 2.15482 4.875 2.5 4.875H17.5C17.8452 4.875 18.125 5.15482 18.125 5.5C18.125 5.84518 17.8452 6.125 17.5 6.125H2.5C2.15482 6.125 1.875 5.84518 1.875 5.5Z" fill="#959595"></path>
							<path fill-rule="evenodd" clip-rule="evenodd" d="M8.33329 2.7915C8.05703 2.7915 7.79207 2.90125 7.59672 3.0966C7.40137 3.29195 7.29163 3.5569 7.29163 3.83317V4.87484H12.7083V3.83317C12.7083 3.5569 12.5985 3.29195 12.4032 3.0966C12.2078 2.90125 11.9429 2.7915 11.6666 2.7915H8.33329ZM13.9583 4.87484V3.83317C13.9583 3.22538 13.7169 2.64249 13.2871 2.21272C12.8573 1.78295 12.2744 1.5415 11.6666 1.5415H8.33329C7.72551 1.5415 7.14261 1.78295 6.71284 2.21272C6.28307 2.64249 6.04163 3.22538 6.04163 3.83317V4.87484H4.16663C3.82145 4.87484 3.54163 5.15466 3.54163 5.49984V17.1665C3.54163 17.7743 3.78307 18.3572 4.21284 18.787C4.64261 19.2167 5.2255 19.4582 5.83329 19.4582H14.1666C14.7744 19.4582 15.3573 19.2167 15.7871 18.787C16.2169 18.3572 16.4583 17.7743 16.4583 17.1665V5.49984C16.4583 5.15466 16.1785 4.87484 15.8333 4.87484H13.9583ZM4.79163 6.12484V17.1665C4.79163 17.4428 4.90137 17.7077 5.09672 17.9031C5.29207 18.0984 5.55703 18.2082 5.83329 18.2082H14.1666C14.4429 18.2082 14.7078 18.0984 14.9032 17.9031C15.0985 17.7077 15.2083 17.4428 15.2083 17.1665V6.12484H4.79163Z" fill="#959595"></path>
							<path fill-rule="evenodd" clip-rule="evenodd" d="M11.6666 9.0415C12.0118 9.0415 12.2916 9.32133 12.2916 9.6665V14.6665C12.2916 15.0117 12.0118 15.2915 11.6666 15.2915C11.3214 15.2915 11.0416 15.0117 11.0416 14.6665V9.6665C11.0416 9.32133 11.3214 9.0415 11.6666 9.0415Z" fill="#959595"></path>
							<path fill-rule="evenodd" clip-rule="evenodd" d="M8.33337 9.0415C8.67855 9.0415 8.95837 9.32133 8.95837 9.6665V14.6665C8.95837 15.0117 8.67855 15.2915 8.33337 15.2915C7.9882 15.2915 7.70837 15.0117 7.70837 14.6665V9.6665C7.70837 9.32133 7.9882 9.0415 8.33337 9.0415Z" fill="#959595"></path>
					</svg>
				</div>
			</li>
		`;
		productsList.innerHTML += newProduct;
		this.initRemoveItemAction();
		this.initProductQuantityActions();
	}

	showEmptyCartContent() {
		const content = document.querySelector('.ajax-cart__empty-cart');
		const productsList = document.querySelector('.ajax-cart__products-list');

		productsList.style.display = 'none';
		content.style.display = 'block';
	}

	hideEmptyCartContent() {
		const content = document.querySelector('.ajax-cart__empty-cart');
		const productsList = document.querySelector('.ajax-cart__products-list');

		productsList.style.display = 'block';
		content.style.display = 'none';
	}

	hideAjaxCartButtons() {
		const wrapper = document.querySelector('.ajax-cart__actions');
		wrapper.style.display = 'none';
		this.showEmptyCartContent();
	}

	showAjaxCartButtons() {
		const wrapper = document.querySelector('.ajax-cart__actions');
		wrapper.style.display = 'block';
	}

	initRemoveItemAction() {
		const deleteItemButtons = document.querySelectorAll('.ajax-cart__product-delete');

		deleteItemButtons.forEach(deleteItemButton => {
			deleteItemButton.addEventListener('click', () => {
				const itemWrapper = deleteItemButton.closest('.ajax-cart__product');
				const itemId = deleteItemButton.getAttribute('data-variant-id');

				this.removeCartItem(itemId)
					.then(() => {
						this.updateAjaxCartData();
						itemWrapper.remove();
					});
			});
		});
	}

	removeCartItem = async (id) => {
		const item = JSON.stringify({updates: {[`${id}`]: 0}});

		const res = await fetch('/cart/update.js', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: item,
		});

		return await res.json();
	}

	initAddProductAction() {
		const productForm = document.querySelector('#product-form');
		if (!productForm) return;
		const formErrorAlert = productForm.querySelector('.product__error-alert');

		productForm.onsubmit = (e) => {
			e.preventDefault();
			const productId = productForm.querySelector('.product__id');
			const productIdValue = productId.value;
			if (productIdValue === 'none') {
				formErrorAlert.style.display = 'flex';
				return;
			}

			const ajaxCartContainer = document.querySelector('.ajax-cart__container');
			const ajaxCart = document.querySelector('#ajax-cart');
			let cartData = this.getResourses('/cart.js');

			cartData.then(res => {
				const currItem = res.items.find(item => item.id === +productIdValue);
				const newQuantity = currItem ? currItem.quantity + 1 : 1;
 				this.updateCartItemAjax(productIdValue, newQuantity)
			});

			ajaxCart.style.opacity = '1';
			ajaxCart.style.visibility = 'visible';
			ajaxCartContainer.style.transform = 'translateX(0)';
			document.body.style.overflowY = 'hidden';
		};
	}

	initProductQuantityActions() {
		const quantityWrappers = document.querySelectorAll('.ajax-cart__product');

		quantityWrappers.forEach(quantityWrapper => {
			const quantityButtons = quantityWrapper.querySelectorAll('.ajax-cart__quantity-button');
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

						if (+newQuantity === 0) {
							this.removeCartItem(variantId)
								.then(() => {
									this.updateAjaxCartData();
									quantityWrapper.remove();
								});
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
