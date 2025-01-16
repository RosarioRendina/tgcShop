package org.generation.NerdVault.ctrl;

import java.util.ArrayList;
import java.util.List;

import org.generation.NerdVault.dtos.OrdineDettaglioDto;
import org.generation.NerdVault.entities.Ordine;
import org.generation.NerdVault.entities.OrdineDettaglio;
import org.generation.NerdVault.entities.Prodotto;
import org.generation.NerdVault.services.OrdineDettaglioService;
import org.generation.NerdVault.services.OrdineService;
import org.generation.NerdVault.services.ProdottoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/details")
public class OrdineDettaglioCtrl {

	@Autowired
	OrdineDettaglioService dettaglioSrv;
	
	@Autowired
	OrdineService ordineSrv;
	
	@Autowired
	ProdottoService prodottoSrv;
	
	@GetMapping
	public ResponseEntity<List<OrdineDettaglioDto>> getAll() {
		try {
			List<OrdineDettaglioDto> details = dettaglioSrv.prendiTutti();
			return ResponseEntity.ok(details);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().body(new ArrayList<OrdineDettaglioDto>());
		}
	}
	
	@PostMapping
	public ResponseEntity<?> creaDetail(@RequestBody OrdineDettaglioDto dto) {
		try {
			Ordine ord = null;
			if (dto.getOrdine() == null) {
				ord = ordineSrv.getById(dto.getOrdineId());
			} else {
				ord = ordineSrv.getById(dto.getOrdine().getOrdineId());
			}
			Prodotto prod = null;
			if (dto.getProdotto() == null) {
				prod = prodottoSrv.cercaPerId(dto.getProdottoId());
			} else {
				prod = prodottoSrv.cercaPerId(dto.getProdotto().getProdottoId());
			}
			dto.setOrdine(ord);
			dto.setProdotto(prod);
			
			OrdineDettaglioDto insert = dettaglioSrv.aggiungi(dto);
			
			return ResponseEntity.ok(insert);
			
		} catch (DataIntegrityViolationException e) {
			return ResponseEntity.badRequest().body("Errore inserimento dati. Controlla che il dto contenga Ordine e Prodotto oppure OrdineId e ProdottoId");
			
		} catch (Exception e) {
			return ResponseEntity.internalServerError().body(new OrdineDettaglioDto());
		}
	}
	
	@GetMapping("/{ordineId}")
	public ResponseEntity<List<OrdineDettaglioDto>> getAllByOrdineId(@PathVariable int ordineId) {
		try {
			List<OrdineDettaglioDto> details = dettaglioSrv.prendiDtoConOrdineId(ordineId);
			return ResponseEntity.ok(details);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().body(new ArrayList<OrdineDettaglioDto>());
		}
	}
	
	@DeleteMapping("/{ordineId}")
	public ResponseEntity<?> cancellaDetails(@PathVariable int ordineId) {
		try {
			List<OrdineDettaglioDto> details = dettaglioSrv.prendiDtoConOrdineId(ordineId);
			if (details.size() != 0) {
				dettaglioSrv.cancella(ordineId);
				return ResponseEntity.ok("Dettagli eliminati correttamente");
			} else {
				return ResponseEntity.badRequest().body("Non esistono dettagli associati a quell'ordine");
			}
			
		} catch (Exception e) {
			return ResponseEntity.internalServerError().body(new OrdineDettaglioDto());
		}
		
	}
	
	@PutMapping("/{ordineId}")
	public ResponseEntity<?> modificaDetails(@PathVariable int ordineId, @RequestBody OrdineDettaglioDto dto) {
		
		try {
			List<OrdineDettaglio> details = dettaglioSrv.prendiConOrdineId(ordineId);
		
			if (details.size() != 0) {
				Prodotto daTrovare;
				if (dto.getProdotto() != null) {
					daTrovare = prodottoSrv.cercaPerId(dto.getProdotto().getProdottoId());
				} else {
					daTrovare = prodottoSrv.cercaPerId(dto.getProdottoId());
				}
					
					for (OrdineDettaglio dettaglio : details) {
						if (dettaglio.getProdotto() == daTrovare) {
							OrdineDettaglioDto inserito = dettaglioSrv.modifica(dettaglio, dto);
							return ResponseEntity.ok(inserito);
						}
					}
				
				return ResponseEntity.badRequest().body("Impossibile trovare l'ordine dettaglio");
			
			} else {
				return ResponseEntity.badRequest().body("Non esistono dettagli associati a quell'ordine");
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().body(new OrdineDettaglioDto());
		}
	}
	
}
