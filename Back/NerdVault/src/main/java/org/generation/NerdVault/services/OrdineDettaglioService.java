package org.generation.NerdVault.services;

import java.util.List;

import org.generation.NerdVault.dtos.OrdineDettaglioDto;
import org.generation.NerdVault.entities.OrdineDettaglio;

public interface OrdineDettaglioService {

	List<OrdineDettaglioDto> prendiTutti();
	
	List<OrdineDettaglio> prendiConOrdineId(int ordineId);
	List<OrdineDettaglioDto> prendiDtoConOrdineId(int ordineId);
	
	OrdineDettaglioDto aggiungi(OrdineDettaglioDto dto);
	
	OrdineDettaglioDto modifica(OrdineDettaglio details, OrdineDettaglioDto modifiche);
	
	void cancella(int ordineId);
	
}
