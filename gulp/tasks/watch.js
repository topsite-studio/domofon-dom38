module.exports = function () {
  $.gulp.task('watch', function () {
    $.gulp.watch('dev/font/**/*', $.gulp.series('fonts'));
    $.gulp.watch('dev/pug/**/*.pug', $.gulp.series('pug:dev'));
    //$.gulp.watch(['!dev/sass/libs.sass','dev/sass/**/*.sass','dev/pug/modules/**/*.sass'], $.gulp.series('sass:dev'));
    $.gulp.watch(['!dev/sass/libs.sass','dev/sass/**/*.{sass,scss}','dev/pug/modules/**/*.sass'], $.gulp.series('sass:dev'));
    $.gulp.watch('dev/sass/libs.sass', $.gulp.series('sassLibs:dev'));
    $.gulp.watch('dev/js/*.js', $.gulp.series('js:dev'));
//    $.gulp.watch(['dev/img/general/**/*', './dev/img/content/**/*'], $.gulp.series('img:dev','copyFavicon'));
    $.gulp.watch(['dev/img/general/**/*', './dev/img/content/**/*'], $.gulp.series('img:dev'));
    $.gulp.watch('dev/img/ico/**/*', $.gulp.series('sprite:dev'));
    $.gulp.watch('dev/img/svg/*.svg', $.gulp.series('svg'));
    $.gulp.watch('dev/root_file/**/*', $.gulp.series('copy'));
  });
};
