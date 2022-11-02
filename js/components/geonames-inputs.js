(function(app) {
  'use strict';

  var GeoNamesInputs = function(el) {
    this.el = el;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeoNamesInputs;
  } else {
    app.GeoNamesInputs = GeoNamesInputs;
  }
})(this.app || (this.app = {}));
