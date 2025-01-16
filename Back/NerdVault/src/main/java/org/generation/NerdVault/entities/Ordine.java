package org.generation.NerdVault.entities;

import java.time.LocalDate;

import org.generation.NerdVault.enums.OrdineStato;
import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Ordine {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int ordineId;
	
	@ManyToOne
	@JoinColumn(name = "utente_id", nullable = false)
	private Utente utente;
	
	@CreationTimestamp
	@Column(nullable = true)
	private LocalDate dataOrdine;
	
	@Column(nullable = true)
	private LocalDate dataConsegna;
	
	@Column(columnDefinition = "ENUM('SPEDITO', 'CONSEGNATO', 'IN_LAVORAZIONE', 'CANCELLATO')")
	@Enumerated(EnumType.STRING)
	private OrdineStato statoOrdine;
	
	@Column(length = 75, nullable = false)
	private String indirizzoSpedizione;
	
	/*------------------ Getters / Setters ------------------*/

	public int getOrdineId() {
		return ordineId;
	}

	public void setOrdineId(int ordineId) {
		this.ordineId = ordineId;
	}

	public Utente getUtente() {
		return utente;
	}

	public void setUtente(Utente utente) {
		this.utente = utente;
	}

	public LocalDate getDataOrdine() {
		return dataOrdine;
	}

	public void setDataOrdine(LocalDate dataOrdine) {
		this.dataOrdine = dataOrdine;
	}

	public LocalDate getDataConsegna() {
		return dataConsegna;
	}

	public void setDataConsegna(LocalDate dataConsegna) {
		this.dataConsegna = dataConsegna;
	}

	public OrdineStato getStatoOrdine() {
		return statoOrdine;
	}

	public void setStatoOrdine(OrdineStato statoOrdine) {
		this.statoOrdine = statoOrdine;
	}

	public String getIndirizzoSpedizione() {
		return indirizzoSpedizione;
	}

	public void setIndirizzoSpedizione(String indirizzoSpedizione) {
		this.indirizzoSpedizione = indirizzoSpedizione;
	}
	
}
