var gulp         = require('gulp');
var plumber      = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var babel        = require('gulp-babel');
var concat       = require('gulp-concat');
var sass         = require('gulp-sass');
var connect      = require('gulp-connect');
// var browserSync  = require('browser-sync');
// var rename       = require('gulp-rename');
// var uglify       = require('gulp-uglify');

gulp.task('browser-sync', function() {
  browserSync( {
    server: {
       baseDir: 'src',
       routes: {
         '/data': 'data'
       }
    }
  } );
} );

gulp.task('bs-reload', function () {
  browserSync.reload();
} );

gulp.task('connect', function() {
  connect.server({
    root: ['src', 'data', 'static'],
    port: 3000
  });
});

gulp.task('styles', function() {
  gulp.src( ['src/styles/**/*.scss'] )
    .pipe( plumber( {
      errorHandler: function ( error ) {
        console.log( error.message );
        this.emit('end');
    } } ) )
    .pipe( sass() )
    .pipe( autoprefixer('last 2 versions') )
    .pipe( gulp.dest('src/static') )
    // .pipe( browserSync.reload( { stream:true } ) )
} );

gulp.task('scripts', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe( plumber( {
      errorHandler: function ( error ) {
        console.log( error.message );
        this.emit('end');
    } } ) )
    // .pipe( concat('index.js') )
    .pipe( babel() )
    .pipe( gulp.dest('src/static/') )
    // maybe we want this later, or delete it
    // .pipe( rename( {suffix: '.min'} ) )
    // .pipe( uglify() )
    // .pipe( browserSync.reload( { stream:true } ) )
} );

gulp.task('build', ['styles', 'scripts'] );

// server default task
gulp.task('default', ['build'], function() {
} );

// gulp-connect server
// gulp.task('default', ['build', 'connect'], function() {
// } );

// browser-sync
// gulp.task('default', ['browser-sync', 'build'], function() {
//   gulp.watch('src/styles/**/*.scss', ['styles'] );
//   gulp.watch('src/scripts/**/*.js', ['scripts'] );
//   gulp.watch('src/*.html', ['bs-reload'] );
// } );
