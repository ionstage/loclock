(function(app) {
  'use strict';

  var dom = app.dom || require('../dom.js');

  var GeoNamesInputs = function(el, props) {
    this.el = el;
    this._geonamesAttrs = props.geonamesAttrs;
    this._inputElement = this.el.querySelector('input');
    this._tableElement = this.el.querySelector('.preferences-table');
    this._tableControlsElement = this.el.querySelector('.preferences-table-controls');
  };

  GeoNamesInputs.prototype.init = function() {
    this._inputElement.addEventListener('change', this._changeEnabled.bind(this));
    this._geonamesAttrs.on('change:enabled', this._updateEnabled.bind(this));
  };

  GeoNamesInputs.prototype._changeEnabled = function(event) {
    this._geonamesAttrs.set('enabled', event.target.checked);
  };

  GeoNamesInputs.prototype._updateEnabled = function(enabled) {
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
