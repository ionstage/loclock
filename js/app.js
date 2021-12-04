(function(app) {
  'use strict';

  var Main = app.Main || require('./components/main.js');

  app.main = new Main(document.querySelector('.main'));
  app.main.init();
})(this.app || (this.app = {}));
