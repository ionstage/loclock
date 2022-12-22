(function(app) {
  'use strict';

  var ClockLocations = function() {};

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClockLocations;
  } else {
    app.ClockLocations = ClockLocations;
  }
})(this.app || (this.app = {}));
