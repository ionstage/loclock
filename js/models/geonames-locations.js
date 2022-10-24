(function(app) {
  'use strict';

  var GeoNamesLocations = function() {};

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeoNamesLocations;
  } else {
    app.GeoNamesLocations = GeoNamesLocations;
  }
})(this.app || (this.app = {}));
