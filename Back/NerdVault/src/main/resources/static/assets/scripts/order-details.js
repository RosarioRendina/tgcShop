 // Funzione per ottenere l'ID dell'ordine dall'URL
 function getOrderId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('ordineId');
}

// Funzione per caricare i dettagli dell'ordine
function loadOrderDetails() {
    const ordineId = getOrderId();

    if (!ordineId) {
        window.location.href = './user.html'
    }

    // Fai una richiesta al server per ottenere i dettagli dell'ordine
    const apiUrl = `http://localhost:8080/api/details/${ordineId}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                document.getElementById('#order-details-table').innerHTML = `<tr><td colspan="4">Nessun dettaglio disponibile per questo ordine.</td></tr>`;
            } else {
                // Genera dinamicamente le righe della tabella
                const tableBody = document.querySelector('#order-details-table tbody');
                tableBody.innerHTML = ''; // Pulisce la tabella prima di aggiungere nuove righe

                let totale = 0;

                data.forEach(detail => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="text-start">${detail.prodotto.nome}</td>
                        <td class="text-start">${detail.quantita}</td>
                        <td class="text-start">€${detail.prodotto.prezzo}</td>
                        <td class="text-start">€${(detail.prezzo).toFixed(2)}</td>
                    `;
                    totale += parseFloat(detail.prezzo)
                    tableBody.appendChild(row);
                });
                const row = document.createElement('tr');
                row.innerHTML = `

                        <tr>

                            <td colspan="1"></td>
                        
                        </tr>
                        
                        <td></td>
                        
                        <td class="text-start">TOTALE ORDINE</td>

                        <td colspan="3" class="text-start">€${totale.toFixed(2)}</td>
                    `;
                    tableBody.appendChild(row);
            }
        })
        .catch(error => {
            console.error('Errore nel recupero dei dettagli dell\'ordine:', error);
            document.getElementById('order-details-table').innerHTML = `<tr><td colspan="4">Errore nel recupero dei dettagli dell'ordine.</td></tr>`;
        });
}

// Carica i dettagli quando la pagina è pronta
window.onload = loadOrderDetails;