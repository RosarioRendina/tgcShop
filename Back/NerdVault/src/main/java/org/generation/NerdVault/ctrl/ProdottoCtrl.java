package org.generation.NerdVault.ctrl;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.generation.NerdVault.config.CustomProperties;
import org.generation.NerdVault.dtos.ProdottoDto;
import org.generation.NerdVault.entities.Prodotto;
import org.generation.NerdVault.enums.ProdottoCategoria;
import org.generation.NerdVault.services.ProdottoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpSession;

// Indica che la classe è un controller e che restituirà dati (ad esempio JSON) anziché una vista HTML.
// Si combina con @RequestMapping per specificare un prefisso URL.
@RestController
@RequestMapping("/api/prodotto")
public class ProdottoCtrl {
	
	@Autowired // Utilizzi l'iniezione delle dipendenze per ottenere un'istanza di ProdottoService. Questo permette di delegare la logica di business a ProdottoService (buona pratica per separare le preoccupazioni).
	ProdottoService prodottoService;

	@GetMapping // Gestisce una richiesta HTTP GET all'URL 
	public ResponseEntity<List<ProdottoDto>> getAll() { //  Utilizzi ResponseEntity per restituire una risposta HTTP. Questo ti permette di configurare il codice di stato HTTP e l'eventuale corpo della risposta (nel tuo caso, una lista di utenti).
		try {
			List<ProdottoDto> prodotti = prodottoService.prendiTutti();
			return ResponseEntity.ok(prodotti);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().body(new ArrayList<ProdottoDto>());
		}
	}
	
	@PostMapping
	// Mappiamo una richiesta POST sull'URL base
	public ResponseEntity<?> addOne(@RequestBody Prodotto prodotto) {	// @RequestBody: richiede un JSON che rappresenta un prodotto da inserire all'interno del DB
		
		// DA IMPLEMENTARE CONTROLLO ADMIN
		try {
			ProdottoDto dto = prodottoService.aggiungi(prodotto);
			
			return ResponseEntity.ok(dto);
		} catch (DataIntegrityViolationException e) {
			return ResponseEntity.badRequest().body("Errore inserimento dati, controllare le proprietà dell'oggetto");
		}	catch (Exception e) {

			return ResponseEntity.internalServerError().body(new ProdottoDto());
		}
	}
	
	@GetMapping("/paging")
	public ResponseEntity<List<ProdottoDto>> getPaging(
				@RequestParam(defaultValue = "0") int page,
				@RequestParam(defaultValue = "10") int size,
				@RequestParam(defaultValue = "prodottoId") String sortBy,	//es: categoria
				@RequestParam(defaultValue = "ASC") String sortDirection,
				@RequestParam(required = false) String categoria
				) {
		try {
			
			Direction direction = sortDirection.equalsIgnoreCase("ASC") ? Direction.ASC : Direction.DESC;
			Sort sort = Sort.by(direction, sortBy);
			
			Pageable pageable = PageRequest.of(page, size, sort);
			
			if (categoria != null && !categoria.isEmpty()) {
				List<ProdottoDto> prodottiDto = prodottoService.prendiTuttiPagingCategoria(pageable, categoria);
				return ResponseEntity.ok(prodottiDto);
			} else {
				List<ProdottoDto> prodottiDto = prodottoService.prendiTuttiPaging(pageable);
				return ResponseEntity.ok(prodottiDto);
			}
			
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new ArrayList<ProdottoDto>());
		}
	}
	
	@PostMapping("/alt")
	// Richiesta POST su URL alternativo per la gestione immagini
	public ResponseEntity<?> addWithImage(
			@RequestPart(name = "prodotto") String prodottoJson, // Oggetto Prodotto sotto forma di stringa
			@RequestPart(name = "image", required = false) MultipartFile multipartFile, // File Immagine - (dovrebbe) poter mancare
			@RequestPart(name = "prevendita", required = false) String prevendita,
			@RequestPart(name = "dataUscita", required = false) String dataUscita
			) throws JsonMappingException, JsonProcessingException {
		
		// DA IMPLEMENTARE CONTROLLO ADMIN
		
		// Trasformo la stringa in oggetto prodotto
		ObjectMapper obMap = new ObjectMapper();
		// Ritrasformo il json in Prodotto
		Prodotto prodotto = obMap.readValue(prodottoJson, Prodotto.class);
		
		if (prevendita != null && prevendita != "") {
			System.out.println(prevendita);
			LocalDate inizioPrevendita = LocalDate.parse(prevendita);
			prodotto.setInizioPrevendita(inizioPrevendita);
			System.out.println("INIZIO PREVENDITA MODIFICATO");
		}
		
		if (dataUscita != null && dataUscita != "") {
			LocalDate uscita = LocalDate.parse(dataUscita);
			prodotto.setDataUscita(uscita);
			System.out.println("DATA USCITA MODIFICATA");
		}
		
		try {
			System.out.println("INNER TRY");
			
			if (multipartFile != null) {
				System.out.println("C'È LA FOTO");
				ProdottoDto dto = prodottoService.aggiungiConImg(prodotto, multipartFile);
				System.out.println("SALVATO");
				
				return ResponseEntity.ok(dto);
			}
			System.out.println("NON C'È LA FOTO");
			return ResponseEntity.ok(prodottoService.aggiungi(prodotto));
			
		} catch (DataIntegrityViolationException e) {
			return ResponseEntity.badRequest().body("Errore inserimento dati, controllare le proprietà dell'oggetto");
			
		} catch (Exception e) {
			return ResponseEntity.internalServerError().body(new ProdottoDto());
		}
	}
	
	@PutMapping("/alt")
	public ResponseEntity<?> modificaProdotto(
	        @RequestPart(name = "prodotto", required = false) String prodottoJson, // Oggetto Prodotto sotto forma di stringa
	        @RequestPart(name = "image", required = false) MultipartFile multipartFile, // File immagine opzionale
	        @RequestPart(name = "prevendita", required = false) String prevendita, // Data prevendita opzionale
	        @RequestPart(name = "dataUscita", required = false) String dataUscita // Data uscita opzionale
	) throws JsonMappingException, JsonProcessingException {

	    // DA IMPLEMENTARE CONTROLLO ADMIN

	    // Oggetto mapper per deserializzare il JSON (se fornito)
	    ObjectMapper obMap = new ObjectMapper();

	    // Aggiorna il prodotto esistente con i nuovi dati (se forniti)
	    Prodotto prodottoAggiornato = obMap.readValue(prodottoJson, Prodotto.class);

	    // Trova il prodotto esistente
	    Prodotto prodottoEsistente = prodottoService.cercaPerId(prodottoAggiornato.getProdottoId());
	    if (prodottoEsistente == null) {
	        return ResponseEntity.badRequest().body("Prodotto con ID " + prodottoAggiornato.getProdottoId() + " non trovato");
	    }

	    if (prevendita != null && !prevendita.isEmpty()) {
	        LocalDate inizioPrevendita = LocalDate.parse(prevendita);
	        prodottoAggiornato.setInizioPrevendita(inizioPrevendita);
	        System.out.println("INIZIO PREVENDITA MODIFICATO");
	    }

	    if (dataUscita != null && !dataUscita.isEmpty()) {
	        LocalDate uscita = LocalDate.parse(dataUscita);
	        prodottoAggiornato.setDataUscita(uscita);
	        System.out.println("DATA USCITA MODIFICATA");
	    }

	    try {
	        // Aggiorna il prodotto con o senza immagine
	        if (multipartFile != null) {
	            System.out.println("C'È UNA NUOVA FOTO");
	            ProdottoDto dto = prodottoService.aggiornaConImg(prodottoEsistente, prodottoAggiornato, multipartFile);
	            return ResponseEntity.ok(dto);
	        }

	        // Salvataggio senza immagine
	        ProdottoDto dto = prodottoService.aggiorna(prodottoEsistente, prodottoAggiornato);
	        return ResponseEntity.ok(dto);

	    } catch (DataIntegrityViolationException e) {
	        return ResponseEntity.badRequest().body("Errore durante la modifica dei dati, controllare le proprietà dell'oggetto");

	    } catch (Exception e) {
	        return ResponseEntity.internalServerError().body("Errore interno durante la modifica del prodotto");
	    }
	}

	
	@GetMapping("/{id}")
	// Questa annotazione mappa una richiesta GET con un parametro dinamico nell'URL, rappresentato da {id}. In questo caso, l'ID dell'prodotto viene estratto dal percorso dell'URL e passato al metodo tramite @PathVariable.
	public ResponseEntity<ProdottoDto> getById(@PathVariable int id) { // @PathVariable: Mappa il valore {id} dall'URL al parametro del metodo.
		try {
			ProdottoDto prodotto = prodottoService.cercaPerIdDto(id); // ProdottoService: È chiamato per ottenere i dati necessari.
			if (prodotto != null) {
				return ResponseEntity.ok(prodotto);
			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ProdottoDto());
			}
		} catch (Exception e) {
			return ResponseEntity.internalServerError().body(new ProdottoDto());
		}
	}
	
	@PutMapping
    public ResponseEntity<?> updateOne(@RequestBody Prodotto prodotto, HttpSession session) {
        try {
            Prodotto trovato = prodottoService.cercaPerId(prodotto.getProdottoId());

            if (trovato != null) {
                // Se data_uscita è presente, gestita automaticamente da LocalDate
//                trovato.setDataUscita(prodotto.getDataUscita());
                ProdottoDto dto = prodottoService.aggiorna(trovato, prodotto);
                return ResponseEntity.ok(dto);
            } else {
                return ResponseEntity.badRequest().body("Errore: prodotto non trovato");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(new Prodotto());
        }
    }
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteById(@PathVariable int id, HttpSession session) {
		// DA IMPLEMENTARE CONTROLLO ADMIN
		try {
//			UtenteDto curr = (UtenteDto) session.getAttribute("currentUser");
//			if (curr != null && curr.getRuolo() == UtenteRuolo.ADMIN) {
			
				Prodotto trovato = prodottoService.cercaPerId(id);
				if (trovato != null) {
					
					try {	// Cancello Immagini e Cartella
						String dir = CustomProperties.IMG_FOLDER_PATH + "/" + trovato.getProdottoId();
						
						if (Files.exists(Paths.get(dir))) {
							FileUtils.deleteDirectory(new File(dir));
						}
					} catch (IOException e) {
						e.printStackTrace();
					}
					
					prodottoService.cancellaProdotto(id);
					return ResponseEntity.ok("Cancellato prodotto id = " + id);
				}
				return ResponseEntity.badRequest().body("Errore: prodotto non trovato");
//			} else {
//				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Non sei autorizzato a visualizzare questa pagina");
//			}
				
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().body(new ProdottoDto()); // 500
		}
	}
	
	@GetMapping("/categoria/{c}")
	// Mappiamo una richiesta GET con parametro dinamico {c} che sarà una stringa che rappresenta la categoria
	public ResponseEntity<List<ProdottoDto>> getByCategoria(@PathVariable String c) {
		try {
			String cat = c.toUpperCase().trim();
			// Trasformo la stringa in maiuscolo così che il valore eguagli quello dell'enum ProdottoCategoria
			List<ProdottoDto> prodotti = prodottoService.cercaPerCategoria(ProdottoCategoria.valueOf(cat));
			// Se il valore della stringa fa parte dell'enum, procede ritornando la lista dei prodotti appartenenti a tale categoria.
			
			return ResponseEntity.ok(prodotti);
			
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(new ArrayList<ProdottoDto>());
		}
		
	}
	
}
