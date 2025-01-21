document.addEventListener("DOMContentLoaded", () => {
  function getProductId() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get("id"), 10);
  }

  const productId = getProductId();
  let productNome;
  let productPrezzo;
  let productUrl;

  const apiUrl = `http://localhost:8080/api/prodotto/${productId}`;

  fetch(apiUrl)
    .then((response) => {
      if (response.status === 404 || response.status === 400) {
        window.location.href = "./shop.html";
      }
      return response.json();
    })
    .then((product) => {
      if (!product) {
        document.getElementById("product-container").innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        Prodotto non trovato!
                    </div>`;
        return;
      }

      console.log(product);

      /*const productInfoContainer = document.getElementById("product-details-container");
            productInfoContainer.innerHTML = `
                <div class="card">
                    <img src="${product.immagine}" class="card-img-top" alt="${product.descrizione}">
                    <div class="card-body">
                        <h5 class="card-title">Categoria: ${product.categoria}</h5>
                        <p class="card-text">
                            Descrizione: ${product.descrizione || "N/A"}
                        </p>
                        ${product.rimanenza > 0
                            ? `<button class="btn btn-success">Prenota</button>` 
                            : `<span class="badge bg-danger">Non Disponibile</span>`}
                    </div>
                </div>`;
            */

      const productTitle = document.getElementById("product-title");
      const productPrice = document.getElementById("product-price");
      const productImg = document.getElementById("product-img");
      const productDesc = document.getElementById("product-description");
      const btnCarrello = document.getElementById("btn-carrello");
      const nonDisponibile = document.querySelector(".nonDisponibile");
      const pochiDisponibili = document.querySelector(".pochiDisponibili");

      productTitle.textContent = product.nome;
      if (product.categoria === 'PREVENDITA') {

        /* --------------------- crea prezzo originale sbarrato --------------------- */
        let priceWrapper = document.querySelector('.price-wrapper');
        
        let ogPrice = document.createElement('h5');
        ogPrice.classList.add('h6');
        ogPrice.classList.add('text-end');
        ogPrice.classList.add('me-3');
        ogPrice.classList.add('mb-0');
        ogPrice.classList.add('text-danger');
        ogPrice.style.textDecoration = 'line-through';
        ogPrice.textContent = `€${product.prezzo}`; 

        productPrice.classList.add('mt-0');
        productPrice.classList.remove('mt-3');

      //  priceWrapper.classList.add('d-flex justify-content-between align-items-end');

       priceWrapper.prepend(ogPrice);




        let prezzo = product.prezzo * ( 1 - product.scontoPrevendita/100);
        productPrice.textContent = `€${prezzo.toFixed(2)}`;
      } else {
        productPrice.textContent = `€${product.prezzo.toFixed(2)}`;
      }
      productImg.src = product.imgUrl;
      productDesc.innerHTML = product.descrizione || "N/A";

      //settiamo i valori all'esterno della fetch per logica di cart
      productNome = product.nome;
      productUrl = product.imgUrl;
      productPrezzo = (product.categoria === 'PREVENDITA') ? (product.prezzo * ( 1 - product.scontoPrevendita/100)).toFixed(2) : product.prezzo.toFixed(2);

      if (product.rimanenza == 0) {
        btnCarrello.classList.add("d-none");
        pochiDisponibili.classList.add("d-none");
        nonDisponibile.classList.remove("d-none");
        document.getElementById("product-quantity").classList.add("d-none");
      } else if (product.rimanenza <= 10) {
        pochiDisponibili.classList.remove("d-none");
        pochiDisponibili.textContent += product.rimanenza;
      }
    });
  /*.catch(error => {
            console.error("Errore durante il recupero dei dati del prodotto:", error);
            document.getElementById("product-container").innerHTML = `
                <div class="alert alert-danger" role="alert">
                    Impossibile caricare i dettagli del prodotto!
                </div>`;
        });*/

        const addToCart = document.getElementById("btn-carrello");

        addToCart.addEventListener("click", (e) => {
          e.preventDefault();
      
          const prodottoDaInserire = {
            productId,
            nome: productNome,
            img: productUrl,
            prezzo: productPrezzo,
            quanti: parseInt(document.getElementById("product-quantity").value) || 1,
          };
      
          const carrello = JSON.parse(localStorage.getItem("carrello")) || [];
      
          // controllo che il prodotto non esista già in array
          let isInCarrello = false;
      
          carrello.forEach((prodotto) => {
            if (prodotto.productId === prodottoDaInserire.productId) {
              isInCarrello = true;
              prodotto.quanti = parseInt(prodotto.quanti);
              prodotto.quanti += prodottoDaInserire.quanti;
            }
          });
      
          if (!isInCarrello) {
            carrello.push(prodottoDaInserire);
          }
          console.log("carrello attuale: ", carrello);
      
          localStorage.setItem("carrello", JSON.stringify(carrello));

          alert("Prodotto aggiunto al carrello")
          updateCartCount();
          updateTotalPrice();
        });
});
