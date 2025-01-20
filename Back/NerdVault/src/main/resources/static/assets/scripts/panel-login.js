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

        // Mostra il form di login
        document.body.innerHTML = `
            <div class="vh-100 d-flex align-items-center justify-content-center" style="">
                <div class="container container-log d-flex flex-column align-items-center align-content-center justify-content-center ">
                    <h1>Non hai i permessi per accedere a questa pagina! Effettua il login</h1>
                    <form class="w-50" action="javascript:void(0);" method="POST" id="loginForm">
                        <div class="mb-3">
                            <label for="inputEMail" class="col-form-label">E-mail</label>
                            <input type="email" class="form-control" id="inputEMail" name="email" placeholder="esempio@email.it" value="admin@email.com" required>
                        </div>
                        <div class="mb-3">
                            <label for="inputPassword" class="col-form-label">Password</label>
                            <input type="password" class="form-control" id="inputPassword" name="password" value="admin" required>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-primary">Invia</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Aggiungi il listener per il submit del form di login
        const loginForm = document.getElementById("loginForm");
        if (loginForm) {
            loginForm.addEventListener("submit", handleLoginSubmit);
        }
    }
}

// Funzione per aggiornare l'interfaccia in base al ruolo
function aggiornaUI(ruolo) {
    if (ruolo === 'UTENTE') {
        window.location.href = "./errorlogin.html";
    } else if (ruolo === 'ADMIN') {
        document.getElementById("btnLogin").style.display = "none";
        document.getElementById("btnLogout").style.display = "inline-block";
        document.getElementById("btnOrders").style.display = "inline-block";
        document.getElementById("btnPanel").style.display = "inline-block";
    } else {
        document.body.innerHTML = `
            <h1>Non hai i permessi per accedere a questa pagina! Effettua il login</h1>
            <form action="javascript:void(0);" method="POST" id="loginForm">
                <div class="mb-3">
                    <label for="inputEMail" class="col-form-label">E-mail</label>
                    <input type="email" class="form-control" id="inputEMail" name="email" placeholder="esempio@email.it" required>
                </div>
                <div class="mb-3">
                    <label for="inputPassword" class="col-form-label">Password</label>
                    <input type="password" class="form-control" id="inputPassword" name="password" required>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary">Invia</button>
                </div>
            </form>
        `;

        // Aggiungi il listener per il submit del form di login
        const loginForm = document.getElementById("loginForm");
        if (loginForm) {
            loginForm.addEventListener("submit", handleLoginSubmit);
        }
    }
}

// Gestisce il submit del form di login
function handleLoginSubmit(event) {
    event.preventDefault();  // Evita il comportamento di submit predefinito del form

    // Crea un oggetto con i dati del form
    const formData = {
        email: document.getElementById("inputEMail").value,
        password: document.getElementById("inputPassword").value
    };

    // Usa fetch per inviare i dati come JSON
    fetch("http://localhost:8080/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)  // Invia i dati del form come JSON
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.utenteId) {
            console.log("Login riuscito", data);

            // Aggiorna l'interfaccia utente dopo il login
            alert("Login riuscito, benvenuto " + data.nome);
            console.log("Ruolo:", data.ruolo);

            // Aggiorna il ruolo e la UI
            ruoloUtente = data.ruolo;
            // aggiornaUI(ruoloUtente); // Aggiorna l'interfaccia in base al ruolo

            // // Rimuove il form di login se l'utente ha fatto il login correttamente
            // document.body.innerHTML = '';
            
            location.reload();

        } else {
            console.log("Login fallito");
            alert("Credenziali non valide");
        }
    })
    .catch(error => console.error("Errore nel login", error));
}

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
            alert("Non sei loggato");
            return null;  // Nessun dato da parsare
        }
        return response.json();  // Solo se la risposta è valida, la parsificiamo come JSON
    }).catch(error => console.error("Errore nel verificare la sessione", error));

    if (data) {
        // Se siamo riusciti a fare il parsing, significa che l'utente è loggato
        console.log("Utente loggato:", data);
        alert("Utente loggato: " + data.nome);
    }
}
