(function(app) {
  'use strict';

  var Preferences = function(el) {
    this.el = el;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Preferences;
  } else {
    app.Preferences = Preferences;
  }
})(this.app || (this.app = {}));
