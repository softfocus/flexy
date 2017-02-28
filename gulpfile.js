'use strict';

var gulp = require('gulp'),
    del = require('del'),
    notify = require('gulp-notify'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create();



// Source files
// ****************************************************************************
var htmlSrc = './app/*.html';
var scssSrc = './app/scss/**/*.scss';
var cssTgt = './app/css/'; // Compiled css + sourcemaps go here


// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function () {
    browserSync.init({
        server: './app'
    });
    gulp.watch(scssSrc, ['sass']);
    gulp.watch(htmlSrc).on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
    return gulp.src(scssSrc)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', notify.onError({
            message: "<%= error.message %>",
            title: "Sass Error"
        }))
        .pipe(autoprefixer())
        .pipe(cleanCSS(function (details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize)
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(cssTgt))
        .pipe(browserSync.stream());
});

// default task
gulp.task('default', ['serve']);


