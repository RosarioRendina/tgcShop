package org.generation.NerdVault.entities;

import java.time.LocalDate;

import org.generation.NerdVault.config.CustomProperties;
import org.generation.NerdVault.enums.ProdottoCategoria;

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
	
	@Column(length = 100, nullable = false)
	private String nome;
	
	@Column(nullable = false)
	private String descrizione;
	
	@Column(columnDefinition = "ENUM('NOVITA', 'PREVENDITA', 'GAMES', 'MERCH', 'ACCESSORI', 'SPECIALE', 'ALTRO')", nullable = false)
	@Enumerated(EnumType.STRING)
	private ProdottoCategoria categoria;
	
	@Column(nullable = false)
	private double prezzo;
	
	@Column(nullable = false)
	private int rimanenza;
	
	@Column(nullable = true)
	private int copieVendute;
	
	@Column(nullable = false)
	private boolean abilitato;
	
	@Column(nullable = false)
	private boolean visibile;
	
	@Column(length = 150, nullable = true)
	private String immagine;
	
	@Column(nullable = true)
	private LocalDate inizioPrevendita;
	
	@Column(nullable = true)
	private LocalDate dataUscita;
	
	@Column(nullable = true)
	private Double scontoPrevendita;
	
	/*------------------ Getters / Setters ------------------*/

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getDescrizione() {
		return descrizione;
	}

	public void setDescrizione(String descrizione) {
		this.descrizione = descrizione;
	}

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
	
	public String getUrl() {
		if (immagine == null || immagine.equals("")) {
			return "/" + CustomProperties.DEFAULT_IMG_PATH;
		}
		return "/" + CustomProperties.IMG_URL_PATH + "/" + immagine;
	}

	public String getImmagine() {
//        return immagine != null ? immagine : "/assets/img/non-disponibile.jpg";
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

	public Double getScontoPrevendita() {
	    return (scontoPrevendita != null) ? scontoPrevendita : 0.0;
//		return scontoPrevendita;
	}

	public void setScontoPrevendita(Double scontoPrevendita) {
		this.scontoPrevendita = scontoPrevendita;
	}

	public boolean isVisibile() {
		return visibile;
	}

	public void setVisibile(boolean visibile) {
		this.visibile = visibile;
	}

	public int getCopieVendute() {
		return copieVendute;
	}

	public void setCopieVendute(int copieVendute) {
		this.copieVendute = copieVendute;
	}
	
}