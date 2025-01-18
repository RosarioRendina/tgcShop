package org.generation.NerdVault.services;

import java.util.List;

import org.generation.NerdVault.dtos.ProdottoDto;
import org.generation.NerdVault.entities.Prodotto;
import org.generation.NerdVault.enums.ProdottoCategoria;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface ProdottoService {

//	List<Prodotto> prendiTutti();
	List<ProdottoDto> prendiTutti();

	Prodotto cercaPerId(int id);
	ProdottoDto cercaPerIdDto(int id);
	
//	List<Prodotto> cercaPerCategoria(ProdottoCategoria categoria);
	List<ProdottoDto> cercaPerCategoria(ProdottoCategoria categoria);
	
	ProdottoDto aggiungi(Prodotto prodotto);
	ProdottoDto aggiungiConImg(Prodotto prodotto, MultipartFile multipartFile);
	
	ProdottoDto aggiorna(Prodotto prodotto, Prodotto prodottoModificato);
	
	void cancellaProdotto(int id);

	ProdottoDto aggiornaConImg(Prodotto esistente, Prodotto aggiornato, MultipartFile img);

	List<ProdottoDto> prendiTuttiPaging(Pageable pageable);
	List<ProdottoDto> prendiTuttiPagingCategoria(Pageable pageable, String categoriaFilter);

	
	
}
