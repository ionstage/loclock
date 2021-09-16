(function(app) {
  'use strict';

  var dom = {};

  dom.supportsTouch = function() {
    return ('ontouchstart' in window || (typeof DocumentTouch !== 'undefined' && document instanceof DocumentTouch));
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = dom;
  } else {
    app.dom = dom;
  }
})(this.app || (this.app = {}));
