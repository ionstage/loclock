(function(app) {
  'use strict';

  var Dialog = function(el) {
    this.el = el;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dialog;
  } else {
    app.Dialog = Dialog;
  }
})(this.app || (this.app = {}));
