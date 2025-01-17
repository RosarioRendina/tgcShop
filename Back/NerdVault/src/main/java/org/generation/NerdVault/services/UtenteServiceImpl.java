package org.generation.NerdVault.services;

import java.util.List;
import java.util.Optional;

import org.generation.NerdVault.dtos.LoginRequest;
import org.generation.NerdVault.dtos.UtenteDto;
import org.generation.NerdVault.entities.Utente;
import org.generation.NerdVault.repositories.UtenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UtenteServiceImpl implements UtenteService{

	@Autowired
	UtenteRepository utenteRepo;

	@Override
	public List<Utente> prendiTutti() {
		List<Utente> utenti = utenteRepo.findAll();
		
		return utenti;
	}

	@Override
	public Utente cercaPerId(int id) {
		Optional<Utente> opt = utenteRepo.findById(id);
		if(opt.isPresent()) {
			return opt.get();
		} else return null;
	}

	@Override
	public Utente cercaPerEmail(String email) {
		return utenteRepo.findByEmail(email);
	}

	@Override
	public UtenteDto aggiungi(Utente utente) {
		Utente u = utenteRepo.save(utente);
		return this.toUtenteDto(u);
	}

	@Override
	public void cancellaUtente(int id) {
		utenteRepo.deleteById(id);
	}
	
	@Override
	public Utente autenticaUtente(LoginRequest datiUtente) {
		Utente utente = utenteRepo.findByEmail(datiUtente.getEmail());
		
		if (utente != null && utente.getPassword().equals(datiUtente.getPassword())) {
			return utente;
		}
		return null;
	}
	
	private UtenteDto toUtenteDto(Utente utente) {
		UtenteDto dto = new UtenteDto(
				utente.getUtenteId(),
				utente.getNome(),
				utente.getCognome(),
				utente.getDataNascita(),
				utente.getEmail(),
				utente.getRuolo()
				);
		
		return dto;
	}
	
}
