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

var paths = {
  sass: ['./scss/**/*.scss'],
  scripts: ['./www/js/**/*.js', '!./www/js/app.bundle.min.js'], // exclude the file we write too
  images: ['./www/img/**/*'],
  templates: ['./www/templates/**/*.html'],
  css: ['./www/css/**/*.min.css'],
  html: ['./www/index.html'],
  extras: ['./www/PushNotification.js'],
  ionicbundle: ['./www/lib/ionic/js/ionic.bundle.min.js'],
  ionicfonts: ['./www/lib/ionic/fonts/*'],
  lib: ['./www/lib/parse-1.2.18.min.js', './www/lib/moment.min.js', './www/lib/bindonce.min.js'],
  dist: ['./dist/']
};
var files = {
  jsbundle: 'app.bundle.min.js',
  appcss: 'app.css'
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

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

gulp.task('build', ['sass', 'scripts', 'styles', 'imagemin', 'index', 'copy']);

gulp.task('clean', function() {
  return gulp.src(paths.dist, {
      read: false
    })
    .pipe(clean());
});

// Prepare Index.html for dist - ie. using min files
gulp.task('index', ['clean'], function() {
  gulp.src(paths.html)
    .pipe(htmlreplace({
      'css': 'css/app.min.css',
      'js': 'js/app.bundle.min.js'
    }))
    .pipe(gulp.dest(paths.dist + '.'));
});

// scripts - clean dist dir then annotate, minify, concat
gulp.task('scripts', ['clean', 'templateCache'], function() {
  gulp.src(paths.scripts)
  //.pipe(jshint())
  //.pipe(jshint.reporter('default'))
  .pipe(ngAnnotate({
    remove: true,
    add: true,
    single_quotes: true
  }))
    .pipe(uglify())
    .pipe(concat(files.jsbundle))
    .pipe(gulp.dest(paths.dist + 'js'));
});

// concat all html templates and load into templateCache
gulp.task('templateCache', ['clean'], function() {
  return gulp.src(paths.templates)
    .pipe(templateCache({
      'filename': 'templates.js',
      'root': 'templates/',
      'module': 'app'
    }))
    .pipe(gulp.dest('./www/js'));
});

// Copy all other files to dist directly
gulp.task('copy', ['clean'], function() {
  // Copy ionic bundle file
  gulp.src(paths.ionicbundle)
    .pipe(gulp.dest(paths.dist + 'lib/ionic/js/.'));

  // Copy ionic fonts
  gulp.src(paths.ionicfonts)
    .pipe(gulp.dest(paths.dist + 'lib/ionic/fonts'));

  // Copy lib scripts
  gulp.src(paths.lib)
    .pipe(gulp.dest(paths.dist + 'lib'));

  // Copy extra files
  gulp.src(paths.extras)
    .pipe(gulp.dest(paths.dist + '.'));
});

// styles - min app css then copy min css to dist
gulp.task('minappcss', function() {
  return gulp.src('./www/css/' + files.appcss)
    .pipe(minifyCss())
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('./www/css/'));
});

// styles - min app css then copy min css to dist
gulp.task('styles', ['clean', 'minappcss'], function() {
  gulp.src(paths.css)
    .pipe(gulp.dest(paths.dist + 'css'));
});

// Imagemin images and ouput them in dist
gulp.task('imagemin', ['clean'], function() {
  gulp.src(paths.images)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.dist + 'img'));
});
