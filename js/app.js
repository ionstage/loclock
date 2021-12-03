(function(app) {
  'use strict';

  var Main = app.Main || require('./components/main.js');

  var main = new Main(document.querySelector('.main'));
  main.init();
})(this.app || (this.app = {}));
