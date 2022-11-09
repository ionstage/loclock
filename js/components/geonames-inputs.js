(function(app) {
  'use strict';

  var dom = app.dom || require('../dom.js');

  var GeoNamesInputs = function(el, props) {
    this.el = el;
    this._geonamesAttrs = props.geonamesAttrs;
    this._geonamesData = props.geonamesData;
    this._inputElement = this.el.querySelector('input');
    this._tableElement = this.el.querySelector('.preferences-table');
    this._tableControlsElement = this.el.querySelector('.preferences-table-controls');
  };

  GeoNamesInputs.prototype.init = function() {
    this._inputElement.addEventListener('change', this._changeEnabled.bind(this));
    this._geonamesAttrs.on('change:enabled', this._updateEnabled.bind(this));
    this._geonamesData.on('loading', this._updateState.bind(this, 'loading'));
    this._geonamesData.on('loaded', this._updateState.bind(this, 'loaded'));
    this._geonamesData.on('error', this._updateState.bind(this, 'error'));
  };

  GeoNamesInputs.prototype._changeEnabled = function(event) {
    this._geonamesAttrs.set('enabled', event.target.checked);
  };

  GeoNamesInputs.prototype._updateEnabled = function(enabled) {
    this._inputElement.checked = enabled;
    dom.toggleClass(this._tableElement, 'disabled', !enabled);
    dom.toggleClass(this._tableControlsElement, 'disabled', !enabled);
  };

  GeoNamesInputs.prototype._updateState = function(state) {
    this.el.setAttribute('data-state', state);
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeoNamesInputs;
  } else {
    app.GeoNamesInputs = GeoNamesInputs;
  }
})(this.app || (this.app = {}));
