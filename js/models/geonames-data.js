(function(app) {
  'use strict';

  var dom = app.dom || require('../dom.js');

  var GeoNamesData = function(url) {
    this._url = url;
    this._loadPromise = null;
    this._data = [];
  };

  GeoNamesData.prototype.load = function() {
    if (!this._loadPromise) {
      this._loadPromise = dom.loadJSON(this._url).then(function(data) {
        this._data = data;
      }.bind(this));
    }
    return this._loadPromise;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeoNamesData;
  } else {
    app.GeoNamesData = GeoNamesData;
  }
})(this.app || (this.app = {}));
