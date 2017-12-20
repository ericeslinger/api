const gulp = require('gulp');

function run(done) {
  process.on('unhandledRejection', r => console.log(r));
  const server = require('../../dist/server');
  const as = new server.APIServer();
  as.start(true);
}

gulp.task('run', gulp.series('clean', 'build', run));
