package org.generation.NerdVault.services;

import java.util.List;

import org.generation.NerdVault.dtos.OrdineDto;
import org.generation.NerdVault.entities.Ordine;
//import org.generation.NerdVault.entities.Ordine;

public interface OrdineService {

//	List<Ordine> prendiTutti();
	List<OrdineDto> prendiTutti();
	List<OrdineDto> prendiConUtenteId(int utenteId);
	
	Ordine getById(int ordineId);
	OrdineDto prendiConId(int id);
	
//	OrdineDto aggiungi(Ordine ordine);
	OrdineDto aggiungi(OrdineDto ordine);

//	OrdineDto aggiorna(Ordine daModificare, Ordine ordine);
	OrdineDto aggiorna(Ordine daModificare, OrdineDto ordine);
	void cancellaOrdine(int trovatoId);
}
