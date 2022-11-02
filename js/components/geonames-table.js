(function(app) {
  'use strict';

  var GeoNamesTable = function(el) {
    this.el = el;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeoNamesTable;
  } else {
    app.GeoNamesTable = GeoNamesTable;
  }
})(this.app || (this.app = {}));
