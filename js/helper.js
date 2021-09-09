(function(app) {
  'use strict';

  var helper = {};

  helper.debounce = function(func, delay) {
    var t = 0;
    var ctx = null;
    var args = null;
    return function() {
      ctx = this;
      args = arguments;
      if (t) {
        clearTimeout(t);
      }
      t = setTimeout(function() {
        func.apply(ctx, args);
        t = 0;
        ctx = null;
        args = null;
      }, delay);
    };
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = helper;
  } else {
    app.helper = helper;
  }
})(this.app || (this.app = {}));
