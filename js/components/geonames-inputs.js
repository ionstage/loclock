(function(app) {
  'use strict';

  var dom = app.dom || require('../dom.js');
  var Collection = app.Collection || require('../base/collection.js');
  var Events = app.Events || require('../base/events.js');

  var GeoNamesInputs = function(el, props) {
    this.el = el;
    this._geonamesAttrs = props.geonamesAttrs;
    this._geonamesData = props.geonamesData;
    this._inputElement = this.el.querySelector('input');
    this._table = new GeoNamesInputs.Table(this.el.querySelector('.preferences-table'), props);
    this._tableControls = new GeoNamesInputs.TableControls(this.el.querySelector('.preferences-table-controls'), props);
  };

  GeoNamesInputs.prototype.init = function() {
    this._table.init();
    this._tableControls.init();
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
  };

  GeoNamesInputs.prototype._updateState = function(state) {
    this.el.setAttribute('data-state', state);
  };

  GeoNamesInputs.Table = (function() {
    var Table = function(el, props) {
      this.el = el;
      this._geonamesAttrs = props.geonamesAttrs;
    };

    Table.prototype.init = function() {
      this._geonamesAttrs.on('change:enabled', this._updateEnabled.bind(this));
    };

    Table.prototype._updateEnabled = function(enabled) {
      dom.toggleClass(this.el, 'disabled', !enabled);
    };

    return Table;
  })();

  GeoNamesInputs.TableControls = (function() {
    var TableControls = function(el, props) {
      this.el = el;
      this._geonamesAttrs = props.geonamesAttrs;
      this._geonamesData = props.geonamesData;
      this._countrySelectOptions = new Collection();
      this._nameSelectOptions = new Collection();
      this._countrySelect = new GeoNamesInputs.TableSelect(this.el.querySelector(".preferences-table-select[name='country']"), {
        options: this._countrySelectOptions,
      });
      this._nameSelect = new GeoNamesInputs.TableSelect(this.el.querySelector(".preferences-table-select[name='name']"), {
        options: this._nameSelectOptions,
      });
    };

    TableControls.prototype.init = function() {
      this._countrySelect.init();
      this._nameSelect.init();
      this._geonamesAttrs.on('change:enabled', this._updateEnabled.bind(this));
      this._geonamesData.on('loaded', this._dataLoaded.bind(this));
      this._countrySelect.on('change', this._countrySelected.bind(this));
    };

    TableControls.prototype._updateEnabled = function(enabled) {
      dom.toggleClass(this.el, 'disabled', !enabled);
    };

    TableControls.prototype._dataLoaded = function() {
      var options = this._geonamesData.getCountries().map(function(country) {
        return { value: country, label: country, selected: false };
      });
      options.unshift({ value: '', label: '--Select--', selected: true });
      this._countrySelectOptions.reset(options);
    };

    TableControls.prototype._countrySelected = function(country) {
      var cities = this._geonamesData.findCities(country);
      if (cities.length === 0) {
        this._nameSelectOptions.reset([]);
        return;
      }
      var options = cities.map(function(city) {
        return { value: city.generateKey(), label: city.getName(), selected: false };
      }).sort(function(a, b) {
        return a.label.localeCompare(b.label);
      });
      options.unshift({ value: '', label: '--Select--', selected: true });
      this._nameSelectOptions.reset(options);
    };

    return TableControls;
  })();

  GeoNamesInputs.TableSelect = (function() {
    var TableSelect = function(el, props) {
      this.el = el;
      this._options = props.options;
      this._events = new Events();
    };

    TableSelect.prototype.init = function() {
      this.el.addEventListener('change', this._onchange.bind(this));
      this._options.on('reset', this._reset.bind(this));
    };

    TableSelect.prototype.on = function() {
      return Events.prototype.on.apply(this._events, arguments);
    };

    TableSelect.prototype._reset = function(options) {
      var fragment = document.createDocumentFragment();
      options.forEach(function(option) {
        var s = '<option value="' + option.value + '"' + (option.selected ? ' selected' : '') + '>' + option.label + '</option>';
        fragment.appendChild(dom.render(s));
      });
      this.el.innerHTML = '';
      this.el.appendChild(fragment);
    };

    TableSelect.prototype._onchange = function() {
      var value = this.el.options[this.el.selectedIndex].value;
      this._events.emit('change', value);
    };

    return TableSelect;
  })();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeoNamesInputs;
  } else {
    app.GeoNamesInputs = GeoNamesInputs;
  }
})(this.app || (this.app = {}));
