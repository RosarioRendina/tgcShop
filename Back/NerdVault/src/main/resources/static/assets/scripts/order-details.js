 // Funzione per ottenere l'ID dell'ordine dall'URL
 function getOrderId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('ordineId');
}

// Funzione per caricare i dettagli dell'ordine
function loadOrderDetails() {
    const ordineId = getOrderId();

    if (!ordineId) {
        alert('ID ordine mancante');
        return;
    }

    // Fai una richiesta al server per ottenere i dettagli dell'ordine
    const apiUrl = `http://localhost:8080/api/details/${ordineId}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                document.getElementById('order-details-table').innerHTML = `<tr><td colspan="4">Nessun dettaglio disponibile per questo ordine.</td></tr>`;
            } else {
                // Genera dinamicamente le righe della tabella
                const tableBody = document.querySelector('#order-details-table tbody');
                tableBody.innerHTML = ''; // Pulisce la tabella prima di aggiungere nuove righe

                data.forEach(detail => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${detail.prodotto.nome}</td>
                        <td>${detail.quantita}</td>
                        <td>€${detail.prezzo}</td>
                        <td>€${(detail.prezzo * detail.quantita).toFixed(2)}</td>
                    `;
                    tableBody.appendChild(row);
                });
            }
        })
        .catch(error => {
            console.error('Errore nel recupero dei dettagli dell\'ordine:', error);
            document.getElementById('order-details-table').innerHTML = `<tr><td colspan="4">Errore nel recupero dei dettagli dell'ordine.</td></tr>`;
        });
}

// Carica i dettagli quando la pagina è pronta
window.onload = loadOrderDetails;