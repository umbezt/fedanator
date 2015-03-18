// include gulp
var gulp = require('gulp');

// include plug-ins
var jshint = require('gulp-jshint');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');

// Gulp copy bootstrap, jquery
gulp.task('vendors', function () {
    gulp.src('./bower_components/bootstrap/dist/css/bootstrap.css').pipe(gulp.dest('./assets/css/'));
    gulp.src('./bower_components/bootstrap/dist/js/bootstrap.js').pipe(gulp.dest('./assets/js/'));
    gulp.src('./bower_components/jquery/dist/jquery.js').pipe(gulp.dest('./assets/js/'));
});

// JS hint task on dev js files
gulp.task('jshint', function () {
    gulp.src('./build/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// minify new images
gulp.task('imagemin', function () {
    var imgSrc = './build/img/**/*',
    imgDst = './assets/img/';

    gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});

// JS concat, strip debugging and minify
gulp.task('scripts', function () {
    gulp.src('./build/js/*.js')
    .pipe(concat('app.js'))
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest('./assets/js/'));
});

// run sass
gulp.task('sass', function () {
    gulp.src('./build/sass/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./assets/css/'));
});

// CSS concat, auto-prefix and minify
gulp.task('styles', function () {
    gulp.src(['./build/css/*.css'])
    .pipe(concat('app.css'))
    .pipe(autoprefix('last 2 versions'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./_build/css/'));
});

// default gulp task
gulp.task('default', ['vendors', 'imagemin', 'sass', 'scripts', 'styles'], function () {

    // watch for JS changes
    gulp.watch('./build/js/*.js', ['jshint', 'scripts']);

    // watch for sass changes
    gulp.watch('./build/sass/*.scss', ['sass']);

    // watch for CSS changes
    gulp.watch('./build/css/*.css', ['styles']);
});