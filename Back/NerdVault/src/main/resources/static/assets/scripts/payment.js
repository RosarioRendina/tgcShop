const confermaPagamento = document.getElementById('payment-btn');

confermaPagamento.addEventListener('click', async function () {
    const conferma = confirm("Sei sicuro di voler procedere con il pagamento?");

    if (conferma) {
        const carrelloStorage = JSON.parse(localStorage.getItem('carrello')) || [];

        const utenteId = await getUtenteIdFromSession();

        if (!utenteId) {
            alert("Devi essere loggato per completare l'ordine.");
            return;
        }

        console.log("Corpo richiesta Ordine:", {
            utente: { utenteId: utenteId },
            indirizzoSpedizione: 'Indirizzo di spedizione',
            statoOrdine: 'IN_LAVORAZIONE'
        });

        try {
            // Creazione ordine
            const ordine = await creaOrdine(utenteId);

            // Aggiungi i dettagli dell'ordine
            await aggiungiDettagliOrdine(ordine.ordineId, carrelloStorage);

            // Pulizia del carrello e successivo messaggio
            localStorage.removeItem('carrello');
            alert('Pagamento avvenuto con successo!');
            window.location.href = './user.html';
        } catch (error) {
            console.error('Errore durante il processo di pagamento:', error);
        }
    } else {
        console.log("Pagamento annullato.");
    }
});

// Funzione per creare l'ordine
async function creaOrdine(utenteId) {
    const response = await fetch(`http://localhost:8080/api/ordine/u/${utenteId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            indirizzoSpedizione: 'Indirizzo di spedizione'
        })
    });

    if (!response.ok) {
        throw new Error('Errore nella creazione dell\'ordine');
    }

    const ordine = await response.json();
    console.log('Ordine creato:', ordine);
    return ordine;
}

// Funzione per aggiungere i dettagli dell'ordine
async function aggiungiDettagliOrdine(ordineId, carrelloStorage) {
    for (const prodotto of carrelloStorage) {
        const response = await fetch('http://localhost:8080/api/details', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ordineId: ordineId,
                prodottoId: prodotto.productId,
                quantita: prodotto.quanti
            })
        });

        if (!response.ok) {
            throw new Error('Errore nell\'aggiunta del dettaglio ordine');
        }

        const dettaglio = await response.json();
        console.log('Dettaglio ordine aggiunto:', dettaglio);
    }
}



// Funzione per ottenere l'utente ID dalla sessione
async function getUtenteIdFromSession() {
    const data = await fetch("http://localhost:8080/auth/checkSession", {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .catch(error => {
        console.error("Errore nel verificare la sessione", error);
        return null;
    });

    if (data && data.utenteId) {
        return data.utenteId;  // Restituisci l'utente ID dalla sessione
    } else {
        return null;  // Se non è loggato, ritorna null
    }
}
