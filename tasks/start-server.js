'use strict';

module.exports = function (gulp, plugins, options) {
  var _ = require('underscore');
  var defaultOptions = {
    root: 'app/',
    port: 8888
  };
  _.defaults(options, defaultOptions);
  return function (done) {
    plugins.server.server(options);
  };
};
