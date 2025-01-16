package org.generation.NerdVault.repositories;

import java.util.List;

import org.generation.NerdVault.entities.OrdineDettaglio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdineDettaglioRepository extends JpaRepository<OrdineDettaglio, Integer>{
	
	List<OrdineDettaglio> findAllByOrdine_OrdineId(int ordineId);
	
}
