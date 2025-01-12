package org.generation.NerdVault.entities;

import java.sql.Date;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonInclude;

import enums.ProdottoCategoria;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "prodotto")
public class Prodotto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int prodottoId;
	
	@Column(columnDefinition = "ENUM('NOVITA', 'PREVENDITA', 'GAMES', 'MERCH', 'ACCESSORI', 'SPECIALE', 'ALTRO')", nullable = false)
	@Enumerated(EnumType.STRING)
	private ProdottoCategoria categoria;
	
	@Column(nullable = false)
	private double prezzo;
	
	@Column(nullable = false)
	private int rimanenza;
	
	@Column(nullable = false)
	private boolean abilitato;
	
	@Column(length = 75, nullable = true)
	private String immagine;
	
	@Column(nullable = true)
	private LocalDate inizioPrevendita;
	
	@Column(nullable = true)
	private LocalDate dataUscita;
	
	//@JsonInclude(JsonInclude.Include.NON_NULL)
	@Column(nullable = true)
	private Double scontoPrevendita;
	
	
	
	
	
	
	
	
	

	public int getProdottoId() {
		return prodottoId;
	}

	public void setProdottoId(int prodottoId) {
		this.prodottoId = prodottoId;
	}

	public ProdottoCategoria getCategoria() {
		return categoria;
	}

	public void setCategoria(ProdottoCategoria categoria) {
		this.categoria = categoria;
	}

	public double getPrezzo() {
		return prezzo;
	}

	public void setPrezzo(double prezzo) {
		this.prezzo = prezzo;
	}

	public int getRimanenza() {
		return rimanenza;
	}

	public void setRimanenza(int rimanenza) {
		this.rimanenza = rimanenza;
	}

	public boolean isAbilitato() {
		return abilitato;
	}

	public void setAbilitato(boolean abilitato) {
		this.abilitato = abilitato;
	}

	public String getImmagine() {
		return immagine;
	}

	public void setImmagine(String immagine) {
		this.immagine = immagine;
	}

	public LocalDate getInizioPrevendita() {
		return inizioPrevendita;
	}

	public void setInizioPrevendita(LocalDate inizioPrevendita) {
		this.inizioPrevendita = inizioPrevendita;
	}

	public LocalDate getDataUscita() {
		return dataUscita;
	}

	public void setDataUscita(LocalDate dataUscita) {
		this.dataUscita = dataUscita;
	}

	public double getScontoPrevendita() {
	    return (scontoPrevendita != null) ? scontoPrevendita : 0.0;
	}


	public void setScontoPrevendita(Double scontoPrevendita) {
		this.scontoPrevendita = scontoPrevendita;
	}
	
}
