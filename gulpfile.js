// include gulp
var gulp = require('gulp');

// include plug-ins
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var watch = require("gulp-watch");

// Gulp copy bootstrap, jquery
gulp.task('vendors', function () {
    gulp.src('./bower_components/bootstrap/dist/css/bootstrap.css')
        .pipe(changed('./assets/css/'))
        .pipe(gulp.dest('./assets/css/'));
    gulp.src('./bower_components/bootstrap/dist/js/bootstrap.js')
        .pipe(changed('./assets/js/'))
        .pipe(gulp.dest('./assets/js/'));
    gulp.src('./bower_components/jquery/dist/jquery.js')
        .pipe(changed('./assets/js/'))
        .pipe(gulp.dest('./assets/js/'));
});

// minify new images
gulp.task('images', function () {

    return gulp.src(['./build/img/**/*.png', './build/img/**/*.jpg', './build/img/**/*.jpeg', './build/img/**/*.gif'])
        .pipe(changed('./assets/img'))
        .pipe(imagemin())
        .pipe(gulp.dest('./assets/img'));
});

// JS concat, strip debugging and minify
gulp.task('scripts', function () {
    return gulp.src('./build/js/*.js')
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./assets/js/'));
});

// run sass
gulp.task('sass', function () {
    return gulp.src('./build/sass/*.scss')
        .pipe(sass(
            {style: 'compressed'}
        ))
        .pipe(gulp.dest('./assets/css/'));
});

// gulp watch
gulp.task('watch', function () {

    // watch for JS changes
    gulp.watch('./build/js/*.js', ['scripts']);
    watch('./build/js/*.js', function(){
        gulp.start(['scripts']);
    });

    // watch for sass changes
    gulp.watch('./build/sass/*.scss', ['sass']);
    watch('./build/sass/*.scss', function(){
        gulp.start('sass');
    });

    // watch for CSS changes
    gulp.watch('./build/css/*.css', ['styles']);

    // watch for image changes
    gulp.watch('./build/img/**/*', ['images']);
    watch(['./build/img/**/*.png', './build/img/**/*.jpg', './build/img/**/*.jpeg', './build/img/**/*.gif'], function () {
        gulp.start('images');
    });
});

// default gulp task
gulp.task('default', ['watch'], function () {

    gulp.start('vendors', 'images', 'sass', 'scripts', 'styles');
});
