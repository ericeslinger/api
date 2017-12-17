const gulp = require('gulp');
const config = require('../config');
// const sourcemaps = require('gulp-sourcemaps');
// const ts = require('gulp-typescript');
// const babel = require('gulp-babel');

function graphql() {
  return gulp
    .src('**/*.graphql', { cwd: config.src })
    .pipe(gulp.dest(config.dest));
}

gulp.task('graphql', graphql);

module.exports = graphql;
