document.addEventListener("DOMContentLoaded", () => {
    
    function getProductId() {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get("id"), 10);
    }

    const productId = getProductId();

    if (!productId) {
        
        window.location.href = "index.html";
        return;
    }

    
    const apiUrl = `http://localhost:8080/api/prodotto/${productId}`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(product => {
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
            const productQuantity = document.getElementById("product-quantity");
            const productImg = document.getElementById("product-img");
            const productDesc = document.getElementById("product-description");
            const btnCarrello = document.getElementById("btn-carrello");
            const productAvailable = document.getElementById("product-available");

            productTitle.textContent = product.nome;
            productPrice.textContent = `Prezzo: €${product.prezzo.toFixed(2)}`;
            productImg.src = product.imgUrl;
            productDesc.innerHTML = product.descrizione || "N/A";

            if(product.rimanenza==0){
                productQuantity.classList.add("d-none");
                btnCarrello.classList.add("d-none");
                productAvailable.classList.remove("d-none")
            }
        })
        /*.catch(error => {
            console.error("Errore durante il recupero dei dati del prodotto:", error);
            document.getElementById("product-container").innerHTML = `
                <div class="alert alert-danger" role="alert">
                    Impossibile caricare i dettagli del prodotto!
                </div>`;
        });*/
});

