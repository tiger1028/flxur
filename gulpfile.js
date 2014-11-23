'use strict';
/**
 * Gulp tasks.
 */
var browserify = require('gulp-browserify');
var Catalog = require('./server/models/catalog');
var concat = require('gulp-concat');
var config = require('./server/config/dev');
var del = require('del');
var gulp = require('gulp');
var mongoose = require('mongoose');
var uglify = require('gulp-uglify');

// Define 'clean' task.
gulp.task('clean', function() {
    del(['dist/css/*']);
    del(['dist/js/*']);
    del(['dist/*']);
});

// Browserify task.
gulp.task('browserify', function() {
    gulp.src('app/js/main.js')
        .pipe(browserify({
            transform: 'reactify',
        }))
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// Copy task to get other files into dist.
gulp.task('copy', function() {
    gulp.src('app/index.html')
        .pipe(gulp.dest('dist'));
    gulp.src('app/css/*')
        .pipe(gulp.dest('dist/css'));
});

// Define default task.
gulp.task('default', ['clean', 'browserify', 'copy']);

// Define the watch task.
gulp.task('watch', function() {
    gulp.watch('app/**', ['default']);
});

// Define load-dev-db task.
gulp.task('load-dev-db', function(callback) {
    // Configure MongoDB connections.
    mongoose.connect(config.mongodb_url);

    // Save some new items in the dev database.
    new Catalog.CatalogItem({title: 'Cool Item', cost: 1}).save();
    new Catalog.CatalogItem({title: 'Awesome Item', cost: 2}).save();
    new Catalog.CatalogItem({title: 'Rockin’ Item', cost: 3}).save();
    new Catalog.CatalogItem({title: 'Uber Item', cost: 4}).save();

    mongoose.connection.close()
    callback(null);
});
