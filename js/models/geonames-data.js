(function(app) {
  'use strict';

  var GeoNamesData = function() {};

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeoNamesData;
  } else {
    app.GeoNamesData = GeoNamesData;
  }
})(this.app || (this.app = {}));
