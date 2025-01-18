package org.generation.NerdVault.repositories;

import org.generation.NerdVault.entities.Ordine;
import org.generation.NerdVault.enums.OrdineStato;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdineRepository extends JpaRepository<Ordine, Integer>{
	
	Page<Ordine> findByStatoOrdineAndUtenteUtenteId(OrdineStato statoOrdine, int utenteId, Pageable pageable);
	
	Page<Ordine> findByUtenteUtenteId(int utenteId, Pageable pageable);
	
}
