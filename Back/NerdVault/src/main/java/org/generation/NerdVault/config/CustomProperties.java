package org.generation.NerdVault.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class CustomProperties {

	// PERCORSO CARTELLA PER SALVATAGGIO IMMAGINI
	public static final String IMG_FOLDER_PATH = "src/main/resources/static/assets/img/prodotti";
	public static final String IMG_URL_PATH = "assets/img/prodotti";
	
	public static final String DEFAULT_IMG_PATH = "assets/img/non-disponibile.jpg";
	
}
