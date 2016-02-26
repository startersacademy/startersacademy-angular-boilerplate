'use strict';

// Project specific paths
var srcLint = [
  'app/**/*.js',
  'spec/**/*.js',
  'tasks/**/*.js'
];
var srcWatch = [
  './app/**/*.js',
  './spec/**/*.js'
];
var srcClean = [
  './dist/*'
];
var srcMinifyCss = ['./app/**/*.css'];
var srcMinifyJs = ['./app/**/*.js'];
var srcCopy = ['./app/**/*.html'];

var destMinifyCss = './dist/';
var destMinifyJs = './dist/';
var destCopy = './dist/';

var jsHintReporter = 'default';
var jasmineOptions = {
  verbose: true,
  includeStackTrace: true
};

var karmaConfigPath = __dirname + '/karma.conf.js';
var karmaReporters = ['dots'];

var serverOptions = {
  root: 'app/',
  port: 8888
};

var gulp = require('gulp');

// Plugins needed for tasks
var plugins = {
  gutil: require('gulp-util'),
  gulpSequence: require('gulp-sequence'),
  server: require('gulp-connect'),
  jasmine: require('gulp-jasmine'),
  karma: require('karma'),
  jshint: require('gulp-jshint'),
  clean: require('gulp-clean'),
  minifyCss: require('gulp-minify-css'),
  minifyJs: require('gulp-uglify'),
  concat: require('gulp-concat')
};

// Utility function to set up the task
function getTask(task, options){
  return require('./tasks/' + task)(gulp, plugins, options);
}

// Supporting tasks
gulp.task('server:start', getTask('start-server', serverOptions));
gulp.task('server:restart', getTask('restart-server'));
gulp.task('server:stop', getTask('stop-server'));
gulp.task('test:lint', getTask('test-lint', {
  src: srcLint,
  reporter: jsHintReporter
}));
gulp.task('test:unit', getTask('test-unit', {
  configPath: karmaConfigPath,
  reporters: karmaReporters,
  singleRun: true,
  autoWatch: false
}));
gulp.task('test:unit:tdd', getTask('test-unit', { //restarts on changes
  configPath: karmaConfigPath,
  reporter: karmaReporters,
  singleRun: false,
  autoWatch: true
}));
gulp.task('clean', getTask('clean', {
  src: srcClean,
  force: true
}));
gulp.task('minify-css', getTask('minify-css', {
  src: srcMinifyCss,
  comments: true,
  spare: true,
  dest: destMinifyCss
}));
gulp.task('minify-js', getTask('minify-js', {
  src: srcMinifyJs,
  dest: destMinifyJs
}));
gulp.task('copy', getTask('copy', {
  src: srcCopy,
  dest: destCopy
}));

// Runs entire test suite
gulp.task('test:all', function(done){
  plugins.gulpSequence(
    'test:lint',
    'test:unit'
  )(done);
});



// Restarts server on code changes
gulp.task('default', ['server:start'], function(){
  gulp.watch(srcWatch, ['server:restart']);
});

// Shortcut to run the entire test suite
gulp.task('test', ['test:all'], getTask('exit-process'));

// Runs unit test suite
gulp.task('test:tdd', function(done){
  plugins.gulpSequence(
    'test:lint',
    'test:unit',
    'build',
    'server:restart'
  )(done);
});

// Restarts server on code changes
gulp.task('tdd', function(){
  gulp.watch(srcWatch, ['test:tdd']);
});

gulp.task('build', function(done) {
  plugins.gulpSequence(
    'clean',
    ['minify-css', 'minify-js', 'copy']
  )(done);
});
