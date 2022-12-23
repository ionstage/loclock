(function(app) {
  'use strict';

  var ClockLocations = function(presetLocations, geonamesLocations) {
    this._presetLocations = presetLocations;
    this._geonamesLocations = geonamesLocations;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClockLocations;
  } else {
    app.ClockLocations = ClockLocations;
  }
})(this.app || (this.app = {}));
