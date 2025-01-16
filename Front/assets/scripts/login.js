//   document.addEventListener('DOMContentLoaded', () => {
//     const authButtonContainer = document.getElementById('authButtonContainer');
//     const usernameInput = document.getElementById('inputEMail');
//     const passwordInput = document.getElementById('inputPassword');
//     const loginButton = document.getElementById('loginButton');
//     const loginModal = document.getElementById('loginModal');

//     // Funzione per aggiornare il bottone di login/logout
//     const updateAuthButton = async () => {
//         try {
//             const response = await fetch('/auth/checkSession', {
//                 method: 'GET',
//                 credentials: 'same-origin', // Include i cookie di sessione
//             });

//             if (response.ok) {
//                 const loggedInUser = await response.json();
//                 console.log('Utente loggato:', loggedInUser);

//                 // Salva i dati dell'utente nel localStorage
//                 localStorage.setItem('currentUser', JSON.stringify(loggedInUser));

//                 // Aggiorna il bottone con Logout
//                 authButtonContainer.innerHTML = `
//                     <button id="logoutButton" class="btn btn-danger">Logout</button>
//                 `;
//                 addLogoutListener();
//             } else {
//                 // Rimuovi l'utente dal localStorage e mostra il bottone di Login
//                 localStorage.removeItem('currentUser');
//                 authButtonContainer.innerHTML = `
//                     <button id="loginButton" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#loginModal">Login</button>
//                 `;
//             }
//         } catch (error) {
//             console.error('Errore nel controllo della sessione:', error);
//         }
//     };

//     // Funzione per aggiungere il listener al bottone di logout
//     const addLogoutListener = () => {
//         const logoutButton = document.getElementById('logoutButton');
//         if (logoutButton) {
//             logoutButton.addEventListener('click', async () => {
//                 try {
//                     const response = await fetch('/auth/logout', {
//                         method: 'POST',
//                         credentials: 'same-origin', // Include i cookie di sessione
//                     });

//                     if (response.ok) {
//                         console.log('Logout eseguito con successo.');
//                         localStorage.removeItem('currentUser'); // Rimuovi l'utente dal localStorage
//                         updateAuthButton(); // Aggiorna lo stato del bottone
//                         window.location.href = 'index.html'; // Reindirizza alla homepage
//                     }
//                 } catch (error) {
//                     console.error('Errore durante il logout:', error);
//                 }
//             });
//         }
//     };

//     // Funzione di gestione del login
//     loginButton?.addEventListener('click', async (e) => {
//         e.preventDefault();

//         const email = usernameInput.value;
//         const password = passwordInput.value;

//         if (!email || !password) {
//             alert('Inserisci sia email che password.');
//             return;
//         }

//         try {
//             const response = await fetch('/auth/login', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ email, password }),
//                 credentials: 'same-origin', // Per inviare i cookie di sessione
//             });

//             if (response.ok) {
//                 const loggedInUser = await response.json();
//                 console.log('Login riuscito:', loggedInUser);

//                 // Salva i dati dell'utente nel localStorage
//                 localStorage.setItem('currentUser', JSON.stringify(loggedInUser));

//                 // Aggiorna il bottone di login/logout
//                 updateAuthButton();

//                 // Chiudi il modal di login
//                 const modalInstance = bootstrap.Modal.getInstance(loginModal);
//                 if (modalInstance) modalInstance.hide();
//             } else {
//                 alert('Credenziali non valide!');
//             }
//         } catch (error) {
//             console.error('Errore nella richiesta di login:', error);
//             alert('Si è verificato un errore. Riprova più tardi.');
//         }
//     });

//     // Inizializza lo stato della sessione al caricamento della pagina
//     const init = () => {
//         const currentUser = localStorage.getItem('currentUser');
//         if (currentUser) {
//             console.log('Utente presente in localStorage:', JSON.parse(currentUser));
//         }
//         updateAuthButton();
//     };

//     init();
// });
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

document.addEventListener('DOMContentLoaded', () => {
    const contenitoreBottoneAuth = document.getElementById('authButtonContainer');
    const campoEmail = document.getElementById('inputEMail');
    const campoPassword = document.getElementById('inputPassword');
    const bottoneLogin = document.getElementById('loginButton');
    const bottoneModaleLogin = document.getElementById('modalLoginButton'); 
    const modaleLogin = document.getElementById('loginModal'); 

    const aggiornaBottoneAuth = () => {
        const utenteCorrente = JSON.parse(localStorage.getItem('utenteCorrente'));

        if (!contenitoreBottoneAuth) return;

        if (utenteCorrente) {
            contenitoreBottoneAuth.innerHTML = `
                <button id="logoutButton" class="btn btn-danger">Logout</button>
            `;
            aggiungiListenerLogout();

            if (bottoneModaleLogin) bottoneModaleLogin.style.display = 'none';

            if (modaleLogin) {
                const istanzaModale = bootstrap.Modal.getInstance(modaleLogin);
                if (istanzaModale) istanzaModale.hide();
            }
        } else {
            contenitoreBottoneAuth.innerHTML = `
                <button id="loginButton" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#loginModal">Login</button>
            `;
            if (bottoneModaleLogin) bottoneModaleLogin.style.display = 'block';
        }
    };

    const aggiungiListenerLogout = () => {
        const bottoneLogout = document.getElementById('logoutButton');
        if (bottoneLogout) {
            bottoneLogout.addEventListener('click', () => {
                localStorage.removeItem('utenteCorrente');
                aggiornaBottoneAuth();
                window.location.href = 'index.html';
            });
        }
    };

    bottoneLogin?.addEventListener('click', async (evento) => {
        evento.preventDefault();

        const email = campoEmail.value;
        const password = campoPassword.value;

        const utenteCorrente = JSON.parse(localStorage.getItem('utenteCorrente'));
        if (utenteCorrente) {
            alert('Sei già loggato! Per effettuare il logout, clicca su "Logout".');
            return; 
        }

        if (email && password) {
            const utente = { email, password };

            try {
                const risposta = await fetch('http://127.0.0.1:8080/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(utente),
                });

                if (risposta.ok) {
                    const utenteLoggato = await risposta.json();

                    localStorage.setItem('utenteCorrente', JSON.stringify(utenteLoggato));

                    const ruolo = utenteLoggato.ruolo;
                    if (ruolo === 'ADMIN' || ruolo === 'UTENTE') {
                        aggiornaBottoneAuth();

                        const istanzaModale = bootstrap.Modal.getInstance(modaleLogin);
                        istanzaModale.hide();
                    } else {
                        alert('Ruolo non riconosciuto. Contatta l\'amministratore di sistema.');
                    }
                } else {
                    alert('Credenziali non valide!');
                }
            } catch (errore) {
                console.error('Errore nella richiesta di login:', errore);
                alert('Si è verificato un errore durante il login. Riprova più tardi.');
            }
        } else {
            alert('Per favore, inserisci sia l\'email che la password.');
        }
    });

    const inizializza = () => {
        localStorage.removeItem('utenteCorrente'); 
        aggiornaBottoneAuth();
    };

    inizializza();
});
