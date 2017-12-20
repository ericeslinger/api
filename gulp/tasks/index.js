const gulp = require('gulp');
require('./scripts');
require('./graphql');
gulp.task('build', gulp.parallel('buildScripts', 'graphql'));
require('./clean');
require('./run');
require('./test');
