console.log(`
    -------------------------------- CART JAVASCRIPT --------------------------------
`);

let page = window.location.pathname.split("/");
page = page[page.length - 1];

const isIndex = page === "index.html" || page === "";
console.log("sei sulla pagina: ", page); //del
console.log("sei sulla home? ", isIndex); //del

// Selezione degli elementi principali
const cartBody = document.getElementById("cart-body");
const cartBtn = document.getElementById("cart-btn");

// Aggiungi l'evento click al pulsante del carrello
cartBtn.addEventListener("click", loadCart);

function loadCart() {
  // Svuota il contenuto corrente del carrello
  cartBody.innerHTML = "";

  // Recupera i dati dal localStorage
  let carrelloStorage = JSON.parse(localStorage.getItem("carrello")) || [];

  console.log("Carrello in LocalStorage: ", carrelloStorage);

  if (carrelloStorage.length === 0) {
    // Se il carrello è vuoto, mostra il messaggio e non aggiungere il pulsante di conferma
    cartBody.innerHTML = `
      <div class="alert alert-warning" role="alert">
        Il tuo carrello è vuoto.
      </div>
    `;
  } else {
    // Genera gli elementi del carrello
    carrelloStorage.forEach((prodotto) => {
      // Crea il contenitore del prodotto
      let prodottoCart = document.createElement("div");
      prodottoCart.classList.add("container-fluid", "prodotto-carrello");
      prodottoCart.setAttribute("data-nome-prodotto", prodotto.nome); // Aggiungi un attributo personalizzato per identificare il prodotto

      // Aggiungi il contenuto HTML del prodotto
      prodottoCart.innerHTML = `
        <div class="row mb-4 d-flex justify-content-between align-items-center">
            <div class="col-md-3">
                <img src="${prodotto.img}" class="img-fluid rounded-3 w-full" alt="${prodotto.nome}">
            </div>
            <div class="col-6 col-md-3 mt-3 mt-md-0">
                <h6 class="mb-0 prodotto-nome">${prodotto.nome}</h6>
            </div>
            <div class="col-6 col-md-3 d-flex mt-3 mt-md-0 p-0">
                <button class="btn btn-link px-2 minus" data-id="${prodotto.productId}">
                    <i class="fas fa-minus"></i>
                </button>
                <input min="0" name="quantity" value="${prodotto.quanti}" type="number"
                    class="form-control form-control-sm quantity-form" data-id="${prodotto.productId}">
                <button class="btn btn-link px-2 plus" data-id="${prodotto.productId}">
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

    const ordineBtn = document.getElementById("ordineBtn");

    ordineBtn.addEventListener("click", function () {
      // Chiedi conferma all'utente se vuole confermare l'ordine
      const confermaOrdine = confirm(
        "Sei sicuro di voler confermare l'ordine?"
      );

      if (confermaOrdine) {
        // L'utente ha confermato l'ordine, reindirizza alla pagina di pagamento
        window.location.href = "./payment.html"; // Reindirizza alla pagina di pagamento
      } else {
        // L'utente ha annullato l'ordine
        console.log("Ordine non confermato.");
      }
    });
  }

  // Gestione degli eventi di eliminazione prodotto
  cartBody.addEventListener("click", function (e) {
    e.preventDefault();

    // Verifica se è stato cliccato il cestino
    if (e.target.classList.contains("delete-product")) {
      console.log("CANCELLA PRODOTTO");

      // Trova il contenitore del prodotto
      const prodottoElement = e.target.closest(".prodotto-carrello");
      const nomeProdotto = prodottoElement.getAttribute("data-nome-prodotto"); // Recupera il nome del prodotto

      // Recupera il carrello dal localStorage
      let carrelloStorage = JSON.parse(localStorage.getItem("carrello")) || [];

      // Rimuovi il prodotto dal carrello
      carrelloStorage = carrelloStorage.filter(
        (prodotto) => prodotto.nome !== nomeProdotto
      );

      // Aggiorna il localStorage
      localStorage.setItem("carrello", JSON.stringify(carrelloStorage));

      // Rimuovi il prodotto dal DOM
      prodottoElement.remove();

      // Se il carrello è vuoto, mostra il messaggio e non il pulsante "Concludi ordine"
      if (carrelloStorage.length === 0) {
        cartBody.innerHTML = `
          <div class="alert alert-warning" role="alert">
            Il tuo carrello è vuoto.
          </div>
        `;
      }
    }
  });

  // Gestione della modifica della quantità del prodotto
  cartBody.addEventListener("input", function (e) {
    // Verifica se è stato modificato il campo quantità
    if (e.target.classList.contains("quantity-form")) {
      const prodottoElement = e.target.closest(".prodotto-carrello");
      const nomeProdotto = prodottoElement.getAttribute("data-nome-prodotto");
      const nuovaQuantita = parseInt(e.target.value);

      // Recupera il carrello dal localStorage
      let carrelloStorage = JSON.parse(localStorage.getItem("carrello")) || [];

      // Trova il prodotto nel carrello e aggiorna la quantità
      carrelloStorage.forEach((prodotto) => {
        if (prodotto.nome === nomeProdotto) {
          prodotto.quanti = nuovaQuantita;
        }
      });

      // Aggiorna il localStorage con la nuova quantità
      localStorage.setItem("carrello", JSON.stringify(carrelloStorage));

      console.log("Carrello aggiornato in LocalStorage: ", carrelloStorage);
    }
  });

  // Gestione degli eventi di incremento e decremento della quantità tramite i bottoni plus e minus
  cartBody.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("fa-plus") ||
      e.target.classList.contains("fa-minus")
    ) {
      const prodottoElement = e.target.closest(".prodotto-carrello");
      const productId = prodottoElement
        .querySelector(".quantity-form")
        .getAttribute("data-id");
      const inputQuantity = prodottoElement.querySelector(".quantity-form");
      let newQuantity = parseInt(inputQuantity.value);

      // Incrementa o decrementa la quantità
      if (e.target.classList.contains("fa-plus")) {
        newQuantity++;
      } else if (e.target.classList.contains("fa-minus")) {
        newQuantity = Math.max(0, newQuantity - 1); // evitare quantità negative
      }

      // Aggiorna la quantità nel DOM solo se è cambiata
      if (newQuantity !== parseInt(inputQuantity.value)) {
        inputQuantity.value = newQuantity;
      }

      // Recupera il carrello dal localStorage
      let carrelloStorage = JSON.parse(localStorage.getItem("carrello")) || [];

      // Trova il prodotto nel carrello e aggiorna la quantità
      carrelloStorage.forEach((prodotto) => {
        if (prodotto.productId == productId) {
          prodotto.quanti = newQuantity;
        }
      });

      // Aggiorna il localStorage con la nuova quantità
      localStorage.setItem("carrello", JSON.stringify(carrelloStorage));

      console.log("Carrello aggiornato in LocalStorage: ", carrelloStorage);
    }
  });
}

// Funzione per aggiungere un prodotto al carrello (con somma della quantità)
function addToCart(prodotto) {
  let carrelloStorage = JSON.parse(localStorage.getItem("carrello")) || [];

  // Verifica se il prodotto è già presente nel carrello
  const prodottoEsistente = carrelloStorage.find(
    (item) => item.productId === prodotto.productId
  );

  if (prodottoEsistente) {
    // Se il prodotto esiste già, somma la quantità
    prodottoEsistente.quanti += prodotto.quanti;
  } else {
    // Altrimenti, aggiungi il nuovo prodotto
    carrelloStorage.push(prodotto);
  }

  // Aggiorna il localStorage con il carrello modificato
  localStorage.setItem("carrello", JSON.stringify(carrelloStorage));
}
