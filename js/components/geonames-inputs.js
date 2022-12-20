(function(app) {
  'use strict';

  var helper = app.helper || require('../helper.js');
  var dom = app.dom || require('../dom.js');
  var Attributes = app.Attributes || require('../base/attributes.js');
  var Button = app.Button || require('./button.js');
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

    this._updateEnabled(this._geonamesAttrs.get('enabled'));
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
      this._geonamesData = props.geonamesData;
      this._geonamesLocations = props.geonamesLocations;
      this._rows = [];
      this._bodyElement = this.el.querySelector('.preferences-table-body');
      this._removeLocation = this._removeLocation.bind(this);
    };

    Table.prototype.init = function() {
      this._geonamesAttrs.on('change:enabled', this._updateEnabled.bind(this));
      this._geonamesLocations.on('reset', this._resetRows.bind(this));
      this._geonamesLocations.on('add', this._addRow.bind(this));
      this._geonamesLocations.on('remove', this._removeRow.bind(this));
      this._updateEnabled(this._geonamesAttrs.get('enabled'));
    };

    Table.prototype._updateEnabled = function(enabled) {
      dom.toggleClass(this.el, 'disabled', !enabled);
    };

    Table.prototype._resetRows = function(locations) {
      this._clearRows();
      this._addRows(locations);
    };

    Table.prototype._clearRows = function() {
      this._rows.forEach(function(row) {
        this._bodyElement.removeChild(row.el);
        row.off('delete', this._removeLocation);
        row.deinit();
      }.bind(this));
      this._rows = [];
    };

    Table.prototype._addRows = function(locations) {
      locations.forEach(function(location) {
        this._addRow(location);
      }.bind(this));
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
      row.init();
      row.on('delete', this._removeLocation);
      this._rows.push(row);
      this._bodyElement.appendChild(row.el);
    };

    Table.prototype._removeRow = function(location) {
      var row = helper.find(this._rows, function(row) {
        return (row.key === location.key);
      });
      if (!row) {
        return;
      }
      this._bodyElement.removeChild(row.el);
      helper.remove(this._rows, row);
      row.off('delete', this._removeLocation);
      row.deinit();
    };

    Table.prototype._removeLocation = function(key) {
      var location = Location.get(key);
      if (location) {
        this._geonamesLocations.remove(location);
      }
    };

    return Table;
  })();

  GeoNamesInputs.TableRow = (function() {
    var TableRow = function(props) {
      this.el = this._createElement(props.city);
      this.key = props.key;
      this._events = new Events();
      this._deleteButton = new Button(this.el.querySelector('.preferences-table-delete-button'));
      this._deleteButtonClicked = this._deleteButtonClicked.bind(this);
    };

    TableRow.prototype.init = function() {
      this._deleteButton.init();
      this._deleteButton.on('click', this._deleteButtonClicked);
    };

    TableRow.prototype.deinit = function() {
      this._deleteButton.off('click', this._deleteButtonClicked);
      this._deleteButton.deinit();
    };

    TableRow.prototype.on = function() {
      return Events.prototype.on.apply(this._events, arguments);
    };

    TableRow.prototype.off = function() {
      return Events.prototype.off.apply(this._events, arguments);
    };

    TableRow.prototype._createElement = function(city) {
      var texts = [
        '<div class="preferences-table-row">',
          '<div class="preferences-table-data">' + city.getCountry() + '</div>',
          '<div class="preferences-table-data">' + city.getName() + '</div>',
          '<div class="preferences-table-data preferences-table-delete-button">×</div>',
        '</div>',
      ];
      return dom.render(texts.join(''));
    };

    TableRow.prototype._deleteButtonClicked = function() {
      this._events.emit('delete', this.key);
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

    TableControls._MAX_LOCATION_SIZE = 30;

    TableControls.prototype.init = function() {
      this._countrySelect.init();
      this._nameSelect.init();
      this._addButton.init();

      this._geonamesAttrs.on('change:enabled', this._updateEnabled.bind(this));
      this._geonamesData.on('loaded', this._resetCountrySelect.bind(this));
      this._geonamesLocations.on('reset', this._updateAddButtonEnabled.bind(this));
      this._geonamesLocations.on('add', this._updateAddButtonEnabled.bind(this));
      this._geonamesLocations.on('remove', this._updateAddButtonEnabled.bind(this));
      this._countrySelect.on('change', this._resetNameSelect.bind(this));
      this._nameSelect.on('change', this._selectName.bind(this));
      this._addButton.on('click', this._addButtonClicked.bind(this));

      this._updateEnabled(this._geonamesAttrs.get('enabled'));
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
      this._nameSelectOptions.reset([]);
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
      this._selectedCityID = cityID;
      this._updateAddButtonEnabled();
    };

    TableControls.prototype._canAddLocation = function() {
      if (!this._selectedCityID) {
        return false;
      }
      if (this._geonamesLocations.length >= TableControls._MAX_LOCATION_SIZE) {
        return false;
      }
      var isIncluded = (this._geonamesLocations.find(function(location) {
        var cityID = location.key.split('#!gn')[1];
        return (cityID === this._selectedCityID);
      }.bind(this)) !== null);
      return !isIncluded;
    };

    TableControls.prototype._addButtonClicked = function() {
      if (!this._canAddLocation()) {
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
      this._resetCountrySelect();
    };

    TableControls.prototype._updateAddButtonEnabled = function() {
      this._addButtonAttrs.set('disabled', !this._canAddLocation());
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
