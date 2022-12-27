class Cart {
    constructor(elem) {
        this.cartElem = $(elem);
        this.cartNote = this.cartElem.find('.js-presciption-note');

        this.getCart = $.getJSON('/cart.js')
            .then(cart => {
                console.log(cart);
                this.showPrescriptionNote(cart)
            })

        if (document.querySelector('.cart-form')) {
            document.querySelector('.cart-form').addEventListener('submit', () => {
                let textareas = document.querySelectorAll('.cart-note__input');

                if (textareas.length > 1) {
                  textareas.forEach((el) => {
                    let elText = el.value;

                    if (elText) {
                      textareas.forEach((element) => {
                        element.value = elText;
                      });
                    }
                  })
                }
            })
        }
    }

    showPrescriptionNote(cart) {
    	let flag = false;
        console.log(cart.items.forEach(i => {
            console.log(!!i.properties && i.properties['_type'])

			if (i.product_title.includes('Ski')) {
				flag = true;
			}
        }))

		console.log('flag', flag);

        const showPrescriptionNote = !!cart.items
            .find(item => !!item.properties && item.properties['_type'] === 'prescription'
                && !item.properties['upload'] || !!flag
            );
        console.log(!!cart.items);
        console.log(cart.items);
        console.log('showPrescriptionNote', showPrescriptionNote)
        if (showPrescriptionNote) {
            this.cartNote.removeClass('d-none');
        }
    }
}

const cartInit = {
    init(elem) {
        if ($(elem).length > 0) {
            window.cart = new Cart(elem);
        }
    }
};

export default cartInit;
