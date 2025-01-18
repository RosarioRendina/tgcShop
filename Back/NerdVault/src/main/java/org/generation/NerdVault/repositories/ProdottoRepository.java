package org.generation.NerdVault.repositories;

import java.util.List;

import org.generation.NerdVault.entities.Prodotto;
import org.generation.NerdVault.enums.ProdottoCategoria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProdottoRepository extends JpaRepository<Prodotto, Integer> {
	
	List<Prodotto> findByCategoria(ProdottoCategoria categoria);

	Page<Prodotto> findByCategoria(ProdottoCategoria categoria, Pageable pageable);

	Page<Prodotto> findBySearchContainingIgnoreCase(String name, Pageable pageable);
	Page<Prodotto> findByCategoriaAndSearchContainingIgnoreCase(ProdottoCategoria categoria, String name, Pageable pageable);
	
	
}
