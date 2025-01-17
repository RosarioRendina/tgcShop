package org.generation.NerdVault.services;

import java.util.List;

import org.generation.NerdVault.dtos.LoginRequest;
import org.generation.NerdVault.dtos.UtenteDto;
import org.generation.NerdVault.entities.Utente;

public interface UtenteService {

	public List<Utente> prendiTutti();

	public Utente cercaPerId(int id);
	public Utente cercaPerEmail(String email);
	
	public UtenteDto aggiungi(Utente utente);
	
	public void cancellaUtente(int id);

	
	// Per autenticazione login
	Utente autenticaUtente(LoginRequest datiUtente);
}
