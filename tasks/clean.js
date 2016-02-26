'use strict';

// Runs lint tests with jshint
module.exports = function(gulp, plugins, options) {
  return function () {
    return gulp.src(options.src)
      .pipe(plugins.clean({
        force: options.force || false
      }));
  };
};
