# tgcShop
Project Work JAITA131

## Appunti sul setup del progetto
La creazione di entities, DTO, repository (JPA) e service segue il principio di separazione dei compiti (separation of concerns) ed è fondamentale per un'architettura ben progettata, scalabile e manutenibile in un'applicazione Spring/Maven.

## Entities (Entità)
Le entità rappresentano gli oggetti che mappano le tabelle del database.
* Perché creare le entità?
Servono per comunicare con il database usando JPA (Java Persistence API).
Mappano i dati da una tabella a un oggetto Java, rendendo il codice leggibile e manutenibile.
Sono il cuore del modello dati dell'applicazione.
* Criteri per creare le entità:
Ogni tabella del database dovrebbe avere una classe Entity corrispondente.
Usa annotazioni JPA come @Entity, @Table, @Id, @Column per definire il mapping.
I campi della classe mappano le colonne della tabella.
Se ci sono relazioni tra tabelle (ad esempio, una tabella Utente e una tabella Ordini), usa annotazioni JPA come @OneToMany, @ManyToOne, ecc.
Le entità devono contenere solo campi, costruttori, getter/setter e annotazioni.
Non includere logica o operazioni complesse.

## DTO (Data Transfer Object)
I DTO sono oggetti semplici che servono per trasferire dati tra i vari livelli dell'applicazione.
Perché creare i DTO?
Separano i dati esposti all'utente (frontend o API) dai dati interni del database (entità).
Prevengono l'esposizione di informazioni sensibili (es. password).
Consentono di strutturare i dati in base alle esigenze del frontend/API senza modificare l'entità.
* Criteri per creare i DTO:
Crea DTO in base a ciò che il frontend/API ha bisogno di ricevere o inviare.
Ad esempio, un DTO per i dettagli utente potrebbe escludere la password
Un DTO dovrebbe contenere solo i campi strettamente necessari per il trasferimento.
Fornisci metodi di conversione tra entità e DTO


## JPA Repository
Il repository è l'interfaccia che permette di interagire con il database.
* Perché creare il repository?
Fornisce metodi predefiniti per operazioni comuni sul database (es. salvare, aggiornare, eliminare, cercare).
Grazie a Spring Data JPA, non devi scrivere manualmente query SQL per la maggior parte delle operazioni.
* Criteri per creare il repository:
- Crea un'interfaccia per ogni entità
- Uso di metodi predefiniti:
JpaRepository offre metodi pronti per salvare, trovare, eliminare, ecc. --> save(), findById(), deleteById(), ecc.
- Definisci metodi personalizzati solo se necessario:

## Service
Il service è la logica intermedia tra il controller e il repository.
* Perché creare il service?
Centralizza la logica di business, mantenendo il controller e il repository semplici.
Consente la riusabilità del codice.
Fornisce un livello in cui applicare validazioni, calcoli o regole di business.
* Criteri per creare il service:
- Per ogni entità, crea una classe di service (es. UtenteService).
- Il service dovrebbe interagire con il repository per eseguire operazioni sul database.
* Regole di business:
Implementa nel service la logica necessaria, come:
Validazioni personalizzate.
Operazioni complesse sui dati.

## Controller 
E' una parte fondamentale in un'applicazione Spring Boot. Si trova nel livello più alto dell'architettura MVC (Model-View-Controller) e si occupa di ricevere le richieste dagli utenti (frontend, API client, ecc.) e rispondere con i dati elaborati dal servizio.
* Cosa fa il controller?
- Gestisce le richieste HTTP:
Riceve richieste HTTP (es. GET, POST, PUT, DELETE).
- Associa URL specifici alle funzioni tramite annotazioni come @GetMapping, @PostMapping, ecc.
- Interagisce con il livello di servizio:
Delegando al service l'elaborazione della logica di business.
Il controller è responsabile solo di ricevere e restituire dati, non di applicare logica complessa.
- Converte i dati:
Accetta input dall'utente (ad esempio, in formato JSON) e li trasforma in DTO o entità.
Restituisce dati formattati per il client (ad esempio, una risposta JSON o HTML).


## Schema generale del flusso
* Entità: Rappresenta i dati nel database.
* Controller: Riceve la richiesta dall'utente (API o Frontend).
* Service: Elabora la richiesta e applica la logica di business.
* Repository: Interagisce con il database per leggere/scrivere dati.
* DTO: Converte i dati da/verso il formato richiesto dall'utente.


# REST Endpoints
Una lista degli Endpoint dell'applicazione:

## Utente
| Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `GET`    | `/api/utente`                            | Ritorna la lista di tutti gli utenti.    |
| `GET`    | `/api/utente/{id}`                       | Ritorna l'utente desiderato specificando l'id. |
| `GET`    | `/api/utente/curr`                       | Ritorna l'utente loggato all'interno della Sessione (da testare). |

## Prodotto
| Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `GET`    | `/api/prodotto`                          | Ritorna la lista di tutti i prodotti. (DTO) |
| `PUT`    | `/api/prodotto`                          | Richiede JSON di Prodotto nel body (compreso di prodottoId). |
| `POST`   | `/api/prodotto`                          | Richiede JSON di Prodotto nel body, inserisce il nuovo prodotto all'interno del DB. |
| `POST`   | `/api/prodotto/alt`                      | Richiede `FormData()` necessari formData.append di `("prodotto", JSON.stringify(PRODOTTO))`, `("image", FILEIMMAGINE)`, `("prevendita", inizioPrevendita)`,`formData.append("dataUscita", dataUscita)` |
| `PUT`    | `/api/prodotto/alt`                      | Richiede `FormData()` necessari formData.append di `("prodotto", JSON.stringify(PRODOTTO))`, `("image", FILEIMMAGINE)`, `("prevendita", inizioPrevendita)`,`formData.append("dataUscita", dataUscita)` |
| `GET`    | `/api/prodotto/{id}`                     | Ritorna il prodotto desiderato specificandone l'id. (DTO) |
| `DELETE` | `/api/prodotto/{id}`                     | Cancella dal DB il prodotto di id specificato. |
| `GET`    | `/api/prodotto/categoria/{c}`            | Ritorna la lista di tutti i prodotti appartenenti alla categoria specificata. (DTO) |

## Ordine
| Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `GET`    | `/api/ordine`                            | Ritorna la lista di tutti gli ordini.    |
| `PUT`    | `/api/ordine/{id}`                       | Richiede JSON di OrdineDTO nel body, modifica l'ordine con id specificato. |
| `POST`   | `/api/ordine/u/{UtenteId}`               | Richiede JSON di Ordine nel body, inserisce il nuovo ordine all'interno del DB per l'utente di id specificato. |
| `GET`    | `/api/ordine/u/{UtenteId}`               | Ritorna la lista di tutti gli ordini per l'utente con l'id specificato. |

## Ordine Dettaglio
ODD = OrdineDettaglioDto
- oggetto ordine, oggetto prodotto, int quantità
- int ordineId, int prodottoId, int quantità
- è possibile aggiungere il prezzo ad entrambi i JSON, altrimenti calcola in automatico

| Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `GET`    | `/api/details`                           | Ritorna la lista di tutti gli ordini-dettaglio (DTO).    |
| `POST`   | `/api/details/`                          | Richiede ODD nel body, crea nuovo ordine_dettaglio   |
| `GET`    | `/api/details/{ordine_id}`               | Ritorna la lista di tutti gli ordini-dettaglio legati all'id dell'ordine specificato (DTO).    |
| `DELETE` | `/api/details/{ordine_id}`               | Cancella tutti gli ordine dettaglio correlati all'ordine di id specificato.    |
| `PUT` | `/api/details/{ordine_id}`                  | Richiede ODD nel body, modifica l'ordine-dettaglio correlato all'ordine specificato.    |


## Login
| Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `POST`    | `/auth/login`                           | Richiede JSON di UtenteSessione (email, password) per effettuare il login e salvare l'utente in sessione. |
| `POST`    | `/auth/logout`                          | Invalida la sessione HttpSession, effettua il logout dell'utente. |
