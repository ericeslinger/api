const gulp = require('gulp');

function run(done) {
  process.on('unhandledRejection', r => console.log(r));
}

gulp.task('run', gulp.series('clean', 'build', run));
