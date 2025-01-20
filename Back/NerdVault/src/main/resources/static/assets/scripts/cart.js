console.log(`
    -------------------------------- CART JAVASCRIPT --------------------------------
    `)

let page = window.location.pathname.split("/");
page = page[page.length - 1];

const isIndex = page === 'index.html' || page === '';
console.log('sei sulla pagina: ', page);    //del
console.log('sei sulla home? ', isIndex);   //del

// Selezione degli elementi principali
const cartBody = document.getElementById('cart-body');
const cartBtn = document.getElementById('cart-btn');

// Aggiungi l'evento click al pulsante del carrello
cartBtn.addEventListener('click', loadCart);

function loadCart() {
    // Svuota il contenuto corrente del carrello
    cartBody.innerHTML = '';

    // Recupera i dati dal localStorage
    let carrelloStorage = JSON.parse(localStorage.getItem('carrello')) || [];

    console.log('Carrello in LocalStorage: ', carrelloStorage);

    // Genera gli elementi del carrello
    carrelloStorage.forEach(prodotto => {
        // Crea il contenitore del prodotto
        let prodottoCart = document.createElement('div');
        prodottoCart.classList.add('container-fluid', 'prodotto-carrello');
        prodottoCart.setAttribute('data-nome-prodotto', prodotto.nome); // Aggiungi un attributo personalizzato per identificare il prodotto

        // Aggiungi il contenuto HTML del prodotto
        prodottoCart.innerHTML = `
        <div class="row mb-4 d-flex justify-content-between align-items-center">
            <div class="col-md-3">
                <img src="${prodotto.img}" class="img-fluid rounded-3 w-full" alt="${prodotto.nome}">
            </div>
            <div class="col-6 col-md-3 mt-3 mt-md-0">
                <h6 class="mb-0 prodotto-nome">${prodotto.nome}</h6>
            </div>
            <div class="col-6 col-md-3 d-flex mt-3 mt-md-0">
                <button class="btn btn-link px-2" onclick="this.parentNode.querySelector('input[type=number]').stepDown()">
                    <i class="fas fa-minus"></i>
                </button>
                <input min="0" name="quantity" value="${prodotto.quanti}" type="number"
                    class="form-control form-control-sm quantity-form">
                <button class="btn btn-link px-2" onclick="this.parentNode.querySelector('input[type=number]').stepUp()">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div class="col-6 col-md-2 mt-3 mt-md-0">
                <h6 class="mb-0">€${prodotto.prezzo}</h6>
            </div>
            <div class="col-6 col-md-1 text-end mt-3 mt-md-0 pe-4 pe-md-1">
                <i class="fas fa-trash delete-product"></i>
            </div>
        </div>
        `;

        // Aggiungi il prodotto al carrello nel DOM
        cartBody.prepend(prodottoCart);
    });

    // Aggiungi il pulsante di conferma alla fine
    cartBody.innerHTML += `
    <div class="modal-footer">
        <button type="submit" class="btn btn-primary" id="ordineBtn">Concludi ordine</button>
    </div>
    `;




    const ordineBtn = document.getElementById('ordineBtn');

    ordineBtn.addEventListener('click', function () {
    // Chiedi conferma all'utente se vuole confermare l'ordine
    const confermaOrdine = confirm("Sei sicuro di voler confermare l'ordine?");

    if (confermaOrdine) {
        // L'utente ha confermato l'ordine, reindirizza alla pagina di pagamento
        window.location.href = './payment.html'; // Reindirizza alla pagina di pagamento
    } else {
        // L'utente ha annullato l'ordine
        console.log("Ordine non confermato.");
    }
});

    
    
    
    













    // Gestione degli eventi di eliminazione prodotto
    cartBody.addEventListener('click', function (e) {
        e.preventDefault();

        // Verifica se è stato cliccato il cestino
        if (e.target.classList.contains('delete-product')) {
            console.log('CANCELLA PRODOTTO');
            
            // Trova il contenitore del prodotto
            const prodottoElement = e.target.closest('.prodotto-carrello');
            const nomeProdotto = prodottoElement.getAttribute('data-nome-prodotto'); // Recupera il nome del prodotto

            // Recupera il carrello dal localStorage
            let carrelloStorage = JSON.parse(localStorage.getItem('carrello')) || [];

            // Rimuovi il prodotto dal carrello
            carrelloStorage = carrelloStorage.filter(prodotto => prodotto.nome !== nomeProdotto);

            // Aggiorna il localStorage
            localStorage.setItem('carrello', JSON.stringify(carrelloStorage));

            // Rimuovi il prodotto dal DOM
            prodottoElement.remove();
        }
    });
}


// document.querySelectorAll('.quantityForm');

