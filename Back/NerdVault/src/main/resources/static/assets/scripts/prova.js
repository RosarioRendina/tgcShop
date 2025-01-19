(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()
  // FINE SCRIPT DEL MODALE LOGIN - VA AGGIUNTA FUNZIONALITA' CRUD
  
  // checklist degli elementi del modal
  console.log(document.querySelector('.needs-validation'));
  console.log(document.getElementById('inputEMail'));
  console.log(document.getElementById('inputPassword'));
  console.log(document.getElementById('loginButton')); 
  const listeners = getEventListeners(form);
  console.log(listeners);
  
  document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton'); 
    const usernameInput = document.getElementById('inputEMail');
    const passwordInput = document.getElementById('inputPassword');
    
    loginButton.addEventListener('click', async (e) => {
        e.preventDefault(); 
        console.log('Login button clicked, but page did not refresh');
  
        const username = usernameInput.value;
        const password = passwordInput.value;
  
        if (username && password) {
            const user = {
                email: username,
                password: password
            };
  
            try {
                const response = await fetch('http://127.0.0.1:8080/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(user),
                });
  
                
                if (response.ok) {
                  const loggedInUser = await response.json();
                  console.log("tipo di utente:"+loggedInUser.ruolo);
                  
                  
                    localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
  
                    // RUOLO
                    const role = loggedInUser.ruolo;
                    if (role === 'ADMIN') {
                        //window.location.href = 'panel.html'; 
                        console.log(loggedInUser);
                        //window.location.href = 'boh.html';
                    } else if (role === 'UTENTE') {
                        //window.location.href = 'index.html'; 
                        console.log(loggedInUser);
                        
                    } else {
                        alert('Ruolo non riconosciuto. Contatta l\'amministratore di sistema.');
                    }
                } else {
                    alert('Credenziali non valide!');
                } 
            } catch (error) {
                console.error('Errore nella richiesta di login:', error);
                alert('Si è verificato un errore durante il login. Riprova più tardi.');
            }
        } else {
            alert('Per favore, inserisci sia lo username che la password.');
        }
    });
  });
  




  cart.addEventListener('click', e => {
    e.preventDefault();

    // Controlla se il clic avviene sull'icona del cestino
    if (e.target.tagName === 'I' && e.target.classList.contains('fa-trash')) {
        console.log('CANCELLA PRODOTTO');
        
        // Trova l'elemento HTML del prodotto
        const prodottoElement = e.target.parentElement.parentElement;
        
        // Ottieni il nome del prodotto (o un identificatore unico)
        const nomeProdotto = prodottoElement.querySelector('.prodottoNome').textContent;

        // Recupera il carrello dal localStorage
        let carrelloStorage = JSON.parse(localStorage.getItem('carrello')) || [];

        // Filtra il prodotto da rimuovere
        carrelloStorage = carrelloStorage.filter(prodotto => prodotto.nome !== nomeProdotto);

        // Aggiorna il localStorage con il nuovo array
        localStorage.setItem('carrello', JSON.stringify(carrelloStorage));

        // Rimuovi l'elemento HTML dal DOM
        prodottoElement.remove();
    }

    console.log('TAG: ', e.target.tagName);
});
