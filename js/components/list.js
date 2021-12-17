(function(app) {
  'use strict';

  var IScroll = require('iscroll');
  var dom = app.dom || require('./dom.js');
  var Location = app.Location || require('../models/location.js');

  var List = function(el, ontoggle, props) {
    this.el = el;
    this.scroll = null;
    this.ontoggle = ontoggle;
    this._locations = props.locations;
    this._selectedLocations = props.selectedLocations;
    this._itemElements = {};
  };

  List.prototype.init = function() {
    this.el.addEventListener(dom.supportsTouch() ? 'tap' : 'click', this._onclick.bind(this));
    this._locations.on('reset', this._resetLocations.bind(this));
    this._selectedLocations.on('reset', this._resetSelectedLocations.bind(this));
    if (dom.supportsTouch()) {
      this._disableNativeScroll();
      this._disableDoubleTapZoom();
    }
  };

  List.prototype._resetLocations = function(locations) {
    var container = document.createElement('div');

    this._itemElements = locations.slice().sort(function(a, b) {
      return (a.name < b.name || a.key === Location.KEY_CURRENT_LOCATION ? -1 : 1);
    }).reduce(function(ret, location) {
      var el = this._createItemElement(location);
      container.appendChild(el);
      ret[location.key] = el;
      return ret;
    }.bind(this), {});

    this.el.replaceChild(container, this.el.firstElementChild);

    if (dom.supportsTouch()) {
      if (this.scroll) {
        this.scroll.destroy();
      }

      this.scroll = new IScroll(this.el, {
        tap: true,
        scrollbars: true,
        shrinkScrollbars: 'scale',
        fadeScrollbars: true,
      });
    }
  };

  List.prototype._resetSelectedLocations = function(selectedLocations) {
    this._locations.forEach(function(location) {
      var el = this._itemElements[location.key];
      if (selectedLocations.indexOf(location) !== -1) {
        el.classList.add('list-selected');
      } else {
        el.classList.remove('list-selected');
      }
    }.bind(this));
  };

  List.prototype._createItemElement = function(location) {
    var el = document.createElement('div');
    el.classList.add('list-item');
    el.setAttribute('data-key', location.key);
    var textLength = location.name.length;
    if (textLength >= 20) {
      el.style.fontSize = '11px';
    } else if (textLength >= 17) {
      el.style.fontSize = '14px';
    }
    el.textContent = location.name;
    return el;
  };

  List.prototype._onclick = function(event) {
    event.preventDefault();
    var target = event.target;
    if (!target.classList.contains('list-item')) {
      return;
    }
    var key = target.getAttribute('data-key');
    this.ontoggle(key);
  };

  List.prototype._disableNativeScroll = function() {
    this.el.style.overflowY = 'hidden';
  };

  List.prototype._disableDoubleTapZoom = function() {
    this.el.addEventListener('touchstart', function(event) {
      event.preventDefault();
    });
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = List;
  } else {
    app.List = List;
  }
})(this.app || (this.app = {}));
