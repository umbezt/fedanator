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
var minifyCSS = require('gulp-minify-css');
var notify = require("gulp-notify");
var watch = require("gulp-watch");

// Gulp copy bootstrap, jquery
gulp.task('vendors', function () {
    gulp.src('./bower_components/bootstrap/dist/css/bootstrap.css')
        .pipe(changed('./assets/css/'))
        .pipe(gulp.dest('./assets/css/'))
        .pipe(notify("Bootstrap CSS imported"));
    gulp.src('./bower_components/bootstrap/dist/js/bootstrap.js')
        .pipe(changed('./assets/js/'))
        .pipe(gulp.dest('./assets/js/'))
        .pipe(notify("Bootstrap JS imported"));
    gulp.src('./bower_components/jquery/dist/jquery.js')
        .pipe(changed('./assets/js/'))
        .pipe(gulp.dest('./assets/js/'))
        .pipe(notify("jQuery imported"));
});

// JS hint task on dev js files
gulp.task('jshint', function () {
    return gulp.src('./build/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// minify new images
gulp.task('images', function () {

    return gulp.src(['./build/img/**/*.png', './build/img/**/*.jpg', './build/img/**/*.jpeg', './build/img/**/*.gif'])
        .pipe(changed('./assets/img'))
        .pipe(imagemin())
        .pipe(gulp.dest('./assets/img'))
        .pipe(notify({message: 'Images compressed and copied to the assets folder.'}));
});

// JS concat, strip debugging and minify
gulp.task('scripts', function () {
    return gulp.src('./build/js/*.js')
        .pipe(concat('app.js'))
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest('./assets/js/'))
        .pipe(notify({message: 'Javascript files have been stripped of debug code, concatenated and minified.'}));
});

// run sass
gulp.task('sass', function () {
    return gulp.src('./build/sass/*.scss')
        .pipe(sass(
            {onError: notify.onError('<%= error.message %>')},
            {style: 'compressed'}
        ))
        .pipe(gulp.dest('./assets/css/'))
        .pipe(notify({message: 'Sass file compiled.'}));
});

// CSS concat, auto-prefix and minify
gulp.task('styles', function () {
    return gulp.src(['./build/css/*.css'])
        .pipe(concat('app.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('./_build/css/'))
        .pipe(notify({message: 'Styles have been concatenated and minified.', onLast: true}));
});

// gulp watch
gulp.task('watch', function () {

    // watch for JS changes
    gulp.watch('./build/js/*.js', ['jshint', 'scripts']);
    watch('./build/js/*.js', function(){
        gulp.start(['jshint', 'scripts']);
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
