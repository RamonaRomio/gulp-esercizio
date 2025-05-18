"use strict";

import gulp from 'gulp';

// Rinominare files
import rename from 'gulp-rename';
// Svuotare cartella dai files
import clean from 'gulp-clean';
// Sostituire parti di HTML
import htmlReplace from 'gulp-html-replace';
// Refresh automatico pagina browser
import browserSync from "browser-sync";

/* CSS */
// convertire SASS
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
// impostare i prefixes
import autoprefixer from 'gulp-autoprefixer';
// Minificare CSS
import cleanCSS from 'gulp-clean-css';

/* JS */
// Minificare JS
import uglify from 'gulp-uglify';
// Unire files JS
import concat from 'gulp-concat';
// Babel per transpiling (adattare JS a browser più vecchi)
import babel from 'gulp-babel';

// Convertiamo i files SASS in .css
function sassToCss() {
  return gulp.src('./dev/scss/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./dev/styles'))
}

// Ottimizziamo i files CSS
function cssMinify() {
  return gulp.src('./dev/styles/*.css')
    // Utilizziamo i prefix per aumentare la compatibilità sui browser
    .pipe(autoprefixer())
    // Minifichiamo il codice e rimuoviamo i commenti
    .pipe(cleanCSS())
    // Rinominiamo il file aggiungendo il suffisso .min (es. style.min.css)
    .pipe(rename({
      suffix: '.min'
    }))
    // Esportiamo
    .pipe(gulp.dest('./dst/styles'))
}

// Ottimizziamo JavaScript
function jsMinify() {
  return gulp.src('./dev/script/*.js')
    // Usiamo Babel per il transpiling (compatibilità con browser più vecchi)
    .pipe(babel({
      presets: ['@babel/env']
    }))
    // Concateniamo tutti i files in un unico JavaScript
    .pipe(concat('all.js'))
    // Minifichiamo il file
    .pipe(uglify())
    // Rinominiamo con il suffisso min (all.min.js) 
    .pipe(rename({
      suffix: '.min'
    }))
    // Esportiamo
    .pipe(gulp.dest('./dst/script'))
}

// Nel file html abbiamo usato dei segnaposto per inserire CSS e JS
// I blocchi dei segnaposto sono indicati con <!-- build:nome -->
// E finiscono con <!-- endbuild -->
/* Con questa funzione sostituiamo i files contenuti nei segnaposto 
  con le versioni compilate e minificate per la produzione */
function replaceHtmlBlock() {
  return gulp.src(['./dev/*.html'])
    .pipe(htmlReplace({
      'cssFilePlaceholder': 'styles/style.min.css',
      'scssFilePlaceholder': 'styles/theme.min.css',
      'jsFilePlaceholder': '<script src="script/all.min.js" defer></script>'
    }))
    .pipe(gulp.dest('./dst'));
}

/* Quando facciamo una nuova build, possiamo cancellare il contenuto della cartella dist,
così siamo sicuri di avere al suo interno solo i files della nuova build */
function cleanDistFolder() {
  return gulp.src('./dst/*')
    .pipe(clean())
}

// Spostiamo le immagini da dev a dst
function moveImg() {
  return gulp.src('./dev/img/*.*')
    .pipe(gulp.dest('./dst/img'))
}

// Lanciamo l'ambiente di dev
function dev() {
  browserSync.init({
    server: {
      baseDir: './dev'
    }
  });
 
  // Il metodo watch si mette in ascolto di modifiche: specificiamo il percorso e cosa fare
  // Quando salvo un .scss, voglio convertirlo in .css
  gulp.watch('./dev/scss/*.scss').on('change', sassToCss);
  // Quando cambia un .css, un .js o un .html, voglio aggiornare il browser
  gulp.watch('./dev/styles/*.css').on('change', browserSync.reload);
  gulp.watch('./dev/script/*.js').on('change', browserSync.reload);
  gulp.watch('./dev/*.html').on('change', browserSync.reload);
}

/* Build per la produzione: alcuni task dobbiamo effettuarli in serie,
altri possono essere lanciati in parallelo.
Cosa facciamo nella build:
  svuotiamo la cartella dist, ottimizziamo CSS e JS, aggiorniamo il file html, spostiamo le immagini
*/
const build = gulp.series(
  cleanDistFolder, 
  gulp.parallel(
    cssMinify, 
    jsMinify,
    replaceHtmlBlock,
    moveImg
  )
);

export {build, dev, cleanDistFolder};