
// (() => {
//     'use strict';

//     const forms = document.querySelectorAll('.needs-validation');

//     Array.from(forms).forEach(modulo => {
//         modulo.addEventListener('submit', evento => {
//             if (!modulo.checkValidity()) {
//                 evento.preventDefault();
//                 evento.stopPropagation();
//             }
//             modulo.classList.add('was-validated');
//         }, false);
//     });
// })();

// document.addEventListener('DOMContentLoaded', () => {
//     const contenitoreBottoneAuth = document.getElementById('authButtonContainer');
//     const campoEmail = document.getElementById('inputEMail');
//     const campoPassword = document.getElementById('inputPassword');
//     const bottoneLogin = document.getElementById('loginButton');
//     const bottoneModaleLogin = document.getElementById('modalLoginButton'); 
//     const modaleLogin = document.getElementById('loginModal'); 

//     const aggiornaBottoneAuth = () => {
//         const utenteCorrente = JSON.parse(localStorage.getItem('utenteCorrente'));

//         if (!contenitoreBottoneAuth) return;

//         if (utenteCorrente) {
//             contenitoreBottoneAuth.innerHTML = `
//                 <button id="logoutButton" class="btn btn-danger">Logout</button>
//             `;
//             aggiungiListenerLogout();

//             if (bottoneModaleLogin) bottoneModaleLogin.style.display = 'none';

//             if (modaleLogin) {
//                 const istanzaModale = bootstrap.Modal.getInstance(modaleLogin);
//                 if (istanzaModale) istanzaModale.hide();
//             }
//         } else {
//             contenitoreBottoneAuth.innerHTML = `
//                 <button id="loginButton" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#loginModal">Login</button>
//             `;
//             if (bottoneModaleLogin) bottoneModaleLogin.style.display = 'block';
//         }
//     };

//     const aggiungiListenerLogout = () => {
//         const bottoneLogout = document.getElementById('logoutButton');
//         if (bottoneLogout) {
//             bottoneLogout.addEventListener('click', () => {
//                 localStorage.removeItem('utenteCorrente');
//                 aggiornaBottoneAuth();
//                 window.location.href = 'index.html';
//             });
//         }
//     };

//     bottoneLogin?.addEventListener('click', async (evento) => {
//         evento.preventDefault();

//         const email = campoEmail.value;
//         const password = campoPassword.value;

//         const utenteCorrente = JSON.parse(localStorage.getItem('utenteCorrente'));
//         if (utenteCorrente) {
//             alert('Sei già loggato! Per effettuare il logout, clicca su "Logout".');
//             return; 
//         }

//         if (email && password) {
//             const utente = { email, password };

//             try {
//                 const risposta = await fetch('http://127.0.0.1:8080/auth/login', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify(utente),
//                 });

//                 if (risposta.ok) {
//                     const utenteLoggato = await risposta.json();

//                     localStorage.setItem('utenteCorrente', JSON.stringify(utenteLoggato));

//                     const ruolo = utenteLoggato.ruolo;
//                     if (ruolo === 'ADMIN' || ruolo === 'UTENTE') {
//                         aggiornaBottoneAuth();

//                         const istanzaModale = bootstrap.Modal.getInstance(modaleLogin);
//                         istanzaModale.hide();
//                     } else {
//                         alert('Ruolo non riconosciuto. Contatta l\'amministratore di sistema.');
//                     }
//                 } else {
//                     alert('Credenziali non valide!');
//                 }
//             } catch (errore) {
//                 console.error('Errore nella richiesta di login:', errore);
//                 alert('Si è verificato un errore durante il login. Riprova più tardi.');
//             }
//         } else {
//             alert('Per favore, inserisci sia l\'email che la password.');
//         }
//     });

//     const inizializza = () => {
//         localStorage.removeItem('utenteCorrente'); 
//         aggiornaBottoneAuth();
//     };

//     inizializza();
// });


// (() => {
//     'use strict';

//     const forms = document.querySelectorAll('.needs-validation');
//     Array.from(forms).forEach(modulo => {
//         modulo.addEventListener('submit', evento => {
//             if (!modulo.checkValidity()) {
//                 evento.preventDefault();
//                 evento.stopPropagation();
//             }
//             modulo.classList.add('was-validated');
//         }, false);
//     });
// })();

// document.addEventListener('DOMContentLoaded', () => {
//     const contenitoreBottoneAuth = document.getElementById('authButtonContainer');
//     const campoEmail = document.getElementById('inputEMail');
//     const campoPassword = document.getElementById('inputPassword');
//     const bottoneLogin = document.getElementById('loginButton');
//     const bottoneModaleLogin = document.getElementById('modalLoginButton');
//     const modaleLogin = document.getElementById('loginModal');

//     // Funzione per aggiornare il bottone di login/logout
//     const aggiornaBottoneAuth = async () => {
//         try {
//             const response = await fetch('/auth/checkSession', { method: 'GET', credentials: 'same-origin' });

//             if (response.ok) {
//                 const utenteLoggato = await response.json();
//                 contenitoreBottoneAuth.innerHTML = `
//                     <button id="logoutButton" class="btn btn-danger">Logout</button>
//                 `;
//                 aggiungiListenerLogout();

//                 if (bottoneModaleLogin) bottoneModaleLogin.style.display = 'none';
//                 if (modaleLogin) {
//                     const istanzaModale = bootstrap.Modal.getInstance(modaleLogin);
//                     if (istanzaModale) istanzaModale.hide();
//                 }
//             } else {
//                 contenitoreBottoneAuth.innerHTML = `
//                     <button id="loginButton" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#loginModal">Login</button>
//                 `;
//                 if (bottoneModaleLogin) bottoneModaleLogin.style.display = 'block';
//             }
//         } catch (err) {
//             console.error('Errore durante il controllo della sessione:', err);
//         }
//     };

//     // Funzione per aggiungere il listener al bottone di logout
//     const aggiungiListenerLogout = () => {
//         const bottoneLogout = document.getElementById('logoutButton');
//         if (bottoneLogout) {
//             bottoneLogout.addEventListener('click', async () => {
//                 try {
//                     const response = await fetch('/auth/logout', { method: 'POST', credentials: 'same-origin' });
//                     if (response.ok) {
//                         aggiornaBottoneAuth();
//                         window.location.href = 'index.html';
//                     } else {
//                         alert('Errore nel logout');
//                     }
//                 } catch (err) {
//                     console.error('Errore nel logout:', err);
//                     alert('Si è verificato un errore durante il logout.');
//                 }
//             });
//         }
//     };

//     // Funzione per gestire il login dell'utente
//     bottoneLogin.addEventListener('click', async (evento) => {
//         evento.preventDefault();

//         const email = campoEmail.value;
//         const password = campoPassword.value;

//         try {
//             // Verifica se l'utente è già loggato tramite il server (sessione HTTP)
//             const response = await fetch('/auth/checkSession', { method: 'GET', credentials: 'same-origin' });

//             if (response.ok) {
//                 alert('Sei già loggato! Per effettuare il logout, clicca su "Logout".');
//                 return;
//             }

//             if (email && password) {
//                 const utente = { email, password };

//                 try {
//                     const risposta = await fetch('/auth/login', {
//                         method: 'POST',
//                         headers: { 'Content-Type': 'application/json' },
//                         body: JSON.stringify(utente),
//                         credentials: 'same-origin' // Mantenere la sessione HTTPS
//                     });

//                     if (risposta.ok) {
//                         const utenteLoggato = await risposta.json();
//                         aggiornaBottoneAuth();
//                     } else {
//                         alert('Credenziali non valide!');
//                     }
//                 } catch (errore) {
//                     console.error('Errore nella richiesta di login:', errore);
//                     alert('Si è verificato un errore durante il login. Riprova più tardi.');
//                 }
//             } else {
//                 alert('Per favore, inserisci sia l\'email che la password.');
//             }
//         } catch (err) {
//             console.error('Errore durante il controllo della sessione:', err);
//         }
//     });

//     // Funzione per inizializzare la pagina
//     const inizializza = () => {
//         aggiornaBottoneAuth();  // Verifica se l'utente è loggato all'avvio della pagina
//     };

//     inizializza();  // Chiamata iniziale per aggiornare il bottone all'avvio della pagina
// });

let ruoloUtente = "";
console.log(ruoloUtente);


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



// Gestisce il submit del form di login
document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();  // Evita il comportamento di submit predefinito del form

    // Crea un oggetto con i dati del form
    const formData = {
        email: document.getElementById("inputEMail").value,
        password: document.getElementById("inputPassword").value
    };

    // Usa fetch per inviare i dati come JSON
    var data = await fetch("http://localhost:8080/auth/login", {
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
            
            console.log("prova" + data.nome);
            console.log("prova" + data.ruolo);
            ruoloUtente = data.ruolo;
            console.log(ruoloUtente);

            if(data.ruolo === 'UTENTE') {
                document.getElementById("btnLogin").style.display = "none";
                document.getElementById("btnLogout").style.display = "inline-block";
                document.getElementById("btnOrders").style.display = "inline-block";
            } else if (data.ruolo === 'ADMIN') {
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

        
            
            
        } else {
            console.log("Login fallito");
            alert("Credenziali non valide");
        }
    
});

document.getElementById("btnLogout").addEventListener("click", async function() {
    await logout();
    window.location.href = "/";  // Reindirizza alla home dopo il logout
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
        if (window.location.href !== "http://localhost:8080/views/index.html") {
            window.location.assign("http://localhost:8080/views/index.html")
        }

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
    var data = await fetch("http://localhost:8080/auth/checkSession", {
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

// Esegui il check della sessione quando la pagina è pronta
// document.addEventListener("DOMContentLoaded", function() {
//     checkSession();  // Verifica la sessione appena la pagina è pronta
// });



