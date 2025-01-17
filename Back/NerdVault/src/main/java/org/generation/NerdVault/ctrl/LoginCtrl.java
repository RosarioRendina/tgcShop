package org.generation.NerdVault.ctrl;

import org.generation.NerdVault.dtos.LoginRequest;
import org.generation.NerdVault.dtos.UtenteDto;
import org.generation.NerdVault.entities.Utente;
import org.generation.NerdVault.services.UtenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/auth")
public class LoginCtrl {

    @Autowired
    private UtenteService utenteService;
    @Autowired
    HttpSession session;

    @PostMapping("/login")
    public ResponseEntity<UtenteDto> login(@RequestBody LoginRequest loginRequest) {
    	
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        // Cerca l'utente nel database
        Utente utente = utenteService.cercaPerEmail(email);

        if (utente != null && utente.getPassword().equals(password)) {
            // Crea una sessione se l'utente è valido
            UtenteDto utenteDtoResponse = new UtenteDto(utente);
            session.setAttribute("currentUser", utente);  // Salva l'utente nella sessione

            // Verifica che la sessione sia creata
            System.out.println("Sessione creata: " + session.getId());  // Log per controllare l'ID della sessione
           
            return ResponseEntity.ok(utenteDtoResponse);  // Restituisci il DTO dell'utente
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new UtenteDto());  // Credenziali errate
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        // Verifica se la sessione è presente
        if (session.getAttribute("currentUser") == null) {
            // Se non c'è nessun utente nella sessione, restituisci un errore
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Non sei loggato");
        }

        // Invalidare la sessione
        session.invalidate();

        // Restituisci la risposta di successo
        return ResponseEntity.ok("Logout effettuato con successo");
    }

    @GetMapping("/checkSession")
    public ResponseEntity<UtenteDto> checkSession() {
        System.out.println("sessionid: " + session.getId());
        Utente currentUser = (Utente) session.getAttribute("currentUser");
        if (currentUser != null) {
            System.out.println("Sessione trovata per l'utente: " + currentUser.getEmail());
            return ResponseEntity.ok(new UtenteDto(currentUser));  // Utente loggato
        } else {
            System.out.println("Nessuna sessione attiva.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);  // Utente non loggato
        }
    }


}