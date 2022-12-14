(function(app) {
  'use strict';

  var helper = {};

  helper.remove = function(array, item) {
    var index = array.indexOf(item);
    if (index !== -1) {
      array.splice(index, 1);
    }
  };

  helper.find = function(array, callback) {
    for (var i = 0, len = array.length; i < len; i++) {
      if (callback(array[i], i, array)) {
        return array[i];
      }
    }
    return null;
  };

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
