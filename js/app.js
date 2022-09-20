(function(app) {
  'use strict';

  var Root = app.Root || require('./components/root.js');

  var root = new Root();
  root.init();

  app._root = root;
})(this.app || (this.app = {}));
