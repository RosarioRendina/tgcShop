let ruoloUtente = "";
console.log(ruoloUtente);

// Funzione che si avvia al caricamento o al refresh della pagina
window.addEventListener('load', async () => {
    await verificaRuoloUtente();
});

(() => {
    'use strict';

    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(modulo => {
        modulo.addEventListener('submit', evento => {
            if (!modulo.checkValidity()) {
                evento.preventDefault();   
                evento.stopPropagation();
            }
            modulo.classList.add('was-validated');
        }, false);
    });
})();

// Funzione per gestire il controllo del ruolo utente
async function verificaRuoloUtente() {
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

    if (data && data.ruolo) {
        console.log("Ruolo utente verificato:", data.ruolo);
        ruoloUtente = data.ruolo;

        // Aggiorna la UI in base al ruolo
        aggiornaUI(ruoloUtente);
    } else {
        console.log("Utente non loggato o sessione scaduta");
    }
}

// Funzione per aggiornare l'interfaccia in base al ruolo
function aggiornaUI(ruolo) {
    if (ruolo === 'UTENTE') {
        document.getElementById("btnLogin").style.display = "none";
        document.getElementById("btnLogout").style.display = "inline-block";
        document.getElementById("btnOrders").style.display = "inline-block";
        document.getElementById("btnPanel").style.display = "none";
    } else if (ruolo === 'ADMIN') {
        document.getElementById("btnLogin").style.display = "none";
        document.getElementById("btnLogout").style.display = "inline-block";
        document.getElementById("btnOrders").style.display = "inline-block";
        document.getElementById("btnPanel").style.display = "inline-block";
    } else {
        document.getElementById("btnLogin").style.display = "inline-block";
        document.getElementById("btnLogout").style.display = "none";
        document.getElementById("btnOrders").style.display = "none";
        document.getElementById("btnPanel").style.display = "none";
    }
}

// Gestisce il submit del form di login
document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();  // Evita il comportamento di submit predefinito del form

    // Crea un oggetto con i dati del form
    const formData = {
        email: document.getElementById("inputEMail").value,
        password: document.getElementById("inputPassword").value
    };

    // Usa fetch per inviare i dati come JSON
    const data = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)  // Invia i dati del form come JSON
    })
    .then(response => response.json())
    .catch(error => console.error("Errore nel login", error));

    if (data && data.utenteId) {
        console.log("Login riuscito", data);

        // Usa Bootstrap per chiudere la modale (senza jQuery)
        const modalElement = document.getElementById('loginModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();  // Chiudi la modale

        // Aggiorna l'interfaccia utente o esegui altre azioni necessarie dopo il login
        // Ad esempio, mostra un messaggio di benvenuto o aggiorna la navbar
        alert("Login riuscito, benvenuto " + data.nome);
        console.log("Ruolo:", data.ruolo);
        
        ruoloUtente = data.ruolo;
        aggiornaUI(ruoloUtente); // Aggiorna l'interfaccia in base al ruolo
        location.reload();

    } else {
        console.log("Login fallito");
        alert("Credenziali non valide");
    }
});

document.getElementById("btnLogout").addEventListener("click", async function() {
    
    if (confirm("sei sicuro di voler effettuare il logout?")) {
        await logout();
        window.location.href = "./index.html";
    }
});

async function logout() {
    try {
        await fetch("http://localhost:8080/auth/logout", {
            method: "POST",
            credentials: "include"
        });
        document.getElementById("btnLogin").style.display = "inline-block";
        document.getElementById("btnLogout").style.display = "none";
        document.getElementById("btnOrders").style.display = "none";
        document.getElementById("btnPanel").style.display = "none";  // Nasconde i pulsanti specifici quando si è disconnessi
        
        

        alert("Logout avvenuto con successo");
    } catch (error) {
        console.error("Errore nel logout", error);
    }
}

document.getElementById("CheckSession").addEventListener("click", async function(event) {
    await checkSession();
})

// Funzione per verificare lo stato della sessione
async function checkSession() {
    const data = await fetch("http://localhost:8080/auth/checkSession", {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (response.status === 401) {
            // Se la risposta è 401 (Unauthorized), significa che l'utente non è loggato
            console.log("Utente non loggato");
            // alert("Non sei loggato");
            return null;  // Nessun dato da parsare
        }
        return response.json();  // Solo se la risposta è valida, la parsificiamo come JSON
    }).catch(error => console.error("Errore nel verificare la sessione", error));

    if (data) {
        // Se siamo riusciti a fare il parsing, significa che l'utente è loggato
        console.log("Utente loggato:", data);
        // alert("Utente loggato: " + data.nome);
    }
}