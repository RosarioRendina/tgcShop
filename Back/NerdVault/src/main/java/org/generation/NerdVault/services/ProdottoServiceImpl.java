package org.generation.NerdVault.services;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.generation.NerdVault.config.CustomProperties;
import org.generation.NerdVault.dtos.ProdottoDto;
import org.generation.NerdVault.entities.Prodotto;
import org.generation.NerdVault.enums.ProdottoCategoria;
import org.generation.NerdVault.repositories.ProdottoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProdottoServiceImpl implements ProdottoService {
	
	@Autowired
	ProdottoRepository prodottoRepo;

	@Override
	public List<ProdottoDto> prendiTutti() {
		List<Prodotto> prodotti = prodottoRepo.findAll();
		
		ArrayList<ProdottoDto> p = new ArrayList<ProdottoDto>();
		prodotti.forEach(prodotto -> p.add(this.toProdottoDto(prodotto)));
		
		return p;
	}
	
	@Override
	public List<ProdottoDto> prendiTuttiPaging(Pageable pageable) {
		Page<Prodotto> page = prodottoRepo.findAll(pageable);
		List<Prodotto> prodotti = page.getContent();
		
		ArrayList<ProdottoDto> p = new ArrayList<ProdottoDto>();
		prodotti.forEach(prodotto -> p.add(this.toProdottoDto(prodotto)));
		return p;
	}
	
	@Override
	public List<ProdottoDto> prendiTuttiPagingCategoria(Pageable pageable, String categoriaFilter) {
		if (categoriaFilter != null & !categoriaFilter.isEmpty()) {
			ProdottoCategoria categoria = ProdottoCategoria.valueOf("PREVENDITA");
			Page<Prodotto> page = prodottoRepo.findByCategoria(categoria, pageable);
			List<Prodotto> result = page.getContent();
			
			ArrayList<ProdottoDto> prodottiFiltrati = new ArrayList<ProdottoDto>();
			result.forEach(prodotto -> prodottiFiltrati.add(this.toProdottoDto(prodotto)));
			return prodottiFiltrati;
		}
		return prendiTuttiPaging(pageable);
	}

	@Override
	public Prodotto cercaPerId(int id) {
		Optional<Prodotto> opt = prodottoRepo.findById(id);
		if (opt.isPresent()) {
			return opt.get();
		}
		return null;
	}
	
	@Override
	public ProdottoDto cercaPerIdDto(int id) {
		Optional<Prodotto> opt = prodottoRepo.findById(id);
		if(opt.isPresent()) {
			return this.toProdottoDto(opt.get());
		}
		return null;
	}

	@Override
	public List<ProdottoDto> cercaPerCategoria(ProdottoCategoria categoria) {
		List<Prodotto> prodotti = prodottoRepo.findByCategoria(categoria);
		
		ArrayList<ProdottoDto> p = new ArrayList<ProdottoDto>();
		prodotti.forEach(prodotto -> p.add(this.toProdottoDto(prodotto)));
		
		return p;
	}
	
	@Override
	public ProdottoDto aggiungi(Prodotto prodotto) {
		Prodotto prod = prodottoRepo.save(prodotto);
		return this.toProdottoDto(prod);
	}

	@Override
	public ProdottoDto aggiungiConImg(Prodotto prodotto, MultipartFile multipartFile) {
		
		// Se esiste l'immagine da salvare 
		String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename().strip().replace(" ","-"));
		
		// Setto nome file prima di salvare il prodotto
		prodotto.setImmagine(fileName);
		Prodotto p = prodottoRepo.save(prodotto);
		
		// Genero percorso dove salvare l'immagine
		String uploadDir = CustomProperties.IMG_FOLDER_PATH;
		
		try {
			// Converte percorso stringa in un path
			Path uploadPath = Paths.get(uploadDir);
			
			if(!Files.exists(uploadPath)) {
				// Crea cartella dove salvare l'immagine se non esiste
				Files.createDirectories(uploadPath);
			}
			try (InputStream inputStream = multipartFile.getInputStream()) {
				Path filePath = uploadPath.resolve(fileName);
				// Sovrascrive file se già presente con stesso nome
				Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
			} catch (IOException ioe) {
				throw new IOException("Could not save img file: " + fileName, ioe);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return this.toProdottoDto(p);
	}

	@Override
	public void cancellaProdotto(int id) {
		prodottoRepo.deleteById(id);
	}
	
	@Override
	public ProdottoDto aggiornaConImg(Prodotto esistente, Prodotto aggiornato, MultipartFile img) {
		// Se esiste l'immagine da salvare 
		String fileName = StringUtils.cleanPath(img.getOriginalFilename().strip().replace(" ","-"));
				
		// Setto nome file prima di salvare il prodotto
		aggiornato.setImmagine(fileName);
		ProdottoDto dtoAggiornato = this.aggiorna(esistente, aggiornato);
		
		// Genero percorso dove salvare l'immagine
		String uploadDir = CustomProperties.IMG_FOLDER_PATH;
		
		try {
			// Converte percorso stringa in un path
			Path uploadPath = Paths.get(uploadDir);
			
			if(!Files.exists(uploadPath)) {
				// Crea cartella dove salvare l'immagine se non esiste
				Files.createDirectories(uploadPath);
			}
			try (InputStream inputStream = img.getInputStream()) {
				Path filePath = uploadPath.resolve(fileName);
				// Sovrascrive file se già presente con stesso nome
				Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
			} catch (IOException ioe) {
				throw new IOException("Could not save img file: " + fileName, ioe);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return dtoAggiornato;
	}

	@Override
	public ProdottoDto aggiorna(Prodotto prodotto, Prodotto modifiche) {
		prodotto.setNome(modifiche.getNome());
		prodotto.setDescrizione(modifiche.getDescrizione());
		prodotto.setCategoria(modifiche.getCategoria());
		prodotto.setPrezzo(modifiche.getPrezzo());
		prodotto.setRimanenza(modifiche.getRimanenza());
		prodotto.setAbilitato(modifiche.isAbilitato());
		prodotto.setVisibile(modifiche.isVisibile());
		prodotto.setImmagine(modifiche.getImmagine());
		if (modifiche.getCopieVendute() != 0) {
			prodotto.setCopieVendute(modifiche.getCopieVendute());
		}
		
		prodotto.setInizioPrevendita(modifiche.getInizioPrevendita());
		prodotto.setDataUscita(modifiche.getDataUscita());
		prodotto.setScontoPrevendita(modifiche.getScontoPrevendita());
		
		prodottoRepo.save(prodotto);
		
		return this.toProdottoDto(prodotto);
	}
	
	private ProdottoDto toProdottoDto(Prodotto prodotto) {
		ProdottoDto dto = new ProdottoDto(
				prodotto.getProdottoId(), 
				prodotto.getNome(), 
				prodotto.getDescrizione(), 
				prodotto.getCategoria(), 
				prodotto.getPrezzo(), 
				prodotto.getRimanenza(), 
				prodotto.getCopieVendute(),
				prodotto.isAbilitato(), 
				prodotto.isVisibile(),
				prodotto.getImmagine(), 
				prodotto.getInizioPrevendita(), 
				prodotto.getDataUscita(), 
				prodotto.getScontoPrevendita()
				);
		dto.setImgUrl(prodotto.getUrl()); // settiamo l'immagine nel dto con l'url composito
		return dto;
	}

}
