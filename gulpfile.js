const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();

gulp.task('sass', () => {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./'))
    .pipe(browserSync.stream())
});

gulp.task('watch', () => {
  browserSync.init({
    server: {
      baseDir: './'
    },
  })

  gulp.watch('./scss/**/*.scss', gulp.series('sass')); 
  gulp.watch("./*.html").on('change', browserSync.reload);

});