(function(app) {
  'use strict';

  var dom = app.dom || require('../dom.js');
  var Attributes = app.Attributes || require('../base/attributes.js');
  var Collection = app.Collection || require('../base/collection.js');
  var Events = app.Events || require('../base/events.js');
  var Location = app.Location || require('../models/location.js');

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
      this._bodyElement = this.el.querySelector('.preferences-table-body');
      this._geonamesAttrs = props.geonamesAttrs;
      this._geonamesData = props.geonamesData;
      this._geonamesLocations = props.geonamesLocations;
    };

    Table.prototype.init = function() {
      this._geonamesAttrs.on('change:enabled', this._updateEnabled.bind(this));
      this._geonamesLocations.on('add', this._addRow.bind(this));
    };

    Table.prototype._updateEnabled = function(enabled) {
      dom.toggleClass(this.el, 'disabled', !enabled);
    };

    Table.prototype._addRow = function(location) {
      var cityID = location.key.split('#!gn')[1];
      if (!cityID) {
        return;
      }
      var city = this._geonamesData.findCity(cityID);
      if (!city) {
        return;
      }
      var row = new GeoNamesInputs.TableRow({ city: city, key: location.key });
      this._bodyElement.appendChild(row.el);
    };

    return Table;
  })();

  GeoNamesInputs.TableRow = (function() {
    var TableRow = function(props) {
      this.el = this._createElement(props.city);
      this._key = props.key;
    };

    TableRow.prototype._createElement = function(city) {
      var texts = [
        '<div class="preferences-table-row">',
          '<div class="preferences-table-data">' + city.getCountry() + '</div>',
          '<div class="preferences-table-data">' + city.getName() + '</div>',
          '<div class="preferences-table-data">×</div>',
        '</div>',
      ];
      return dom.render(texts.join(''));
    };

    return TableRow;
  })();

  GeoNamesInputs.TableControls = (function() {
    var TableControls = function(el, props) {
      this.el = el;
      this._geonamesAttrs = props.geonamesAttrs;
      this._geonamesData = props.geonamesData;
      this._geonamesLocations = props.geonamesLocations;
      this._selectedCityID = null;
      this._countrySelectOptions = new Collection();
      this._nameSelectOptions = new Collection();
      this._nameSelectAttrs = new Attributes({ disabled: true });
      this._addButtonAttrs = new Attributes({ disabled: true });
      this._countrySelect = new GeoNamesInputs.TableSelect(this.el.querySelector(".preferences-table-select[name='country']"), {
        options: this._countrySelectOptions,
        attrs: new Attributes({ disabled: false }),
      });
      this._nameSelect = new GeoNamesInputs.TableSelect(this.el.querySelector(".preferences-table-select[name='name']"), {
        options: this._nameSelectOptions,
        attrs: this._nameSelectAttrs,
      });
      this._addButton = new GeoNamesInputs.TableButton(this.el.querySelector('.preferences-table-add-button'), {
        attrs: this._addButtonAttrs,
      });
    };

    TableControls.prototype.init = function() {
      this._countrySelect.init();
      this._nameSelect.init();
      this._addButton.init();
      this._geonamesAttrs.on('change:enabled', this._updateEnabled.bind(this));
      this._geonamesData.on('loaded', this._resetCountrySelect.bind(this));
      this._countrySelect.on('change', this._resetNameSelect.bind(this));
      this._nameSelect.on('change', this._selectName.bind(this));
      this._addButton.on('click', this._addButtonClicked.bind(this));
    };

    TableControls.prototype._updateEnabled = function(enabled) {
      dom.toggleClass(this.el, 'disabled', !enabled);
    };

    TableControls.prototype._resetCountrySelect = function() {
      var options = this._geonamesData.getCountries().map(function(country) {
        return { value: country, label: country, selected: false };
      });
      options.unshift({ value: '', label: '--Select--', selected: true });
      this._countrySelectOptions.reset(options);
      this._nameSelectAttrs.set('disabled', true);
      this._addButtonAttrs.set('disabled', true);
      this._selectedCityID = null;
    };

    TableControls.prototype._resetNameSelect = function(country) {
      var cities = this._geonamesData.findCities(country);
      if (cities.length === 0) {
        this._nameSelectOptions.reset([]);
        this._nameSelectAttrs.set('disabled', true);
        this._addButtonAttrs.set('disabled', true);
        this._selectedCityID = null;
        return;
      }
      var options = cities.map(function(city) {
        return { value: city.getID(), label: city.getName(), selected: false };
      }).sort(function(a, b) {
        return a.label.localeCompare(b.label);
      });
      options.unshift({ value: '', label: '--Select--', selected: true });
      this._nameSelectOptions.reset(options);
      this._nameSelectAttrs.set('disabled', false);
      this._addButtonAttrs.set('disabled', true);
      this._selectedCityID = null;
    };

    TableControls.prototype._selectName = function(cityID) {
      this._addButtonAttrs.set('disabled', !cityID);
      this._selectedCityID = cityID;
    };

    TableControls.prototype._addButtonClicked = function() {
      if (!this._selectedCityID) {
        return;
      }
      var city = this._geonamesData.findCity(this._selectedCityID);
      if (!city) {
        return;
      }
      var location = Location.get(city.generateKey());
      if (!location) {
        return;
      }
      this._geonamesLocations.add(location);
    };

    return TableControls;
  })();

  GeoNamesInputs.TableSelect = (function() {
    var TableSelect = function(el, props) {
      this.el = el;
      this._options = props.options;
      this._attrs = props.attrs;
      this._events = new Events();
    };

    TableSelect.prototype.init = function() {
      this.el.addEventListener('change', this._onchange.bind(this));
      this._options.on('reset', this._reset.bind(this));
      this._attrs.on('change:disabled', this._updateDisabled.bind(this));
      this._updateDisabled(this._attrs.get('disabled'));
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

    TableSelect.prototype._updateDisabled = function(disabled) {
      this.el.disabled = disabled;
    };

    TableSelect.prototype._onchange = function() {
      var value = this.el.options[this.el.selectedIndex].value;
      this._events.emit('change', value);
    };

    return TableSelect;
  })();

  GeoNamesInputs.TableButton = (function() {
    var TableButton = function(el, props) {
      this.el = el;
      this._attrs = props.attrs;
      this._events = new Events();
    };

    TableButton.prototype.init = function() {
      this.el.addEventListener('click', this._events.emit.bind(this._events, 'click'));
      this._attrs.on('change:disabled', this._updateDisabled.bind(this));
      this._updateDisabled(this._attrs.get('disabled'));
    };

    TableButton.prototype.on = function() {
      return Events.prototype.on.apply(this._events, arguments);
    };

    TableButton.prototype._updateDisabled = function(disabled) {
      this.el.disabled = disabled;
    };

    return TableButton;
  })();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeoNamesInputs;
  } else {
    app.GeoNamesInputs = GeoNamesInputs;
  }
})(this.app || (this.app = {}));
