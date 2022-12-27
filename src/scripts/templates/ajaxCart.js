class AjaxCart {
	constructor() {
		this.init();
	}

	init() {
		let $this = this;
		let button = document.querySelector('.hero__btn');

		if (button) {
			button.addEventListener('click', function (e) {
				e.preventDefault();

				let a = '31353934839889';

				$this.addCartItemAjax(a, 1);
				$this.renderAjaxCartItems();
			});
		}

		this.addToCartPdp();
		this.addToCartInCollection();
		this.addCartOpenerListener();
		this.addChangeProductsQtyListeners();
		this.checkIfCartEmpty();
		this.addRemoveListeners();
	}

	updateAjaxCartData() {
		let cartQty = document.querySelector('[data-ajax-cart-qty]');
		let cartHeaderQty = document.querySelector('.cart-count');
		let cartTotal = document.querySelector('[data-ajax-cart-total]');
		let cartData = this.getCartItemsAjax();

		cartData.done(function (cart) {
			console.log(cart);

			cartQty.innerText = cart.item_count;
			cartHeaderQty.innerText = cart.item_count;
			cartTotal.innerText = '$' + (cart.total_price / 100);
		});
	}

	checkIfCartEmpty() {
		let cartItemsWrapper = document.querySelector('#cart-drawer .cart__inner');

		let cartData = this.getCartItemsAjax();

		cartData.done(function (cart) {
			if (cart.item_count > 0) {
				if (cartItemsWrapper.classList.contains('empty')) {
					cartItemsWrapper.classList.remove('empty');
				}
			} else {
				cartItemsWrapper.classList.add('empty');
			}
		});
	}

	// LISTENERS -------------------
	addToCartPdp() {
		let $this = this;
		let allAtcItems = document.querySelectorAll('[data-add-to-cart]');

		if (allAtcItems) {
			allAtcItems.forEach((el) => {
				el.addEventListener('click', (e) => {
					e.preventDefault();

					let qty = e.target.closest('.product__form').querySelector('[data-cart-item-qty]').value;
					let id = e.target.dataset.id;

					console.log('ATC Event', qty, id);

					$this.addCartItemAjax(id, qty);
					$this.renderAjaxCartItems();
				});
			});

		}
	}

	addToCartInCollection() {
		let $this = this;
		let allAtcItems = document.querySelectorAll('[data-add-to-cart-collection]');

		if (allAtcItems) {
			allAtcItems.forEach((el) => {
				el.addEventListener('click', (e) => {
					e.preventDefault();

					$this.addCartItemAjax(e.target.dataset.id, 1);
					$this.renderAjaxCartItems();
				});
			});

		}
	}

	addCartOpenerListener() {
		let cartOpener = document.querySelector('#open-cart');
		let $this = this;

		cartOpener.addEventListener('click', function () {
			$this.updateAjaxCartData();
		});
	}

	addChangeProductsQtyListeners() {
		let items = document.querySelectorAll('.cart__items .cart__item');
		let $this = this;

		items.forEach((el) => {
			let oldValue = el.querySelector('[data-cart-item-qty]').value;

			el.querySelector('[data-cart-item-qty]').addEventListener('change', (e) => {
				let id = e.target.dataset.id;
				let qty = e.target.value;

				$this.updateCartItemAjax(id, qty);
			});
		});
	}

	addRemoveListeners() {
		let allItemsInCart = document.querySelectorAll('.cart__item');
		let $this = this;

		allItemsInCart.forEach((el) => {
			el.querySelector('.cart__product-remove').addEventListener('click', (e) => {
				e.preventDefault();
				let id = e.target.closest('.cart__product-remove').dataset.id;
				let itemsWrapperLength = document.querySelectorAll('.cart__items .cart__item').length;

				$this.removeCartItemAjax(id, el);

				setTimeout(() => {
					if (itemsWrapperLength == 1) {
						$this.checkIfCartEmpty();
					}

					$this.updateAjaxCartData();
				}, 2000)
			});
		});
	}

	// RENDERS ---------------------
	renderAjaxCartItems() {
		let $this = this;
		let cartData = this.getCartItemsAjax();

		cartData.done(function (cart) {
			let itemsHtml = '';
			let itemsWrapperHtml = document.querySelector('.cart__inner .cart__items');
			let cartOpener = document.querySelector('#open-cart');

			cart.items.forEach((el, index) => {
				itemsHtml += $this.renderCart(el, index);
			});

			itemsWrapperHtml.innerHTML = '';
			$this.checkIfCartEmpty();
			cartOpener.click();

			setTimeout(() => {
				itemsWrapperHtml.innerHTML = itemsHtml;
				$this.addRemoveListeners();
				$this.addChangeProductsQtyListeners();
			}, 600);
		});
	}

	renderCart(cartObject, index) {
		let qtyHtml = '';
		let comparePrice = '';

		qtyHtml += `
			<option value="${cartObject.quantity}" >${cartObject.quantity}</option>
		`;

		for (let i = 1; i < 25; i++) {
			if (i == cartObject.quantity) {
				qtyHtml += `
					<option value="${i}" selected>${i}</option>
				`;
			} else {
				qtyHtml += `
					<option value="${i}">${i}</option>
				`;
			}
		}

		if (cartObject.price != cartObject.discounted_price) {
			comparePrice += `
				<div class="old">$${(cartObject.discounted_price) / 100}</div>
			`;
		}

		//<div class="new">$${(cartObject.price * cartObject.quantity) / 100}</div>

		let itemHtml = `<div class="cart__item animate__animated animate__fadeInLeft animate__delay-${index + 1}s"
			  data-id="${cartObject.id}">
			 <div class="product__img">
			  <a href="" class="product__img-link">
			   <img src="${cartObject.image}"
				 alt="product image">
			  </a>
			 </div>
			 <div class="product__info">
			  <a href="" class="product__title-link">
			   <div class="product__title">${cartObject.title}</div>
			  </a>
			  <div class="product__counter">
			   <select class="product__counter-select"
				 data-cart-item-qty data-id="${cartObject.id}">
				 ${qtyHtml}
			   </select>
			  </div>
			 </div>
			 <div class="product__price">
			  
			  <div class="new">$${cartObject.price / 100}</div>
			 </div>
			 <button class="cart__product-remove"
			   data-id="${cartObject.id}">
			  <svg width="18" height="13" viewBox="0 0 18 13"
				fill="none" xmlns="http://www.w3.org/2000/svg">
			   <path
				d="M14.8736 0.87459L4.26701 11.4812M14.8736 11.4812L4.26701 0.874589"
				stroke="#0F0F0F" stroke-width="2"/>
			  </svg>
			 </button>
			</div>`;

		return itemHtml;
	}

	// AJAX REQUESTS ---------------
	getCartItemsAjax() {
		return $.ajax({
			type: 'GET',
			url: '/cart.js',
			dataType: 'json',
			async: false
		});
	}

	clearCartItemsAjax() {
		$.ajax({
			type: "POST",
			url: '/cart/clear.js',
			data: '',
			dataType: 'json',
			success: function () {}
		});
	}

	removeCartItemAjax(id, el) {
		$.ajax({
			type: "POST",
			url: '/cart/update.js',
			data: {
				updates: {
					[`${id}`]: 0
				}
			},
			dataType: 'json',
			success: function () {
				el.classList.add('animate__fadeOutLeft');
				el.addEventListener('animationend', () => {
					el.remove();
				});
			}
		});
	}

	addCartItemAjax(id, qty) {
		$.ajax({
			type: "POST",
			url: '/cart/add.js',
			async: false,
			data: {
				items: [
					{
						id: id,
						quantity: qty
					}
				]
			},
			dataType: 'json',
			success: function () {

			}
		});
	}

	updateCartItemAjax(id, qty) {
		let $this = this;
		$.ajax({
			type: "POST",
			url: '/cart/update.js',
			async: false,
			data: {
				updates: {
					[`${id}`]: qty
				}
			},
			dataType: 'json',
			success: function (cart) {
				$this.updateAjaxCartData();
			},
			error: function (jqXhr, textStatus, errorMessage) {
				console.log('Error: ' + errorMessage);
			}
		});
	}
}

const ajaxCartInit = {
	init() {
		window.ajaxCartClass = new AjaxCart();
	}
};

export default ajaxCartInit;
