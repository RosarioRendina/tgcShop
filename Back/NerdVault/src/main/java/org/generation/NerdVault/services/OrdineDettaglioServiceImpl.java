package org.generation.NerdVault.services;

import java.util.ArrayList;
import java.util.List;

import org.generation.NerdVault.dtos.OrdineDettaglioDto;
import org.generation.NerdVault.entities.OrdineDettaglio;
import org.generation.NerdVault.enums.ProdottoCategoria;
import org.generation.NerdVault.repositories.OrdineDettaglioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrdineDettaglioServiceImpl implements OrdineDettaglioService {

	@Autowired
	OrdineDettaglioRepository ordineRepo;
	
	@Autowired
	OrdineService ordineSrv;
	
	@Autowired
	ProdottoService prodottoSrv;
	
	@Override
	public List<OrdineDettaglioDto> prendiTutti() {
		List<OrdineDettaglio> details = ordineRepo.findAll();
		ArrayList<OrdineDettaglioDto> dtos = new ArrayList<OrdineDettaglioDto>();
		details.forEach(dto -> dtos.add(this.toOrdineDettaglioDto(dto)));
		return dtos;
	}
	
	@Override
	public List<OrdineDettaglio> prendiConOrdineId(int ordineId) {
		List<OrdineDettaglio> details = ordineRepo.findAllByOrdine_OrdineId(ordineId);
		return details;
	}
	
	@Override
	public List<OrdineDettaglioDto> prendiDtoConOrdineId(int ordineId) {
		List<OrdineDettaglio> details = ordineRepo.findAllByOrdine_OrdineId(ordineId);
		ArrayList<OrdineDettaglioDto> dtos = new ArrayList<OrdineDettaglioDto>();
		details.forEach(dto -> dtos.add(this.toOrdineDettaglioDto(dto)));
		return dtos;
	}
	
	@Override
	public OrdineDettaglioDto aggiungi(OrdineDettaglioDto dto) {
		OrdineDettaglio det = new OrdineDettaglio();
		if (dto.getOrdine() != null) {
			det.setOrdine(dto.getOrdine());
		} else {
			det.setOrdine(ordineSrv.getById(dto.getOrdineId()));
		}
		
		if (dto.getProdotto() != null) {
			det.setProdotto(dto.getProdotto());
		} else {
			det.setProdotto(prodottoSrv.cercaPerId(dto.getProdottoId()));
		}
					
		double prezzo = det.getProdotto().getPrezzo();
		if (dto.getProdotto().getCategoria() == ProdottoCategoria.PREVENDITA) {
			prezzo *= 1 - (dto.getProdotto().getScontoPrevendita() / 100);
		}
				
		det.setQuantita(dto.getQuantita());
		det.setPrezzo(prezzo * dto.getQuantita());
		
		ordineRepo.save(det);
				
		return this.toOrdineDettaglioDto(det);
	}
	
	@Override
	public OrdineDettaglioDto modifica(OrdineDettaglio details, OrdineDettaglioDto modifiche) {
		if (modifiche.getOrdine() != null) {
			details.setOrdine(modifiche.getOrdine());
		} else {
			details.setOrdine(ordineSrv.getById(modifiche.getOrdineId()));
		}
		if (modifiche.getProdotto() != null) {
			details.setProdotto(modifiche.getProdotto());
		} else {
			details.setProdotto(prodottoSrv.cercaPerId(modifiche.getProdottoId()));
		}
		
		details.setQuantita(modifiche.getQuantita());
		
		boolean modificaPrezzo = modifiche.getPrezzo() != 0.0;
		
		double prezzo = modificaPrezzo ? modifiche.getPrezzo() : details.getProdotto().getPrezzo();
		if (modifiche.getProdotto().getCategoria() == ProdottoCategoria.PREVENDITA) {
			System.out.println("SCONTO APPLICATO");
			prezzo -= (prezzo * (details.getProdotto().getScontoPrevendita())) / 100;
		}
		details.setPrezzo(prezzo * details.getQuantita());
		
		ordineRepo.save(details);
		return this.toOrdineDettaglioDto(details);
	}
	
	@Override
	public void cancella(int ordineId) {
		List<OrdineDettaglio> details = ordineRepo.findAllByOrdine_OrdineId(ordineId);
		details.forEach(det -> ordineRepo.delete(det));
	}
	
	private OrdineDettaglioDto toOrdineDettaglioDto(OrdineDettaglio details) {
		OrdineDettaglioDto odd = new OrdineDettaglioDto(
				details.getOrdine().getOrdineId(),
				details.getProdotto().getProdottoId(),
				details.getQuantita(),
				details.getPrezzo()
				);
		odd.setOrdine(details.getOrdine());
		odd.setProdotto(details.getProdotto());
				
		return odd;
	}
}

