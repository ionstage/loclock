(function(app) {
  'use strict';

  var dom = app.dom || require('../dom.js');

  var GeoNamesInputs = function(el, props) {
    this.el = el;
    this._geonamesLocations = props.geonamesLocations;
    this._inputElement = this.el.querySelector('input');
    this._tableElement = this.el.querySelector('.preferences-table');
    this._tableControlsElement = this.el.querySelector('.preferences-table-controls');
  };

  GeoNamesInputs.prototype.init = function() {
    this._inputElement.addEventListener('change', this._changeGeoNamesLocations.bind(this));
    this._geonamesLocations.on('enabled', this._updateGeoNamesLocationsEnabled.bind(this, true));
    this._geonamesLocations.on('disabled', this._updateGeoNamesLocationsEnabled.bind(this, false));
  };

  GeoNamesInputs.prototype._changeGeoNamesLocations = function(event) {
    this._geonamesLocations.setEnabled(event.target.checked);
  };

  GeoNamesInputs.prototype._updateGeoNamesLocationsEnabled = function(enabled) {
    this._inputElement.checked = enabled;
    dom.toggleClass(this._tableElement, 'disabled', !enabled);
    dom.toggleClass(this._tableControlsElement, 'disabled', !enabled);
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeoNamesInputs;
  } else {
    app.GeoNamesInputs = GeoNamesInputs;
  }
})(this.app || (this.app = {}));
