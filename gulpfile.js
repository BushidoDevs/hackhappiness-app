var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require("gulp-uglify");
var imagemin = require('gulp-imagemin');
var htmlreplace = require('gulp-html-replace');
var templateCache = require('gulp-angular-templatecache');
var wiredep = require('wiredep');
var usemin = require('gulp-usemin');
var minifyHtml = require('gulp-minify-html');
var rev = require('gulp-rev');
var install = require("gulp-install");

var paths = {
  sass: ['./scss/**/*.scss'],
  scripts: ['./www/js/**/*.js', '!./www/js/app.bundle.min.js'], // exclude the file we write too
  images: ['./www/img/**/*'],
  templates: ['./www/templates/**/*.html'],
  css: ['./www/css/**/*.min.css'],
  html: ['./www/index.html'],
  fonts: ['./www/lib/ionic/fonts/*'],
  lib: ['./www/lib/parse-1.2.18.min.js', './www/lib/moment.min.js', './www/lib/bindonce.min.js'],
  www: ['./www/'],
  dist: ['./dist/']
};
// Check the project is up to date.
gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
// Install npm packages.
gulp.task('npm', function(done) {
  gulp.src(['./package.json'])
    .pipe(install());
});
// Install bower dependenices.
gulp.task('bower', function () {
  bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});
// Set bower dependencies.
gulp.task('wiredep', function(){
  gulp.src(paths.html)
    .pipe(wiredep.stream())
    .pipe(gulp.dest(paths.www + './'));
});
gulp.task('install', ['git-check', 'npm', 'bower', 'wiredep']);

// Build sass file.
gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest(paths.www + 'css/'))
    .on('end', done);
});

// concat all html templates and load into templateCache
gulp.task('templateCache', function(done) {
  gulp.src(paths.templates)
    .pipe(templateCache({
      'filename': 'templates.js',
      'root': 'templates/',
      'module': 'app'
    }))
    .pipe(gulp.dest(paths.www + 'js'))
    .on('end', done);
});

gulp.task('jshint', function() {
  gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.templates, ['templateCache']);
  gulp.watch(paths.scripts, ['scripts']);
});
gulp.task('default', ['sass', 'templateCache']);

gulp.task('clean', function(done) {
  gulp.src(paths.dist, { read: false })
    .pipe(clean());
  done();
});

gulp.task('usemin', ['clean', 'sass', 'templateCache'], function (done) {
  gulp.src(paths.html)
    .pipe(usemin({
      html: [minifyHtml({empty: true})],
      css: [minifyCss(), 'concat', rev()],
      jsVendor: [uglify(), rev()],
      jsApp: [
        ngAnnotate({remove: true, add: true, single_quotes: true }),
        jshint(),
        jshint.reporter('default'),  
        uglify(),
        rev()
      ]
    }))
    .pipe(gulp.dest(paths.dist + ''));
  done();
});
// Imagemin images and ouput them in dist
gulp.task('imagemin', function() {
  gulp.src(paths.images)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.dist + 'img'));
});

gulp.task('copy', function() {
  gulp.src(paths.fonts, {base: paths.www + ''})
    .pipe(gulp.dest(paths.dist + ''));
});

gulp.task('build', ['clean'], function(){
  gulp.start('usemin');
  gulp.start('imagemin');
  gulp.start('copy');
});