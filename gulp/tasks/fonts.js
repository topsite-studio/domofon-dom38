module.exports = function() {
  $.gulp.task('fonts', () => {
    return $.gulp.src('dev/font/**/*.*')
      .on('error', $.gp.notify.onError(function (error) {
      return {
        title: 'font',
        message: error.message
      };
    }))
      .pipe($.gulp.dest('build/font/'));
  });
};
