(function(app) {
  'use strict';

  var helper = app.helper || require('../helper.js');
  var dom = app.dom || require('../dom.js');
  var Events = app.Events || require('../base/events.js');

  var GeoNamesData = function(url) {
    this._url = url;
    this._loadPromise = null;
    this._cities = [];
    this._countries = null;
    this._events = new Events();
  };

  GeoNamesData.prototype.on = function() {
    return Events.prototype.on.apply(this._events, arguments);
  };

  GeoNamesData.prototype.load = function() {
    if (!this._loadPromise) {
      this._events.emit('loading');
      this._loadPromise = dom.loadJSON(this._url).then(function(data) {
        this._cities = data.map(function(props) { return new GeoNamesData.City(props); });
        this._events.emit('loaded');
      }.bind(this)).catch(function() {
        this._loadPromise = null;
        this._events.emit('error');
      }.bind(this));
    }
    return this._loadPromise;
  };

  GeoNamesData.prototype.getCountries = function() {
    if (this._loadPromise && !this._countries) {
      this._countries = this._cities.reduce(function(countries, city) {
        var country = city.getCountry();
        if (countries.indexOf(country) === -1) {
          countries.push(country);
        }
        return countries;
      }, []).sort(function(a, b) {
        return a.localeCompare(b);
      });
    }
    return this._countries;
  };

  GeoNamesData.prototype.findCities = function(country) {
    return this._cities.filter(function(city) {
      return (city.getCountry() === country);
    });
  };

  GeoNamesData.prototype.findCity = function(id) {
    return helper.find(this._cities, function(city) {
      return (city.getID() === id);
    });
  };

  GeoNamesData.City = (function() {
    var City = function(props) {
      this._id = props.id;
      this._country = props.country;
      this._name = props.name;
      this._timezone = props.timezone;
    };

    City.prototype.getID = function() {
      return this._id;
    };

    City.prototype.getCountry = function() {
      return this._country;
    };

    City.prototype.getName = function() {
      return this._name;
    };

    City.prototype.generateKey = function() {
      return this._timezone + '#/' + this._name + '#!gn' + this._id;
    };

    return City;
  })();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeoNamesData;
  } else {
    app.GeoNamesData = GeoNamesData;
  }
})(this.app || (this.app = {}));
