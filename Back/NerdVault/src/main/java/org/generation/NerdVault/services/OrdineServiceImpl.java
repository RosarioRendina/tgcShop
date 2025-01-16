package org.generation.NerdVault.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.generation.NerdVault.dtos.OrdineDto;
import org.generation.NerdVault.entities.Ordine;
import org.generation.NerdVault.enums.OrdineStato;
import org.generation.NerdVault.repositories.OrdineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrdineServiceImpl implements OrdineService{
	
	@Autowired
	public OrdineRepository ordineRepo;
	@Autowired
	public UtenteService utenteService;

	@Override
	public List<OrdineDto> prendiTutti() {
		ArrayList<OrdineDto> dtos = new ArrayList<OrdineDto>();
		List<Ordine> ordini = ordineRepo.findAll();
		ordini.forEach(ordine -> dtos.add(this.toOrdineDto(ordine)));
		return dtos;
	}

	@Override
	public OrdineDto prendiConId(int id) {
		Optional<Ordine> ordine = ordineRepo.findById(id);
		if(ordine.isPresent()) {
			return this.toOrdineDto(ordine.get());
		} else {
			return new OrdineDto();
		}
	}
	
	@Override
	public Ordine getById(int id) {
		return ordineRepo.findById(id).get();
	}
	
	@Override
	public List<OrdineDto> prendiConUtenteId(int utenteId) {
		ArrayList<OrdineDto> dtos = new ArrayList<OrdineDto>();
		List<OrdineDto> result = prendiTutti();
		result.forEach(ordine -> {
					if (ordine.getUtente().getUtenteId() == utenteId) {
						dtos.add(ordine);
					}
		});
		return dtos;
	}
	
	public OrdineDto aggiungi(OrdineDto dto) {
		Ordine ordine = new Ordine();
		ordine.setOrdineId(dto.getOrdineId());
		ordine.setUtente(dto.getUtente());
		ordine.setDataOrdine(dto.getDataOrdine());
		ordine.setDataConsegna(dto.getDataConsegna());
		ordine.setStatoOrdine(dto.getStatoOrdine());
		ordine.setIndirizzoSpedizione(dto.getIndirizzoSpedizione());
		ordineRepo.save(ordine);
		return this.toOrdineDto(ordine);
	}
	
	public OrdineDto aggiorna(Ordine daModificare, OrdineDto ordine) {
		if (ordine.getUtente() != null) {
			daModificare.setUtente(ordine.getUtente());
		}
		if (ordine.getDataOrdine() != null) {
			daModificare.setDataOrdine(ordine.getDataOrdine());
		}
		daModificare.setDataConsegna(ordine.getDataConsegna());
		daModificare.setStatoOrdine(ordine.getStatoOrdine());
		if (ordine.getIndirizzoSpedizione() != null) {
			daModificare.setIndirizzoSpedizione(ordine.getIndirizzoSpedizione());
		}
		
		
		ordineRepo.save(daModificare);
		
		return this.toOrdineDto(daModificare);
	}
	
	public void cancellaOrdine(int id) {
		Optional<Ordine> ordine = ordineRepo.findById(id);
		if(ordine.isPresent()) {
			ordine.get().setStatoOrdine(OrdineStato.CANCELLATO);
		}
	}
	
	private OrdineDto toOrdineDto(Ordine ordine) {
		OrdineDto dto = new OrdineDto(
				ordine.getOrdineId(),
				ordine.getDataOrdine(),
				ordine.getDataConsegna(),
				ordine.getStatoOrdine(),
				ordine.getIndirizzoSpedizione()
				);
		dto.setUtente(ordine.getUtente());
		
		return dto;
	}

}
