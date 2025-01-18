/* CREATE USER 'app_generation'@'localhost' IDENTIFIED BY 'generation_2022';
CREATE DATABASE IF NOT EXISTS `projectwork`;
GRANT ALL ON projectwork.* TO 'app_generation'@'localhost';
FLUSH PRIVILEGES; */

USE `projectwork`;

DROP TABLES utente, prodotto, ordine, ordine_dettaglio;

CREATE TABLE IF NOT EXISTS `utente` (
`utente_id` int NOT NULL AUTO_INCREMENT,
`nome` varchar(75) DEFAULT NULL,
`cognome` varchar(75) DEFAULT NULL,
`data_nascita` date DEFAULT NULL,
`email` varchar(50) NOT NULL UNIQUE,
`password` varchar(20) NOT NULL,
`ruolo` enum('ADMIN','UTENTE') NOT NULL, # (va anche bene varchar)
PRIMARY KEY (`utente_id`),
KEY `k_email` (`email`)
);

INSERT INTO `utente`(nome,cognome,data_nascita,email,password,ruolo)
VALUES ('Paolo','Rossi','1994-06-07','admin@email.com','admin','ADMIN'),
('Carlo','Verdi','2001-03-19','utente@email.com','utente','UTENTE');

CREATE TABLE IF NOT EXISTS `prodotto` (
	`prodotto_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`nome` VARCHAR(100) NOT NULL,
    `descrizione` TEXT DEFAULT NULL,
    `categoria` ENUM('NOVITA', 'PREVENDITA', 'GAMES', 'MERCH', 'ACCESSORI', 'SPECIALE', 'ALTRO') NOT NULL,
    `prezzo` DECIMAL(6,2) NOT NULL,
    `rimanenza` INT NOT NULL,
    `copie_vendute` INT DEFAULT 0,
    `abilitato` BOOLEAN DEFAULT FALSE,
    `visibile` BOOLEAN DEFAULT TRUE,
    `immagine` VARCHAR(150) DEFAULT NULL,
    `inizio_prevendita` DATE DEFAULT NULL,
	`data_uscita` DATE DEFAULT NULL,
    `sconto_prevendita` DECIMAL(4,2) DEFAULT NULL,
    `search` VARCHAR(150) AS (LOWER(REGEXP_REPLACE(nome, '[^a-zA-Z0-9]', '')))
);

CREATE TABLE IF NOT EXISTS `ordine` (
	`ordine_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `utente_id` INT NOT NULL,
    `data_ordine` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(),
    `data_consegna` DATE DEFAULT NULL,
	`stato_ordine` ENUM ('SPEDITO', 'CONSEGNATO', 'IN_LAVORAZIONE', 'CANCELLATO') DEFAULT 'IN_LAVORAZIONE',
    `indirizzo_spedizione` VARCHAR(75) NOT NULL,
    
    FOREIGN KEY (`utente_id`) REFERENCES utente(utente_id)
);

CREATE TABLE IF NOT EXISTS `ordine_dettaglio` (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`ordine_id` INT NOT NULL,
    `prodotto_id` INT NOT NULL,
    `quantita` INT NOT NULL,
    `prezzo` DECIMAL(6,2) NOT NULL,
    
    FOREIGN KEY (`ordine_id`) REFERENCES ordine(ordine_id),
    FOREIGN KEY (`prodotto_id`) REFERENCES prodotto(prodotto_id) ON DELETE CASCADE
);

INSERT INTO `prodotto` (`nome`, `descrizione`, `categoria`, `prezzo`, `rimanenza`, `copie_vendute`, `abilitato`, `visibile`, `immagine`, `inizio_prevendita`, `data_uscita`, `sconto_prevendita`) VALUES
('Yu-Gi-Oh! Starter Deck', 'Starter deck per principianti del gioco di carte collezionabili Yu-Gi-Oh!', 'PREVENDITA', 29.99, 100, 10, TRUE, TRUE, 'yugi-starter.jpg', '2025-01-01', '2025-02-01', 10.00),
('Magic: The Gathering Booster Pack', 'Bustina di carte per espandere il tuo mazzo di Magic: The Gathering.', 'PREVENDITA', 49.99, 50, 5, TRUE, TRUE, 'mtg-pack.jpg', '2025-02-01', '2025-03-01', 5.00),
('FIFA 25', 'Ultima edizione del popolare videogioco di calcio.', 'GAMES', 19.99, 200, 30, TRUE, TRUE, 'eafc25.jpeg', '2024-12-01', '2025-01-15', 15.00),
('T-Shirt Pokémon', 'Maglietta con stampa Pokémon, disponibile in varie taglie.', 'MERCH', 9.99, 150, 20, FALSE, TRUE, 'poke-shirt.jpg', NULL, NULL, NULL),
('Portamazzo MTG', 'Accessorio per conservare e trasportare i tuoi mazzi di Magic: The Gathering.', 'ACCESSORI', 14.99, 80, 12, TRUE, TRUE, 'mtg-deck-box.jpg', '2024-11-01', '2024-12-15', 10.00),
('Edizione da Collezione Cyberpunk', 'Versione speciale del gioco Cyberpunk con contenuti esclusivi.', 'SPECIALE', 99.99, 10, 1, TRUE, TRUE, '2077CE.jpg', '2024-10-01', '2025-01-20', 20.00),
('Mystery Box Anime', 'Scatola a sorpresa con gadget ispirati agli anime più famosi.', 'ALTRO', 24.99, 70, 15, FALSE, TRUE, NULL, '2024-12-10', '2025-01-10', 8.00),
('Set Pokémon Allenatore Base', 'Set base per iniziare a giocare al Gioco di Carte Collezionabili Pokémon.', 'PREVENDITA', 39.99, 90, 7, TRUE, TRUE, NULL, '2025-01-05', '2025-02-10', 12.50),
('Collezione Yu-Gi-Oh! Oro Massiccio', 'Set di carte Yu-Gi-Oh! in edizione limitata con rifiniture dorate.', 'PREVENDITA', 59.99, 40, 4, TRUE, TRUE, 'max-gold.jpg', '2025-01-15', '2025-03-15', 7.00),
('The Legend of Zelda: Tears of the Kingdom', 'Gioco d’azione e avventura per Nintendo Switch.', 'GAMES', 15.99, 300, 50, TRUE, TRUE, 'tears-of-kingdom.jpg', '2024-09-01', '2024-12-01', 5.00),
('Funko Pop Pikachu', 'Figura da collezione Funko Pop del Pokémon Pikachu.', 'MERCH', 19.99, 100, 0, TRUE, FALSE, 'funko-pika.jpg', NULL, NULL, NULL),
('Tappetino da Gioco Yu-Gi-Oh!', 'Tappetino decorato per giocare a Yu-Gi-Oh! comodamente.', 'ACCESSORI', 12.99, 60, 6, TRUE, TRUE, 'yugi-mat.jpg', '2024-08-01', '2024-11-15', 10.00),
('Set Deluxe Pokémon', 'Set speciale con carte rare e accessori esclusivi.', 'NOVITA', 89.99, 15, 2, TRUE, TRUE, 'poke-deluxe.jpg', '2024-07-01', '2025-01-20', 18.00),
('Poster Naruto', 'Poster ufficiale della serie anime Naruto.', 'ALTRO', 29.99, 75, 10, FALSE, TRUE, 'naruto-poster.jpg', '2024-12-05', '2025-01-05', 6.00),
('Pacchetto Espansione Magic: Dominaria', 'Espansione con nuove carte per il mondo di Dominaria.', 'PREVENDITA', 34.99, 85, 9, TRUE, TRUE, 'dominaria-booster.jpg', '2025-01-10', '2025-02-15', 10.50),
('Starter Pack Digimon', 'Set iniziale per il gioco di carte Digimon.', 'PREVENDITA', 64.99, 35, 3, TRUE, TRUE, 'digimon-starter.jpg', '2025-01-20', '2025-03-20', 8.00),
('Assassin’s Creed Mirage', 'Nuovo capitolo della saga di Assassin’s Creed.', 'GAMES', 17.99, 250, 45, TRUE, TRUE, 'ac-mirage.jpg', '2024-10-01', '2025-01-01', 12.00),
('Portachiavi Dragon Ball', 'Portachiavi a tema Dragon Ball con personaggi iconici.', 'MERCH', 8.99, 120, 11, FALSE, TRUE, 'db-keychain.jpg', NULL, NULL, NULL),
('Proteggi Carte Standard', 'Bustine protettive per le tue carte da gioco.', 'ACCESSORI', 11.99, 70, 8, TRUE, TRUE, 'standard-sleeves.jpg', '2024-09-15', '2024-12-20', 7.50),
('Bundle Collector Pokémon', 'Bundle con carte esclusive e oggetti da collezione.', 'NOVITA', 79.99, 20, 2, TRUE, TRUE, 'poke-collector.jpg', '2024-06-01', '2025-01-15', 15.00),
('Zaino My Hero Academia', 'Zaino con stampa del popolare anime My Hero Academia.', 'ALTRO', 22.99, 65, 12, FALSE, TRUE, 'mha-zaino.jpg', '2024-11-20', '2025-01-20', 5.00),
('Pacchetto Booster Yu-Gi-Oh! Chaos', 'Bustina booster della serie Chaos.', 'PREVENDITA', 37.99, 95, 14, TRUE, TRUE, 'yugi-chaos-booster.jpg', '2025-01-15', '2025-02-20', 11.00),
('Magic Commander Deck: Phyrexia', 'Mazzo pre-costruito Commander a tema Phyrexia.', 'PREVENDITA', 54.99, 45, 5, TRUE, TRUE, 'phyrexia-commander.jpg', '2025-01-25', '2025-03-25', 6.50),
('Final Fantasy XVI', 'Gioco di ruolo con una storia avvincente e grafica mozzafiato.', 'GAMES', 18.99, 280, 60, TRUE, TRUE, 'ff-xvi.jpg', '2024-11-01', '2025-01-10', 9.00),
('Tazza Pokémon Eevee', 'Tazza da collezione con il personaggio Eevee.', 'MERCH', 14.99, 140, 25, TRUE, TRUE, 'eevee-mug.jpg', NULL, NULL, NULL),
('Contenitore per Dadi', 'Pratico contenitore per i dadi da gioco.', 'ACCESSORI', 13.99, 50, 7, TRUE, TRUE, 'dice-box.jpg', '2024-10-15', '2024-12-25', 10.00),
('Edizione Limitata Zelda', 'Set da collezione con oggetti esclusivi a tema Zelda.', 'NOVITA', 74.99, 25, 3, TRUE, TRUE, 'zelda-collector.jpg', '2024-07-15', '2025-01-19', 14.00),
('Poster Attack on Titan', 'Poster ufficiale della serie Attack on Titan.', 'PREVENDITA', 27.99, 80, 18, FALSE, TRUE, 'poster-aot.jpg', '2024-12-25', '2025-02-01', 6.00),
('Set Iniziale KeyForge', 'Set iniziale per il gioco di carte KeyForge.', 'PREVENDITA', 32.99, 70, 11, TRUE, TRUE, 'keyforge-starter.jpg', '2025-01-10', '2025-02-25', 9.50),
('Pacchetto Digimon Booster Vol. 3', 'Bustina booster della serie Digimon Volume 3.', 'PREVENDITA', 61.99, 30, 2, TRUE, TRUE, 'digimon-pack.jpg', '2025-02-01', '2025-03-30', 7.50),
('Marvel’s Spider-Man 2', 'Gioco d’azione con Spider-Man per PlayStation 5.', 'GAMES', 20.99, 290, 55, TRUE, TRUE, 'spiderman2.jpg', '2024-09-20', '2025-01-15', 10.00),
('Felpa Naruto', 'Felpa calda e comoda con stampa Naruto.', 'MERCH', 10.99, 100, 0, FALSE, TRUE, 'naruto-felpa.jpg', NULL, NULL, NULL),
('Set Dadi da Gioco Poliedrici', 'Set completo di dadi per giochi di ruolo.', 'ACCESSORI', 15.99, 60, 8, TRUE, TRUE, 'set-dadi.jpg', '2024-08-15', '2024-11-20', 7.00),
('Bundle Collezione Magic: Eldraine', 'Set speciale con carte ed espansioni di Eldraine.', 'NOVITA', 95.99, 20, 3, TRUE, TRUE, 'eldraine-bundle.jpg', '2024-07-05', '2025-01-18', 17.00),
('Zaino Dragon Ball', 'Zaino con personaggi della serie Dragon Ball.', 'PREVENDITA', 24.99, 70, 14, FALSE, TRUE, 'db-zaino.jpg', '2024-12-01', '2025-02-10', 8.50),
('Pack Avventura D&D: Icewind Dale', 'Espansione per il gioco di ruolo Dungeons & Dragons.', 'PREVENDITA', 31.99, 85, 12, TRUE, TRUE, 'dnd-icewind.jpg', '2025-01-01', '2025-02-05', 9.00),
('Set Completo Magic: Kaldheim', 'Set completo con tutte le carte dell’espansione Kaldheim.', 'PREVENDITA', 49.99, 40, 6, TRUE, TRUE, 'kaldheim-bundle-ita.jpg', '2025-01-20', '2025-03-15', 5.50),
('Elden Ring', 'Gioco di ruolo d’azione ambientato in un mondo fantasy oscuro.', 'GAMES', 16.99, 310, 45, TRUE, TRUE, 'elden-ring.jpg', '2024-10-10', '2025-01-01', 12.00),
('Cappellino One Piece', 'Cappellino con logo della serie One Piece.', 'MERCH', 13.99, 130, 20, FALSE, TRUE, 'op-cap.jpg', NULL, NULL, NULL),
('Custodia Deck Box', 'Custodia rigida per il tuo mazzo di carte.', 'ACCESSORI', 14.49, 55, 5, TRUE, TRUE, 'deck-box.jpg', '2024-09-10', '2024-12-20', 9.50),
('Bundle Collector Final Fantasy', 'Edizione speciale con contenuti esclusivi.', 'NOVITA', 84.99, 18, 2, TRUE, TRUE, 'bundle-ff.jpg', '2024-06-20', '2025-01-20', 16.00),
('Poster Demon Slayer', 'Poster ufficiale della serie Demon Slayer.', 'PREVENDITA', 21.99, 80, 11, FALSE, TRUE, 'demon-poster.jpeg', '2024-11-15', '2025-01-20', 6.00),
('Mazzo Base Magic: Zendikar', 'Mazzo base per iniziare con l’espansione Zendikar.', 'PREVENDITA', 36.99, 90, 15, TRUE, TRUE, 'zendikar-deck.jpg', '2025-01-10', '2025-02-25', 10.00),
('Espansione Pokémon Fuoco e Ghiaccio', 'Espansione tematica per il GCC Pokémon.', 'PREVENDITA', 58.99, 30, 4, TRUE, TRUE, NULL, '2025-01-25', '2025-03-20', 5.50),
('The Legend of Zelda: Breath of the Wild - Limited Edition', 'Edizione limitata del famoso gioco d’azione e avventura per Nintendo Switch.', 'NOVITA', 99.99, 300, 50, TRUE, TRUE, 'zelda-botw-le.jpg', '2024-09-01', '2025-01-18', 5.00);

INSERT INTO `ordine` (utente_id, data_ordine, data_consegna, stato_ordine, indirizzo_spedizione) VALUES
(1, '2025-01-05 14:30:00', NULL, 'IN_LAVORAZIONE', 'Via Roma 1, Milano'),
(2, '2025-01-06 10:15:00', '2025-01-09 16:00:00', 'CONSEGNATO', 'Via Torino 12, Torino'),
(1, '2025-01-07 17:45:00', NULL, 'SPEDITO', 'Via Milano 24, Roma'),
(2, '2025-01-08 09:00:00', NULL, 'CANCELLATO', 'Via Napoli 8, Napoli'),
(1, '2025-01-09 11:20:00', NULL, 'IN_LAVORAZIONE', 'Via Venezia 3, Venezia'),
(2, '2025-01-09 13:30:00', NULL, 'SPEDITO', 'Via Firenze 5, Firenze'),
(1, '2025-01-10 08:45:00', NULL, 'IN_LAVORAZIONE', 'Via Genova 6, Genova'),
(2, '2025-01-10 12:00:00', NULL, 'SPEDITO', 'Via Bologna 9, Bologna'),
(1, '2025-01-11 15:30:00', NULL, 'SPEDITO', 'Via Trieste 4, Trieste'),
(2, '2025-01-12 18:00:00', NULL, 'IN_LAVORAZIONE', 'Via Palermo 7, Palermo'),
(1, '2025-01-17', NULL, 'SPEDITO', 'Via Roma 10, Milano'),
(1, '2024-12-18', '2025-01-18', 'CONSEGNATO', 'Via Torino 20, Milano'),
(1, '2025-01-19', NULL, 'IN_LAVORAZIONE', 'Corso Venezia 30, Milano'),
(1, '2025-01-20', NULL, 'CANCELLATO', 'Viale Monza 40, Milano'),
(1, '2025-01-19', NULL, 'SPEDITO', 'Piazza Duomo 50, Milano'),
(1, '2024-12-20', '2025-01-20', 'CONSEGNATO', 'Via Dante 60, Milano'),
(1, '2025-01-13', NULL, 'IN_LAVORAZIONE', 'Via Manzoni 70, Milano'),
(1, '2025-01-14', NULL, 'CANCELLATO', 'Via Larga 80, Milano'),
(1, '2025-01-15', NULL, 'SPEDITO', 'Via Carducci 90, Milano'),
(1, '2024-12-16', '2025-01-16', 'CONSEGNATO', 'Via San Siro 100, Milano'),
(1, '2025-01-17', NULL, 'IN_LAVORAZIONE', 'Via Vigevano 110, Milano'),
(1, '2025-01-18', NULL, 'CANCELLATO', 'Via Brera 120, Milano'),
(1, '2025-01-19', NULL, 'SPEDITO', 'Via Bovisa 130, Milano'),
(1, '2024-12-30', '2024-12-30', 'CONSEGNATO', 'Via Magenta 140, Milano'),
(1, '2025-01-01', NULL, 'IN_LAVORAZIONE', 'Via Lorenteggio 150, Milano'),
(1, '2025-01-01', NULL, 'CANCELLATO', 'Via Solari 160, Milano'),
(1, '2025-02-02', NULL, 'SPEDITO', 'Via Tortona 170, Milano'),
(1, '2024-12-03', '2025-01-03', 'CONSEGNATO', 'Via Garibaldi 180, Milano'),
(1, '2025-01-04', NULL, 'IN_LAVORAZIONE', 'Via Foppa 190, Milano'),
(1, '2025-01-05', NULL, 'CANCELLATO', 'Via Brioschi 200, Milano'),
(2, '2025-01-17', NULL, 'SPEDITO', 'Via Roma 10, Roma'),
(2, '2024-12-18', '2025-01-18', 'CONSEGNATO', 'Via Torino 20, Roma'),
(2, '2025-01-19', NULL, 'IN_LAVORAZIONE', 'Corso Venezia 30, Roma'),
(2, '2025-01-20', NULL, 'CANCELLATO', 'Viale Monza 40, Roma'),
(2, '2025-01-01', NULL, 'SPEDITO', 'Piazza Duomo 50, Roma'),
(2, '2024-12-02', '2025-01-02', 'CONSEGNATO', 'Via Dante 60, Roma'),
(2, '2025-01-13', NULL, 'IN_LAVORAZIONE', 'Via Manzoni 70, Roma'),
(2, '2025-01-14', NULL, 'CANCELLATO', 'Via Larga 80, Roma'),
(2, '2025-01-05', NULL, 'SPEDITO', 'Via Carducci 90, Roma'),
(2, '2024-12-06', '2025-01-06', 'CONSEGNATO', 'Via San Siro 100, Roma'),
(2, '2025-01-17', NULL, 'IN_LAVORAZIONE', 'Via Vigevano 110, Roma'),
(2, '2025-01-08', NULL, 'CANCELLATO', 'Via Brera 120, Roma'),
(2, '2025-01-19', NULL, 'SPEDITO', 'Via Bovisa 130, Roma'),
(2, '2024-12-30', '2024-11-30', 'CONSEGNATO', 'Via Magenta 140, Roma'),
(2, '2024-12-31', NULL, 'IN_LAVORAZIONE', 'Via Lorenteggio 150, Roma'),
(2, '2025-01-01', NULL, 'CANCELLATO', 'Via Solari 160, Roma'),
(2, '2025-01-02', NULL, 'SPEDITO', 'Via Tortona 170, Roma'),
(2, '2024-12-06', '2024-02-06', 'CONSEGNATO', 'Via Garibaldi 180, Roma'),
(2, '2025-01-04', NULL, 'IN_LAVORAZIONE', 'Via Foppa 190, Roma'),
(2, '2025-01-05', NULL, 'CANCELLATO', 'Via Brioschi 200, Roma');

INSERT INTO `ordine_dettaglio` (`ordine_id`, `prodotto_id`, `quantita`, `prezzo`) VALUES
(1, 5, 2, 15.99),(2, 3, 4, 12.75),(3, 12, 1, 19.90),(4, 8, 2, 11.25),(5, 18, 5, 4.99),(5, 6, 2, 8.75),(6, 20, 3, 6.99),(6, 1, 1, 45.00),
(7, 33, 2, 30.00),(8, 30, 1, 5.99),(9, 35, 2, 13.99),(10, 13, 3, 6.75),(11, 28, 2, 25.00),(12, 36, 4, 8.90),(13, 2, 2, 14.60),(14, 17, 5, 5.49),
(15, 16, 1, 20.00),(16, 27, 1, 29.90),(16, 38, 3, 15.75),(17, 29, 2, 9.90),(18, 39, 3, 11.75),(19, 31, 1, 28.40),(20, 41, 2, 21.99),(21, 42, 1, 16.99),
(22, 43, 1, 11.40),(23, 15, 3, 5.25),(24, 8, 1, 14.10),(24, 5, 3, 20.99),(25, 7, 1, 10.50),(26, 12, 2, 8.50),(27, 18, 2, 19.90),(28, 9, 1, 14.50),
(28, 7, 3, 11.30),(29, 21, 4, 9.99),(29, 32, 1, 16.80),(30, 4, 2, 5.50),(30, 27, 3, 12.99),(31, 14, 1, 29.30),(31, 34, 2, 8.75),(32, 16, 5, 4.99),
(33, 20, 2, 13.50),(33, 36, 3, 7.99),(34, 6, 1, 10.20),(34, 19, 4, 9.50),(35, 23, 2, 14.60),(35, 29, 3, 6.99),(36, 10, 1, 20.00),(36, 41, 2, 8.99),
(37, 22, 5, 9.75),(37, 15, 2, 17.00),(38, 30, 1, 6.49),(39, 13, 4, 9.99),(39, 2, 2, 7.50),(40, 8, 3, 11.10),(41, 35, 2, 14.99),(41, 26, 1, 22.80),
(42, 40, 3, 7.99),(42, 44, 1, 16.99),(43, 31, 4, 19.50),(43, 43, 2, 12.60),(44, 33, 1, 27.99),(44, 17, 3, 8.10),(44, 24, 2, 9.99),(44, 9, 5, 10.50),
(45, 21, 3, 15.80),(46, 35, 2, 22.50),(47, 30, 1, 10.90),(48, 31, 1, 19.90),(49, 8, 3, 7.25),(49, 17, 5, 9.99),(49, 26, 2, 14.40),(50, 44, 2, 9.50);

SELECT * FROM prodotto;
SELECT * FROM ordine;
SELECT * FROM ordine_dettaglio;

SELECT utente_id utente, COUNT(utente_id) ordini FROM ordine
GROUP BY utente;

-- Primi insert DB