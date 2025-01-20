const CARD_PER_PAGE = 9;
const getAllEndpoint = 'http://localhost:8080/api/prodotto';

document.addEventListener('DOMContentLoaded', () => {
  
  const stampaContainer = document.getElementById('available-container');
  const paginationContainer = document.getElementById('pagination-container');
  const prevenditaContainer = document.getElementById('presale-container');
  const numeroProdotti = document.getElementById('valore-disponibili');

  let prodotti = [];

  /* -------------------- filtro checkbox ------------------- */
  const checkboxes = document.querySelectorAll(".form-check-input");
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", () => {
      impaginaStampaProdotti(prodotti);
    });
  });

  getProducts();


  function getProducts() {
    fetch(getAllEndpoint)
      .then(response => {
        if(!response.ok) {
          throw new Error('Errore nella fetch per recuperare i prodotti.');
        }
        return response.json();
      })
      .then(data => {
        prodotti = data;
      
  
      const prodottiInPrevendita = prodotti.filter (p => p.categoria === 'PREVENDITA');
      const prodottiDisponibili = prodotti.filter (p => p.categoria !== null && p.categoria !== 'PREVENDITA');
  
      const quantiProdotti = document.getElementById('valore-disponibili');
      quantiProdotti.textContent = `${prodottiDisponibili.length} prodotti`;
  
      console.log("Prodotti in prevendita: ", prodottiInPrevendita);
      console.log("Prodotti disponibili: ", prodottiDisponibili);
  
    stampaCards(prodottiInPrevendita, prevenditaContainer);
    // FUNZIONE FILTRA E DISPLAY PRODOTTI NON PRESALE
    impaginaStampaProdotti(prodotti);
    updatePaginationControls(prodottiDisponibili.length, currentPage = 1, paginationContainer, prodottiDisponibili);
    })
    .catch(error => {
      console.error('Errore fetch recuperare prodotto', error);
      document.getElementById("available-container").innerHTML = `
      <div class="alert alert-danger" role="alert">
        Si è verificato un errore nel recupero dei prodotti.
      </div>`;
    document.getElementById("presale-container").innerHTML = `
      <div class="alert alert-danger" role="alert">
        Si è verificato un errore nel recupero dei prodotti.
      </div>`;
    });
  }

  function impaginaStampaProdotti(prodotti, currentPage = 1) {
    const startIndex = (currentPage - 1) * CARD_PER_PAGE;
    const endIndex = startIndex + CARD_PER_PAGE;
  
    const gamesChecked = document.getElementById("Check1").checked;
    const merchChecked = document.getElementById("Check2").checked;
    const accessoriesChecked = document.getElementById("Check3").checked;
    const specialsChecked = document.getElementById("Check4").checked;
    const otherChecked = document.getElementById("Check5").checked;
    const hotChecked = document.getElementById("Check6").checked;
    
    const selectedCategories = [];
    if (gamesChecked) selectedCategories.push("GAMES");
    if (merchChecked) selectedCategories.push("MERCH");
    if (accessoriesChecked) selectedCategories.push("ACCESSORI");
    if (specialsChecked) selectedCategories.push("SPECIALE");
    if (otherChecked) selectedCategories.push("ALTRO");
    if (hotChecked) selectedCategories.push("NOVITA");
    
    // Filtra in base alle categorie selezionate
    const prodottiFiltrati = prodotti.filter(prodotto => {
      if (selectedCategories.length === 0) return prodotto.categoria !== 'PREVENDITA';
      return selectedCategories.includes(prodotto.categoria);
    })
    
        //controlli di validità
        console.log("categorie selezionate:" + gamesChecked, merchChecked,accessoriesChecked,specialsChecked,otherChecked);
        console.log("Categorie selezionate:", selectedCategories);
        console.log("Prodotti filtrati:", prodottiFiltrati);
    
    
    const prodottiDaStampare = prodottiFiltrati.slice(startIndex, endIndex);
  
    numeroProdotti.textContent = `${prodottiFiltrati.length} prodotti`;
    
    stampaCards(prodottiDaStampare, stampaContainer);

    updatePaginationControls(prodottiFiltrati.length, currentPage, paginationContainer, prodottiFiltrati);
  }

  function stampaCards(prodotti, container) {
    // Reset del container
    container.innerHTML = "";
  
    prodotti.forEach(prodotto => {
      // Creazione della card HTML per ogni prodotto
      const card = document.createElement("div");
      card.classList.add("card", "m-2", "col-xs-12", "col-md-5", "col-xl-3");
  
      if(prodotto.categoria === 'PREVENDITA'){
         const presalePrice = prodotto.prezzo-(prodotto.prezzo*prodotto.scontoPrevendita)/100;
        card.innerHTML = `
        <a href="product.html?id=${prodotto.prodottoId}"><img src="${prodotto.imgUrl}" class="card-img-top" alt="${prodotto.nome}"></a>
        <div class="card-body d-flex flex-column ">
          <h5 class="card-title">${prodotto.nome}</h5>
          <div class="d-flex justify-content-between">
            <span class="card-text discount"><strong>€${prodotto.prezzo}</strong></span>
            <span class="card-text newPrice"><strong>€${presalePrice.toFixed(2)}</strong></span> 
          </div>
        </div>
      `;
      }else{
      card.innerHTML = `
        <a href="product.html?id=${prodotto.prodottoId}"><img src="${prodotto.imgUrl}" class="card-img-top" alt="${prodotto.nome}"></a>
        <div class="card-body d-flex flex-column ">
          <h5 class="card-title">${prodotto.nome}</h5>
          <p class="card-text"><strong>€${prodotto.prezzo}</strong></p>
        </div>
      `;}
      // Aggiungi la card al contenitore
      container.appendChild(card);
    });
    console.log("prodotti totali: " + prodotti.length);
  }
  
  function updatePaginationControls(totalItems, currentPage, container, products) {
    container.innerHTML = ""; // Pulisci il contenitore della paginazione
    
    const totalPages = Math.ceil(totalItems / CARD_PER_PAGE);
    
    if (totalPages <= 1) return; // Nascondi la paginazione se c'è una sola pagina
    
    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement("button");
      button.classList.add("btn", "btn-secondary", "mx-1");
      button.textContent = i;
      if (i === currentPage) {
        button.classList.add("active");
      }
      
      button.addEventListener("click", () => {
        impaginaStampaProdotti(products, i);
      });
      
      container.appendChild(button);
    }
  }
});