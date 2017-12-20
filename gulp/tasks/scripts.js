const gulp = require('gulp');
const config = require('../config');
const sourcemaps = require('gulp-sourcemaps');
const ts = require('gulp-typescript');
const babel = require('gulp-babel');

function build() {
  const tsProject = ts.createProject('tsconfig.json');
  return gulp
    .src(config.scripts, { cwd: config.src })
    .pipe(tsProject())
    .pipe(
      babel({
        presets: [['env', { targets: { node: 'current' } }]],
      }),
    )
    .pipe(gulp.dest(config.dest));
}

gulp.task('buildScripts', build);

module.exports = build;
