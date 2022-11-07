(function(app) {
  'use strict';

  var dom = app.dom || require('../dom.js');
  var Events = app.Events || require('../base/events.js');

  var GeoNamesData = function(url) {
    this._url = url;
    this._loadPromise = null;
    this._data = [];
    this._events = new Events();
  };

  GeoNamesData.prototype.on = function() {
    return Events.prototype.on.apply(this._events, arguments);
  };

  GeoNamesData.prototype.load = function() {
    if (!this._loadPromise) {
      this._events.emit('loading');
      this._loadPromise = dom.loadJSON(this._url).then(function(data) {
        this._data = data;
        this._events.emit('loaded');
      }.bind(this)).catch(function() {
        this._loadPromise = null;
        this._events.emit('error');
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
