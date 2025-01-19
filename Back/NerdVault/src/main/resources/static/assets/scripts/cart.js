console.log(`
    -------------------------------- CART JAVASCRIPT --------------------------------
    `)

let page = window.location.pathname.split("/");
page = page[page.length - 1];

const isIndex = page === 'index.html' || page === '';
console.log('sei sulla pagina: ', page);    //del
console.log('sei sulla home? ', isIndex);   //del

const cart = document.getElementById('cart-body');
const cartBtn = document.getElementById('cart-btn');

cartBtn.addEventListener('click', loadCart);

function loadCart() {
    console.log('cart: ', cart);

    let carrelloStorage = JSON.parse(localStorage.getItem('carrello'));
    console.log('Carrello in LocalStorage: ', carrelloStorage);

    carrelloStorage.forEach(prodotto => {
        let prodottoCart = document.createElement('div');
        prodottoCart.classList.add('container-fluid');
        prodottoCart.innerHTML = `
        <!-- PRODOTTO MODALE -->
          <div class="row mb-4 d-flex justify-content-between align-items-center">
              <div class="col-md-3">
                  <img
                  src="${prodotto.img}"
                  class="img-fluid rounded-3 w-full">
              </div>
              <div class="col-6 col-md-3 mt-3 mt-md-0">
                  <h6 class="text-secondary prodottoCategoria">categoria</h6>
                  <h6 class="mb-0 prodottoNome">${prodotto.nome}</h6>
              </div>
              <div class="col-6 col-md-3 d-flex mt-3 mt-md-0">
                  <button class="btn btn-link px-2"
                  onclick="this.parentNode.querySelector('input[type=number]').stepDown()">
                  <i class="fas fa-minus"></i>
                  </button>
                  <input min="0" name="quantity" value="${prodotto.quanti}" type="number"
                    class="form-control form-control-sm quantityForm">
                  <button class="btn btn-link px-2"
                    onclick="this.parentNode.querySelector('input[type=number]').stepUp()">
                      <i class="fas fa-plus"></i>
                  </button>
              </div>
              <div class="col-6 col-md-2 mt-3 mt-md-0">
                  <h6 class="mb-0">€${prodotto.prezzo}</h6>
              </div>
              <div class="col-6 col-md-1 text-end mt-3 mt-md-0 pe-4 pe-md-1">
                  <i class="fas fa-trash"></i>
              </div>
          </div>
        <!-- FINE PRODOTTO MODALE -->
        `;

        cart.prepend(prodottoCart);
    });

    cart.addEventListener('click', e => {
        e.preventDefault();

        if (e.target.tagName === 'I' && e.target.classList.contains('fa-trash')) {
            // Implementare logica di eliminazione prodotto da array cart in localStorage
            
            
            console.log('CANCELLA PRODOTTO');
            e.target.parentElement.parentElement.remove();
        }

        console.log('TAG: ', e.target.tagName);
        
    })
}

document.querySelectorAll('.quantityForm');