# FitCourse

FitCourse è una piattaforma e-commerce, adibita anche all’iscrizione ai corsi, che permette a chi si iscrive di fare acquisti di prodotti e iscriversi ai corsi a tema fitness o attività fisica in generale.

> NOTA PER L'UTILIZZO:
> Per motivi di convenienza tutti gli utenti presenti nel database hanno la stessa immagine di profilo (differente per uomo e donna) e la stessa password che è `cicciobello`.

### Le credenziali per la pagina di amministrazione (a http://localhost:8000/admin):
- E-mail: `admin@fitcourse.com`
- Password: `admin`

## Prerequisiti 
Per poter avviare il sistema è necessario installare sul proprio sistema i seguenti software:

- Python (versioni 3.11 e successive)
- Node.js (versioni 18.16 e successive)

è necessario installare un ulteriore estensione Python per poter installare i pacchetti successivi: `pipenv`. In un terminale
digitare il seguente comando:

`pip install pipenv`

## Istruzioni per l'avviamento

### Installazione pacchetti necessari

Nella directory "server" del progetto aprire un terminale ed eseguire il seguente comando per installare i pacchetti
necessari:

`pipenv install`

Nella directory "client" del progetto aprire un terminale ed eseguire il seguente comando per installare i pacchetti
necessari:

`npm install`

### Avviamento
Nella directory "server" del progetto aprire un terminale ed eseguire il seguente comando per attivare il virtual environment:

`pipenv shell`

dopodiché eseguire il comando per avviare il server:
`python manage.py runserver`

Nella directory "client" del progetto aprire un terminale ed eseguire il seguente comando per avviare il client:
`npm run dev`

