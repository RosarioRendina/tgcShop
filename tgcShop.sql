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

INSERT INTO `prodotto` (`nome`, `descrizione`, `categoria`, `prezzo`, `rimanenza`, `copie_vendute`, `abilitato`, `visibile`, `immagine`, `inizio_prevendita`, `data_uscita`, `sconto_prevendita`)
VALUES
('Yu-Gi-Oh! Booster Pack: Ancient Prophecy', 'Un set di carte per il gioco Yu-Gi-Oh! con potenti mostri ed effetti.', 'NOVITA', 8.99, 500, 0, TRUE, TRUE, 'yugi-ancient-prophecy.jpg', '2025-01-15', '2025-01-30', 15),
('Magic: The Gathering - Draft Booster Set Dominaria', 'Draft booster set dedicato al mondo di Dominaria.', 'NOVITA', 74.49, 300, 0, TRUE, TRUE, 'mtg-draft-dominaria.jpg', '2025-01-10', '2025-01-25', 10),
('Munchkin Deluxe', 'Gioco da tavolo basato su carte, perfetto per il divertimento in gruppo.', 'GAMES', 24.99, 150, 30, TRUE, TRUE, 'munchkin-deluxe.jpg', NULL, NULL, NULL),
('Portadeck Yu-Gi-Oh!', 'Portadeck ufficiale per le carte Yu-Gi-Oh!', 'ACCESSORI', 12.99, 100, 20, TRUE, TRUE, 'yugi-off-deckbox.jpg', NULL, NULL, NULL),
('Tappetino da gioco Magic: The Gathering', 'Tappetino premium per partite di Magic.', 'MERCH', 19.99, 80, 10, TRUE, TRUE, 'mtg-mat.jpg', NULL, NULL, NULL),
('Magic: The Gathering - Set Booster Kaldheim', 'Set booster ispirato al tema nordico di Kaldheim.', 'NOVITA', 75.49, 250, 0, TRUE, TRUE, 'mtg-kaldheim.png', '2025-01-18', '2025-02-02', 12),
('Yu-Gi-Oh! Structure Deck: Soulburner', 'Structure deck dedicato al mazzo Soulburner.', 'PREVENDITA', 14.99, 10, 0, TRUE, TRUE, 'yugi-soulburner.jpg', '2025-01-20', '2025-02-15', 20),
('Munchkin Espansione: Bites!', 'Espansione per il gioco Munchkin a tema horror.', 'GAMES', 14.99, 120, 15, TRUE, TRUE, 'munchkin-bites.jpg', NULL, NULL, NULL),
('Buste Protettive Ultra-Pro (60pz)', 'Buste protettive per carte collezionabili.', 'ACCESSORI', 8.99, 500, 50, TRUE, TRUE, 'ultra-pro-sleeves.jpg', NULL, NULL, NULL),
('Poster Yu-Gi-Oh! Dark Magician', 'Poster esclusivo raffigurante il Mago Nero.', 'MERCH', 9.99, 60, 5, TRUE, TRUE, 'yugi-magonero-poster.jpg', NULL, NULL, NULL),
('Magic: The Gathering - Bundle Set Kamigawa: Neon Dynasty', 'Bundle completo con 10 booster pack e accessori.', 'NOVITA', 39.99, 100, 0, TRUE, TRUE, 'kamigawa-set.png', '2025-01-25', '2025-02-10', 15),
('Yu-Gi-Oh! Collector’s Tin 2025', 'Scatola da collezione con carte esclusive.', 'ALTRO', 89.99, 200, 0, TRUE, TRUE, 'yugi-collectors-tin.png', NULL, NULL, NULL),
('Magic: The Gathering - Secret Lair Drop Series', 'Edizione speciale di carte esclusive.', 'SPECIALE', 49.99, 0, 10, TRUE, TRUE, 'mtg-secretlair.png', NULL, NULL, NULL),
('Magic: The Gathering - Booster Innistrad Midnight Hunt', 'Booster pack tematico sulla caccia notturna.', 'NOVITA', 74.99, 400, 0, TRUE, TRUE, 'mtg-innistrad-box.png', '2025-02-01', '2025-02-15', 10),
('Zaino Yu-Gi-Oh! GX', 'Zaino esclusivo a tema GX.', 'MERCH', 34.99, 30, 5, TRUE, TRUE, 'jaiden-zaino.jpg', NULL, NULL, NULL),
('Portadadi Magic: The Gathering', 'Portadadi ufficiale di Magic.', 'ACCESSORI', 11.99, 200, 15, TRUE, TRUE, 'mtg-portadadi.png', NULL, NULL, NULL),
('T-Shirt Pokémon', 'Maglietta con stampa Pokémon, disponibile in varie taglie.', 'MERCH', 14.99, 150, 20, FALSE, TRUE, 'poke-shirt.jpg', NULL, NULL, NULL),
('Collezione Yu-Gi-Oh! Oro Massiccio', 'Set di carte Yu-Gi-Oh! in edizione limitata con rifiniture dorate.', 'PREVENDITA', 59.99, 40, 4, TRUE, TRUE, 'max-gold.jpg', '2025-01-15', '2025-03-15', 7.00),
('Funko Pop Pikachu', 'Figura da collezione Funko Pop del Pokémon Pikachu.', 'MERCH', 19.99, 100, 0, TRUE, FALSE, 'funko-pika.jpg', NULL, NULL, NULL),
('Tappetino da Gioco Yu-Gi-Oh!', 'Tappetino decorato per giocare a Yu-Gi-Oh! comodamente.', 'ACCESSORI', 12.99, 60, 6, TRUE, TRUE, 'yugi-mat.jpg', '2024-08-01', '2024-11-15', 10.00),
('Pacchetto Espansione Magic: Dominaria', 'Espansione con nuove carte per il mondo di Dominaria.', 'PREVENDITA', 34.99, 85, 9, TRUE, TRUE, 'dominaria-booster.jpg', '2025-01-10', '2025-02-15', 10.50),
('Starter Pack Digimon', 'Set iniziale per il gioco di carte Digimon.', 'PREVENDITA', 64.99, 35, 3, TRUE, TRUE, 'digimon-starter.jpg', '2025-01-20', '2025-03-20', 8.00),
('Pacchetto Booster Yu-Gi-Oh! Chaos', 'Bustina booster della serie Chaos.', 'PREVENDITA', 37.99, 95, 14, TRUE, TRUE, 'yugi-chaos-booster.jpg', '2025-01-15', '2025-02-20', 11.00),
('Magic Commander Deck: Phyrexia', 'Mazzo pre-costruito Commander a tema Phyrexia.', 'PREVENDITA', 54.99, 45, 5, TRUE, TRUE, 'phyrexia-commander.jpg', '2025-01-25', '2025-03-25', 6.50),
('Set Dadi da Gioco Poliedrici', 'Set completo di dadi per giochi di ruolo.', 'ACCESSORI', 15.99, 60, 8, TRUE, TRUE, 'set-dadi.jpg', '2024-08-15', '2024-11-20', 7.00),
('Magic: The Gathering - Challenger Deck 2025', 'Mazzo pronto all’uso per sfide competitive.', 'PREVENDITA', 29.99, 180, 0, TRUE, TRUE, NULL, '2025-02-05', '2025-03-01', 18),
('Espansione Munchkin: 5, 6 e 7 Tutti i Mostri Fatti a Fette', 'Nuova espansione per Munchkin con carte aggiuntive.', 'GAMES', 16.99, 100, 8, TRUE, TRUE, 'munchkin-567.jpg', NULL, NULL, NULL),
('Yu-Gi-Oh! Legendary Duelists: Season 4', 'Set leggendario di carte.', 'ALTRO', 21.99, 300, 0, TRUE, TRUE, 'yugi-ledu.jpg', NULL, NULL, NULL),
('Portafoglio Yu-Gi-Oh! Millennium Items', 'Portafoglio con design ispirato agli oggetti del millennio.', 'MERCH', 18.99, 50, 5, TRUE, TRUE, 'yugi-wallet.jpg', NULL, NULL, NULL),
('Magic: The Gathering - Deck Box Premium', 'Scatola di alta qualità per mazzi Magic.', 'ACCESSORI', 15.99, 150, 20, TRUE, TRUE, 'mtg-deck-box.jpg', NULL, NULL, NULL),
('Set Completo Magic: Adventures in the Forgotten Realms', 'Set completo di carte ispirato ai Forgotten Realms.', 'NOVITA', 89.99, 50, 0, TRUE, TRUE, 'mtg-fr-set.jpg', NULL, NULL, NULL),
('T-Shirt Yu-Gi-Oh! Exodia', 'T-shirt esclusiva con Exodia.', 'MERCH', 22.99, 25, 3, TRUE, TRUE, 'tshirt-exodia.jpg', NULL, NULL, NULL),
('Set Protettivo Magic: The Gathering', 'Set completo per proteggere le carte Magic.', 'ACCESSORI', 29.99, 100, 10, TRUE, TRUE, 'mtg-apex-sleeves.png', NULL, NULL, NULL),
('Munchkin: Collector’s Box', 'Scatola da collezione per il gioco Munchkin.', 'ALTRO', 34.99, 40, 0, TRUE, TRUE, 'munchkin-bigbox.png', NULL, NULL, NULL),
('Poster Magic: Black Lotus', 'Poster esclusivo della carta Black Lotus.', 'MERCH', 14.99, 30, 5, TRUE, TRUE, 'blotus-poster.jpg', NULL, NULL, NULL),
('Yu-Gi-Oh! Speed Duel: Duel Academy Box', 'Set per duelli veloci a tema Duel Academy.', 'NOVITA', 39.99, 200, 0, TRUE, TRUE, 'yugi-academybox.jpg', NULL, NULL, NULL),
('Magic: The Gathering - Collector Booster Neon Dynasty', 'Booster speciale con carte rare ed esclusive.', 'SPECIALE', 59.99, 70, 10, TRUE, TRUE, 'neon-dynasty.jpg', NULL, NULL, NULL),
('Borsa Porta-Mazzi Yu-Gi-Oh!', 'Borsa ufficiale per trasportare i mazzi.', 'ACCESSORI', 24.99, 80, 12, TRUE, TRUE, 'borsa-porta-mazzi.jpg', NULL, NULL, NULL),
('Espansione Magic: Unstable', 'Espansione speciale con carte uniche e divertenti.', 'ALTRO', 29.99, 100, 0, TRUE, TRUE, 'mtg-unstable-booster.jpg', NULL, NULL, NULL),
('Booster Pack Yu-Gi-Oh! Hidden Arsenal', 'Pacchetto con carte nascoste.', 'NOVITA', 3.99, 400, 0, TRUE, TRUE, 'yugi-hiddenarsenal.jpg', NULL, NULL, NULL),
('Yu-Gi-Oh! Starter Deck', 'Starter deck per principianti del gioco di carte collezionabili Yu-Gi-Oh!', 'PREVENDITA', 29.99, 100, 10, TRUE, TRUE, 'yugi-starter.jpg', '2025-01-01', '2025-02-01', 10.00),
('Tappetino Yu-Gi-Oh! Millennium Puzzle', 'Tappetino esclusivo con Puzzle del Millennio.', 'MERCH', 19.99, 60, 5, TRUE, TRUE, 'yugi-millennium-mat.png', NULL, NULL, NULL),
('Magic: The Gathering - Premium Card Sleeves', 'Buste protettive premium per Magic.', 'ACCESSORI', 12.99, 150, 20, TRUE, TRUE, 'mtg-premium-sleeves.png', NULL, NULL, NULL),
('Pokémon Booster Pack: Scarlet & Violet', 'Un set di carte collezionabili della serie Pokémon Scarlet & Violet.', 'NOVITA', 5.99, 600, 0, TRUE, TRUE, 'poke-scvio-booster.png', '2025-01-10', '2025-01-25', 10),
('KeyForge - Call of the Archons Starter Set', 'Gioco di carte unico dove ogni mazzo è diverso.', 'GAMES', 24.99, 200, 20, TRUE, TRUE, 'keyforge-archon-starter.jpg', NULL, NULL, NULL),
('Flesh and Blood: Monarch Booster Pack', 'Pacchetto di espansione per Flesh and Blood: Monarch.', 'NOVITA', 3.99, 400, 0, TRUE, TRUE, 'fab-monarch-booster.jpg', '2025-01-20', '2025-02-01', 15),
('Pokémon Elite Trainer Box: Evolving Skies', 'Scatola con accessori e carte della serie Evolving Skies.', 'PREVENDITA', 49.99, 300, 0, TRUE, TRUE, 'poke-evoskies-tbox.jpg', '2025-01-15', '2025-01-30', 20),
('Pacchetto Digimon Booster Vol. 3', 'Bustina booster della serie Digimon Volume 3.', 'PREVENDITA', 61.99, 30, 2, TRUE, TRUE, 'digimon-pack.jpg', '2025-02-01', '2025-03-30', 7.50),
('Digimon Card Game: Booster Battle of Omni', 'Set di carte per il gioco Digimon.', 'NOVITA', 34.99, 500, 0, TRUE, TRUE, 'digimon-omnibattle.png', '2025-01-18', '2025-02-05', 10),
('Star Wars: Destiny Two-Player Game', 'Gioco di carte basato sull’universo di Star Wars.', 'GAMES', 29.99, 120, 10, TRUE, TRUE, 'sw-destiny.jpg', NULL, NULL, NULL),
('Final Fantasy TCG: Starter Set Cloud vs. Sephiroth', 'Set iniziale per il gioco di carte Final Fantasy.', 'GAMES', 19.99, 200, 15, TRUE, TRUE, 'ff-cloud-vs-sephiroth.jpg', NULL, NULL, NULL),
('Pokémon Tappetino: Pikachu VMAX', 'Tappetino da gioco con illustrazione di Pikachu VMAX.', 'MERCH', 19.99, 100, 10, TRUE, TRUE, 'poke-pika-vmax-mat.jpg', NULL, NULL, NULL),
('Dragon Shield: Sleeves Opachi Nero (100pz)', 'Buste protettive premium per carte.', 'ACCESSORI', 12.99, 300, 30, TRUE, TRUE, 'dragonshield-sleeves.jpg', NULL, NULL, NULL),
('Force of Will: Alice Cluster Booster Pack', 'Pacchetto di espansione per il gioco Force of Will.', 'ALTRO', 3.99, 250, 0, TRUE, TRUE, 'fow-booster.jpg', NULL, NULL, NULL),
('Yu-Gi-Oh! Duel Disk 2025', 'Replica del Duel Disk di Yu-Gi-Oh!', 'MERCH', 79.99, 50, 5, TRUE, TRUE, 'yugi-dueldisk.jpg', NULL, NULL, NULL),
('KeyForge: Worlds Collide Booster Deck', 'Mazzo unico per KeyForge Worlds Collide.', 'NOVITA', 59.99, 100, 0, TRUE, TRUE, 'keyforge-booster.jpg', '2025-01-22', '2025-02-01', 10),
('Dragon Ball Super Card Game: Vermillion Bloodline', 'Booster pack del gioco di carte Dragon Ball Super.', 'NOVITA', 14.49, 500, 0, TRUE, TRUE, 'dbs-vermillion.png', '2025-01-28', '2025-02-10', 08),
('Pokémon Collector Chest: Charizard Edition', 'Scatola da collezione con Charizard.', 'SPECIALE', 89.99, 200, 0, TRUE, TRUE, 'poke-collecor-charizard.png', NULL, NULL, NULL),
('Buste Protettive Pokémon (50pz)', 'Buste con design esclusivo Pokémon.', 'ACCESSORI', 9.99, 300, 40, TRUE, TRUE, 'poke-sleeves.jpg', NULL, NULL, NULL),
('Dragon Shield: Deck Box Nero', 'Scatola per mazzi fino a 100 carte.', 'ACCESSORI', 10.99, 150, 20, TRUE, TRUE, 'dragonshield-deckbox.jpg', NULL, NULL, NULL),
('Force of Will: Valhalla Cluster Starter Deck', 'Mazzo iniziale del Cluster Valhalla.', 'GAMES', 16.99, 120, 10, TRUE, TRUE, 'fow-valhalla-starter.jpg', NULL, NULL, NULL),
('Pokémon Mega Tappetino: Eevee Evolutions', 'Tappetino extra-large con le evoluzioni di Eevee.', 'MERCH', 24.99, 80, 10, TRUE, TRUE, 'eevee-playmat.jpg', NULL, NULL, NULL),
('Digimon Card Game: Premium Deck Box', 'Scatola premium per carte Digimon.', 'ACCESSORI', 14.99, 100, 10, TRUE, TRUE, 'digimon-deckbox.jpg', NULL, NULL, NULL),
('Dragon Ball Super Tappetino: Goku Ultra Instinct', 'Tappetino esclusivo di Dragon Ball Super.', 'MERCH', 19.99, 70, 10, TRUE, TRUE, NULL, NULL, NULL, NULL),	
('Pokémon TCG: Celebrations Booster Pack', 'Pacchetto celebrativo dei 25 anni di Pokémon.', 'SPECIALE', 7.99, 200, 0, TRUE, TRUE, 'poke-celebration.jpg', NULL, NULL, NULL),
('Dragon Shield: Buste Protettive Trasparenti (100pz)', 'Buste trasparenti premium.', 'ACCESSORI', 11.99, 200, 20, TRUE, TRUE, 'dragonshield-clear-sleeves.jpg', NULL, NULL, NULL);

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

INSERT INTO ordine_dettaglio (ordine_id, prodotto_id, quantita, prezzo) VALUES
-- Categoria PREVENDITA con sconto applicato
(1, 7, 2, ROUND((14.99 * 2) * (1 - 0.20), 2)),
(2, 18, 1, ROUND((59.99 * 1) * (1 - 0.07), 2)),
(3, 21, 3, ROUND((34.99 * 3) * (1 - 0.105), 2)),
(4, 22, 2, ROUND((64.99 * 2) * (1 - 0.08), 2)),
(5, 23, 1, ROUND((37.99 * 1) * (1 - 0.11), 2)),
(6, 24, 4, ROUND((54.99 * 4) * (1 - 0.065), 2)),
(7, 26, 2, ROUND((29.99 * 2) * (1 - 0.18), 2)),
(8, 41, 3, ROUND((29.99 * 3) * (1 - 0.10), 2)),
(9, 47, 1, ROUND((49.99 * 1) * (1 - 0.20), 2)),
(10, 48, 2, ROUND((61.99 * 2) * (1 - 0.075), 2)),
(11, 1, 1, 8.99),(12, 3, 2, 24.99 * 2),(13, 5, 1, 19.99),(14, 10, 4, 9.99 * 4),(15, 12, 3, 19.99 * 3),
(16, 13, 1, 49.99),(17, 15, 2, 34.99 * 2),(18, 20, 2, 12.99 * 2),(19, 25, 1, 15.99),(20, 29, 3, 18.99 * 3),
(21, 32, 2, 22.99 * 2),(22, 35, 1, 14.99),(23, 38, 1, 24.99),(24, 45, 2, 24.99 * 2),(25, 50, 3, 29.99 * 3),
(26, 55, 1, 79.99),(27, 60, 1, 10.99),(28, 61, 4, 16.99 * 4),(29, 65, 2, 7.99 * 2),(30, 66, 3, 11.99 * 3),
(1, 1, 2, 7.64),(1, 7, 1, 11.99),(1, 47, 1, 39.99),(2, 18, 3, 55.79),(2, 21, 1, 26.24),(2, 3, 2, 24.99),
(3, 22, 1, 59.79),(3, 6, 1, 4.83),(3, 50, 1, 29.99),(4, 41, 2, 26.99),(4, 12, 1, 19.99),(4, 29, 1, 18.99),
(5, 26, 1, 24.59),(5, 11, 2, 33.99),(5, 9, 1, 8.99),(6, 48, 1, 57.34),(6, 19, 1, 19.99),(6, 13, 1, 49.99),
(7, 24, 1, 51.39),(7, 36, 2, 39.99),(7, 8, 1, 14.99),(8, 23, 1, 33.79),(8, 4, 1, 12.99),(8, 30, 1, 15.99),
(9, 32, 1, 22.99),(9, 35, 2, 14.99),(9, 39, 1, 29.99),(10, 20, 1, 11.69),(10, 33, 2, 29.99),(10, 44, 1, 5.39),
(11, 49, 1, 4.49),(11, 14, 1, 67.49),(11, 52, 1, 19.99),(12, 25, 1, 14.87),(12, 38, 1, 24.99),(12, 55, 1, 79.99),
(13, 31, 1, 89.99),(13, 2, 1, 67.04),(13, 45, 1, 24.99),
(14, 46, 2, 3.39),(14, 37, 1, 29.99),(14, 10, 1, 9.99),(15, 15, 1, 34.99),(15, 17, 1, 9.99),(15, 27, 1, 16.99),
(16, 5, 1, 19.99),(16, 40, 1, 3.99),(16, 42, 2, 19.99),(17, 54, 1, 3.99),(17, 53, 1, 12.99),(17, 57, 1, 4.13),
(18, 58, 1, 29.99),(18, 60, 1, 10.99),(18, 16, 1, 11.99),(19, 9, 1, 8.99),(19, 59, 1, 9.99),(19, 61, 1, 16.99),
(20, 62, 1, 24.99),(20, 63, 1, 14.99),(20, 18, 1, 55.79),(30, 41, 2, 26.99),(30, 33, 1, 29.99),(30, 45, 1, 24.99),
(31, 47, 2, 39.99),(31, 50, 1, 29.99),(31, 13, 1, 49.99),(32, 26, 1, 24.59),(32, 38, 2, 24.99),(32, 56, 3, 8.99),
(33, 23, 1, 33.82),(33, 57, 2, 4.13),(33, 31, 1, 89.99),(34, 14, 1, 67.49),(34, 7, 2, 11.99),(34, 19, 1, 19.99),
(35, 48, 1, 57.34),(35, 25, 2, 14.87),(35, 43, 1, 12.99),(36, 40, 3, 3.99),(36, 22, 1, 59.79),(36, 55, 1, 79.99),
(37, 20, 2, 11.69),(37, 9, 1, 8.99),(37, 46, 2, 3.39),(38, 32, 1, 22.99),(38, 1, 3, 7.64),(38, 18, 2, 55.79),
(39, 41, 1, 26.99),(39, 52, 2, 19.99),(39, 6, 1, 4.83),(40, 11, 1, 33.99),(40, 15, 2, 34.99),(40, 58, 1, 29.99),
(41, 4, 1, 12.99),(41, 24, 3, 51.44),(41, 8, 1, 14.99),(42, 37, 1, 29.99),(42, 35, 2, 14.99),(42, 12, 1, 19.99),
(43, 27, 2, 16.99),(43, 30, 1, 15.99),(43, 49, 3, 4.49),(44, 17, 1, 9.99),(44, 36, 2, 39.99),(44, 39, 1, 29.99),
(45, 42, 2, 19.99),(45, 5, 1, 19.99),(45, 34, 1, 34.99),(46, 3, 1, 24.99),(46, 44, 2, 5.39),(46, 2, 1, 66.99),
(47, 9, 3, 8.99),(47, 28, 1, 21.99),(47, 29, 2, 18.99),(48, 16, 1, 11.99),(48, 53, 2, 12.99),(48, 21, 1, 26.89),
(49, 62, 1, 24.99),(49, 59, 2, 9.99),(49, 63, 1, 14.99),(50, 10, 2, 9.99),(50, 54, 1, 3.99),(50, 60, 1, 10.99);
SELECT * FROM prodotto;
SELECT * FROM ordine;
SELECT * FROM ordine_dettaglio;

SELECT prodotto_id, prezzo, categoria, sconto_prevendita from prodotto;

SELECT utente_id utente, COUNT(utente_id) ordini FROM ordine
GROUP BY utente;

-- Primi insert DB