module.exports = function() {
  $.gulp.task('pug:dev', ()=>  {
    return $.gulp.src('dev/pug/pages/**/*.pug')
      .pipe($.gp.pug({
      locals : {
        nav: JSON.parse($.fs.readFileSync('data/navigation.json', 'utf8')),
        content: JSON.parse($.fs.readFileSync('data/content.json', 'utf8')),
      },
      pretty: true
    }))
      .on('error', $.gp.notify.onError(function(error) {
      return {
        title: 'Pug',
        message: error.message
      };
    }))
      .pipe($.gulp.dest('build/'))
//      .on('end', $.browserSync.reload);
      .pipe($.browserSync.reload({
        stream: true
      }))
  });

  $.gulp.task('pug:build', ()=>  {
    return $.gulp.src('dev/pug/pages/*.pug')
      .pipe($.gp.pug({
      locals : {
        nav: JSON.parse($.fs.readFileSync('data/navigation.json', 'utf8')),
        content: JSON.parse($.fs.readFileSync('data/content.json', 'utf8')),
      },
      pretty: true
    }))
      .on('error', $.gp.notify.onError(function(error) {
      return {
        title: 'Pug',
        message: error.message
      };
    }))
      .pipe($.gp.removeCode({ production: true }))
      .pipe($.gulp.dest('build/'));
  });
};
