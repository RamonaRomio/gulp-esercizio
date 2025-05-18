Installare Gulp
Inziamo con l'instazione dell'interfaccia da riga di comando di GULP, cioè gulp-cli, con questo comando

# npm install gulp-cli -g
Il flag "-g" specifica che npm installerà "gulp-cli" a livello globale nel nostro sistema, e questo ti permetterà di eseguire gulp-cli in qualunque directory del tuo computer.

Per verificare la versione installata di gulp-cli digitiamo

# gulp --version
La nostra versione è la 2.3.0

CLI version: 2.3.0
Local version: Unknown
Viene indicato anche "Local version: Unknown"  questo perchè non è sufficiente installare il modulo "gulp-cli", ma è necessario installare anche "gulp" all'interno della directory di lavoro. Lo vediamo tra poco

Procediamo adesso con la creazione di un progetto. Quanto segue varrà sia per utenti Linux che Windows.

Creazione di un progetto
Creiamo una cartella dove inserire i files del nostro progetto.

Ad esempio, su Linux ho creato la cartella "/var/www/progettoGulp"

# mkdir /var/www/progettoGulp
Accedo alla cartella

# cd /var/www/progettoGulp
e quando sono dentro digito il comando

# npm init
Questo comando crea un file chiamato "package.json", il quale conterrà tutte le informazioni sul progetto, tra cui le dipendenze, gli script da eseguire, ecc.

A video apparirà una schermata come questa in cui ti verranno richieste una serire di informazioni (come ad es il nome del progetto).... accetta le impostazioni di default e alla fine digita "yes"

This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help init` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (progettogulp)
version: (1.0.0)
description: il mio primo progetto
entry point: (index.js)
test command:
git repository:
keywords:
author:
license: (ISC)
About to write to /var/www/progettoGulp/package.json:

{
  "name": "progettogulp",
  "version": "1.0.0",
  "description": "il mio primo progetto",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}


Is this OK? (yes) yes
Bene, il file "package.json" è stato creato. Diamogli un'occhiata

# cat package.json
{
  "name": "progettogulp",
  "version": "1.0.0",
  "description": "il mio primo progetto",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
Adesso possiamo procedere con l'installazione di GULP  usando il seguente comando

# npm install --save-dev gulp
L'opzione "--save-dev" installerà GULP come una dipendenza di sviluppo del progetto, quindi localmente anzichè globalmente: nel file package.json adesso roveremo il modulo presente tra le dipendenze (nelle "devDependencies").

Infatti, se ricontrolloiamo il contenuto del file, adesso vedremo

# cat package.json
{
  "name": "progettogulp",
  "version": "1.0.0",
  "description": "il mio primo progetto",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "gulp": "^4.0.2"
  }
}
Viene inoltre create una cartella chiamata "node_modules" che conterrà le varie dipendenze del progetto: prova ad aprirlo e vedrai che è molto corposo.

Ora: se devi trasferire il tuo progetto su un altro pc o server, non copiare la cartella "node_modules", sarà infatti sufficiente eseguire il comando "npm init" affinché npm legga il package.json e scarichi in automatico tutte le dipendeze del progetto. Stesso discorso vale se trasferisci il tuo progetto su Github o simili: escludi la cartella "node_modules" attraverso il file ".gitignore"

Verifichiamo la versione di gulp installata: è la 4.0.2

# gulp --version

CLI version: 2.3.0
Local version: 4.0.2
Struttura di un progetto Gulp
Nella cartella "progettoGulp" creiamo due nuove cartella

la cartella "src": dove andremo ad inserire i file prima di essere "lavorati" con Gulp
la cartella "dst": dove andranno a finire i file ottimizzati per il sito, cioè che andranno in produzione
Inoltre creiamo un file chiamato "gulpfile.js" che conterrà tutte le task del nostro progetto Gulp. Per adesso crealo vuoto.

La nostra directory principale conterrà adesso questi elementi

# ls -l
total 124
drwxr-xr-x   2 root root     10 Sep 28 15:02 dst
-rw-r--r--   1 root root      0 Sep 28 15:03 gulpfile.js
drwxr-xr-x 285 root root   8192 Sep 28 14:50 node_modules
-rw-r--r--   1 root root    278 Sep 28 14:50 package.json
-rw-r--r--   1 root root 110278 Sep 28 14:50 package-lock.json
drwxr-xr-x   2 root root     10 Sep 28 15:02 src
Creare una Gulp Task: il gulpfile.js
Adesso che Gulp è installato possiamo creare la nostra prima task, cioè operazione, da eseguire con Gulp.

Apriamo il file "gulpfile.js" e dentro dobbiamo, come prima cosa, richiamare Gulp, in questo modo

const gulp = require('gulp');
Abbiamo creato una costante con nome "gulp"... ma potevi crearlo come volevi, ad esempio "pippo"... che utilizzeremo dentro lo script.

Per capire come funziona una task di Gulp, creiamo una task molto semplice che nella realtà non ha applicazione, ma ci aiuta a capirne la logica.

Diamo a questo task un nome, ad esempio  "hello". All'interno del gulpfile.js aggiungiamo queste righe

gulp.task('hello', function (done) {
  console.log('Hello from Gulp');
  done();
});
Adesso, da terminale, lanciamo la task in questo modo

#gulp hello
L'output sarà il seguente

Using gulpfile /var/www/progettoGulp/gulpfile.js
 Starting 'hello'...
Hello from Gulp
Finished 'hello' after 1.07 ms
Un task è più complessa di quella vista in questo esempio, ci saranno istruzioni che serviranno ad esempio a recuperare i file sorgenti da elaborare, ad elaborarli, a salvarli nella cartella di destinazione,.... e dovremmo utilizzare dei plugin.

Se abbiamo più task da lanciare, utilizziamo il comando "gulp" seguito dalla lista di tutti i task

Vedremo nei prossimi articoli due esempi pratici relativi alla minimizzazione di file css e js, e alla ottimizzazione di immagini.

Stay tuned!

const gulp = require('gulp');

oggi si usa import
import gulp from 'gulp';
