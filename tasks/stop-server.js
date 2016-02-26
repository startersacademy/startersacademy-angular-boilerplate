'use strict';

module.exports = function(gulp, plugins, options) {
  return function (code) {
    plugins.gutil.log('Stopping server');
    plugins.server.serverClose();
    setTimeout(function () {
      process.exit(code);
    }, 2000);
  };
};
