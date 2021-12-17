(function(app) {
  'use strict';

  var IScroll = require('iscroll');
  var dom = app.dom || require('./dom.js');
  var Location = app.Location || require('../models/location.js');

  var List = function(el, ontoggle, props) {
    this.items = {};
    this.currentSelectedItems = [];
    this.el = el;
    this.scroll = null;
    this.ontoggle = ontoggle;
    this._locations = props.locations;
  };

  List.prototype.init = function() {
    this.el.addEventListener(dom.supportsTouch() ? 'tap' : 'click', this._onclick.bind(this));
    this._locations.on('reset', this._resetLocations.bind(this));
    if (dom.supportsTouch()) {
      this._disableNativeScroll();
      this._disableDoubleTapZoom();
    }
  };

  List.prototype._resetLocations = function(locations) {
    var element = document.createElement('div');

    locations.slice().sort(function(a, b) {
      return (a.name < b.name || a.key === Location.KEY_CURRENT_LOCATION ? -1 : 1);
    }).forEach(function(location) {
      var item = document.createElement('div');
      var key = location.key;
      item.setAttribute('data-key', key);
      item.classList.add('list-item');
      var textLength = location.name.length;
      if (textLength >= 20) {
        item.style.fontSize = '11px';
      } else if (textLength >= 17) {
        item.style.fontSize = '14px';
      }
      item.textContent = location.name;
      element.appendChild(item);
      this.items[key] = item;
    }.bind(this));

    this.el.replaceChild(element, this.el.firstElementChild);

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

  List.prototype.update = function(selectedLocations) {
    if (this.currentSelectedItems.length > selectedLocations.size()) {
      this.currentSelectedItems.forEach(function(item) {
        item.classList.remove('list-selected');
      });
    }

    this.currentSelectedItems = selectedLocations.map(function(location) {
      var item = this.items[location.key];
      item.classList.add('list-selected');
      return item;
    }.bind(this));
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
