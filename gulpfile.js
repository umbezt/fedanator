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

// JS hint task
gulp.task('jshint', function () {
    gulp.src('./src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// minify new images
gulp.task('imagemin', function () {
    var imgSrc = './src/img/**/*',
        imgDst = './build/img';

    gulp.src(imgSrc)
        .pipe(changed(imgDst))
        .pipe(imagemin())
        .pipe(gulp.dest(imgDst));
});

// JS concat, strip debugging and minify
gulp.task('scripts', function () {
    gulp.src(['./src/js/jquery.min.js', './src/js/*.js'])
        .pipe(concat('app.js'))
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest('./build/js/'));
});

// run sass
gulp.task('sass', function () {
    gulp.src('./build/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./build/css/'));
});

// CSS concat, auto-prefix and minify
gulp.task('styles', function () {
    gulp.src(['./build/css/*.css'])
        .pipe(concat('app.css'))
        .pipe(autoprefix('last 2 versions'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('./src/css/'));
});

// Gulp copy bootstrap
gulp.task('vendors', function () {
    gulp.src('./bower_components/bootstrap/dist/css/bootstrap.css').pipe(gulp.dest('./src/css/'));
    gulp.src('./bower_components/bootstrap/dist/js/bootstrap.css').pipe(gulp.dest('./src/css/'));
    gulp.src('./bower_components/jquery/dist/jquery.js').pipe(gulp.dest('./src/js/'));
});

// default gulp task
gulp.task('default', ['imagemin', 'sass', 'scripts', 'styles', 'vendors'], function () {

    // watch for JS changes
    gulp.watch('./src/js/*.js', function () {
        gulp.run('jshint', 'scripts');
    });

    gulp.watch('./build/sass/*.scss', function(){
       gulp.run('sass');
    });

    // watch for CSS changes
    gulp.watch('./src/css/*.css', function () {
        gulp.run('styles');
    });
});