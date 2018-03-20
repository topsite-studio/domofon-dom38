global.$ = {
  path: {
    task:      require('./gulp/paths/tasks.js')
  },
  gulp:        require('gulp'),
  del:         require('del'),
  fs:          require('fs'),
  browserSync: require('browser-sync').create(),
  gp:          require('gulp-load-plugins')(),
  colors:      require('colors'),
  gcmq:        require('gulp-group-css-media-queries')
};



//let filePaths = {
//  from: { js: 'app.js',
//        constants: 'constants.js',
//        html: 'index.html',
//        css: 'style.css'
//       },
//  to: {
//    js: 'dist/',
//    constants: 'dist/',
//    html: 'dist/',
//    css: 'dist/'
//  }
//};


$.path.task.forEach(function(taskPath) {
  require(taskPath)();
});

$.gulp.task('dev', $.gulp.series(
  'clean', 'sprite:dev',
  $.gulp.parallel('sassLibs:dev','sass:dev', 'pug:dev', 'libsJS:dev', 'js:dev', 'svg', 'sprite:dev', 'img:dev', 'fonts', 'copy')));

$.gulp.task('build', $.gulp.series(
  'clean',
  $.gulp.parallel('sassLibs:build','sass:build', 'pug:build', 'libsJS:build', 'js:build', 'svg', 'sprite:dev', 'img:build', 'fonts', 'copy')));


$.gulp.task('default', $.gulp.series(
  'dev',
  $.gulp.parallel(
    'watch',
    'serve'
  )
));
