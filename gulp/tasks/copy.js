module.exports = function() {
    $.gulp.task('copy', () => {
        return $.gulp.src('dev/root_file/**/*.*')
            .pipe($.gulp.dest('build/'));
    });
};
