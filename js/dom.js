(function(app) {
  'use strict';

  var dom = {};

  dom.supportsTouch = function() {
    return ('ontouchstart' in window || (typeof DocumentTouch !== 'undefined' && document instanceof DocumentTouch));
  };

  dom.animate = (function() {
    if (window.requestAnimationFrame) {
      return window.requestAnimationFrame.bind(window);
    }
    return function(callback) {
      return setTimeout(callback, 1000 / 60);
    };
  })();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = dom;
  } else {
    app.dom = dom;
  }
})(this.app || (this.app = {}));
