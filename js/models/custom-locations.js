(function(app) {
  'use strict';

  var CustomLocations = function() {};

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CustomLocations;
  } else {
    app.CustomLocations = CustomLocations;
  }
})(this.app || (this.app = {}));
