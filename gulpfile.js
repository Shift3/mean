/*jshint node: true*/
var gulp = require('gulp'),
  less = require('gulp-less'),
  env = require('node-env-file'), //create the env
  envfile = require('envfile'), //parse the env
  jshint = require('gulp-jshint'),
  htmlify = require('gulp-angular-htmlify'),
  open = require('gulp-open'),
  nodemon = require('gulp-nodemon'),
  autoprefixer = require('gulp-autoprefixer'),
  notify = require('gulp-notify'),
  concat = require('gulp-concat'),
  templateCache = require('gulp-angular-templatecache'),
  sourcemaps = require('gulp-sourcemaps'),
  watch = require('gulp-watch'),
  uglify = require('gulp-uglify'),
  gulpif = require('gulp-if'),
  livereload = require('gulp-livereload'),
  ngAnnotate = require('gulp-ng-annotate'),
  plumber = require('gulp-plumber'),
  babel = require('gulp-babel'),
  iife = require('gulp-iife');
  awspublish = require('gulp-awspublish');

gulp.task('env', function () {
  env(__dirname + '/.env', {overwrite: true});
});

gulp.task('templates', function () {
  gulp.src('./app/**/*.html')
    .pipe(htmlify())
    .pipe(templateCache({
      standalone: true
    }))
    .pipe(gulp.dest('./build/js'))
    .pipe(livereload());
});

gulp.task('scripts', function () {
  var baseDir = __dirname + '/app',
    outputDir = __dirname + '/build/js',
    outputFilename = 'app.js',
    env = envfile.parseFileSync('.env');

  gulp.src([
      baseDir + "/*module.js",
      baseDir + "/**/*module.js",
      baseDir + "/**/*.js"
    ])
    .pipe(iife())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat(outputFilename))
    .pipe(ngAnnotate())
    .pipe(gulpif(env.PRODUCTION === 'true', uglify()))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(outputDir))
    .pipe(notify({
      title: 'ngAnnotate',
      subtitle: 'Angular Compiled!',
      message: ' '
    }));
});

gulp.task('js-deps', function () {
  gulp.src([
      './node_modules/angular/angular.min.js',
      './node_modules/angular-ui-router/release/angular-ui-router.min.js'
      //Add your scripts here
    ])
    .pipe(concat('deps.js'))
    .pipe(gulp.dest('./build/js'));
});

gulp.task('less', function () {
  gulp.src([
      './less/app.less' //main entry point for styles. All other sheets should be included here.
    ])
    .pipe(plumber())
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(gulp.dest('./build/css'));
});

gulp.task('copy-img', function () {
  gulp.src(['./images/*.*', './images/**/*.*'])
    .pipe(gulp.dest('./build/images'));
});

gulp.task('css-deps', function () {
  gulp.src([
      './node_modules/bootstrap/dist/css/bootstrap.min.css',
      './node_modules/font-awesome/css/font-awesome.min.css'
      //Add your third party styles here
    ])
    .pipe(concat('deps.css'))
    .pipe(gulp.dest('./build/css'));

  gulp.src('./node_modules/font-awesome/fonts/*.*')
    .pipe(gulp.dest('./build/fonts'));

  gulp.src('./fonts/**/*.*')
    .pipe(gulp.dest('./build/css'));
});

gulp.task('favicon', function () {
  gulp.src('./app/favicon.ico')
    .pipe(gulp.dest('./build'));
});

gulp.task('watch', function () {
  gulp.watch([
    './build/**/*.js',
    './build/**/*.css',
    './build/**/*.html'
  ], function (event) {
    return gulp.src(event.path)
      .pipe(livereload());
  });

  gulp.watch(['.env'], ['env']);
  gulp.watch(['app/*.js', 'app/**/*.js'], ['scripts']);
  gulp.watch('less/**/*.less', ['less']);
  gulp.watch('app/**/*.html', ['templates']);
  gulp.watch('images/**/*.*', ['copy-img']);
});

gulp.task('serve', ['env', 'scripts', 'js-deps', 'css-deps', 'templates', 'less', 'copy-img', 'favicon', 'watch'], function () {
  nodemon({
    script: 'app.js',
    ext: 'js html ejs',
    ignore: ['node_modules']
  });

  livereload.listen();
});

gulp.task('publish', function() {
  // user must manually create ~/.aws/credentials file, AWS SDK will automatically check for it
  var publisher = awspublish.create({
    region: '', //example: 'us-west-2'
    params: {
      Bucket: '' //example: 'epicapp.s3sandbox.com'
    }
  });
  return gulp.src('./build/**/*.*')
    .pipe(publisher.publish())
    .pipe(publisher.cache())
    // warning sync will delete files in your bucket that are not in your local folder.
    .pipe(publisher.sync())
     // print upload updates to console
    .pipe(awspublish.reporter());
      states: ['create', 'update', 'delete']
});

/**
 * General Build
 */
gulp.task('default', ['serve']);
