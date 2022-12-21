(function(app) {
  'use strict';

  var IScroll = require('iscroll');
  var dom = app.dom || require('../dom.js');

  var List = function(el, props) {
    this.el = el;
    this._locations = props.locations;
    this._selectedLocations = props.selectedLocations;
    this._itemElements = {};
    this._iScroll = null;
  };

  List.prototype.init = function() {
    this.el.addEventListener(dom.supportsTouch() ? 'tap' : 'click', this._onclick.bind(this));

    this._locations.on('reset', this._resetLocations.bind(this));
    this._selectedLocations.on('reset', this._resetSelectedLocations.bind(this));
    this._selectedLocations.on('add', this._addSelectedLocation.bind(this));
    this._selectedLocations.on('remove', this._removeSelectedLocation.bind(this));

    if (dom.supportsTouch()) {
      this._disableNativeScroll();
      this._disableDoubleTapZoom();
    }
  };

  List.prototype._resetLocations = function(locations) {
    var fragment = document.createDocumentFragment();

    this._itemElements = locations.reduce(function(elements, location) {
      var el = this._createItemElement(location, this._selectedLocations.includes(location));
      fragment.appendChild(el);
      elements[location.key] = el;
      return elements;
    }.bind(this), {});

    var content = this.el.querySelector('.list-content');
    content.innerHTML = '';
    content.appendChild(fragment);

    if (dom.supportsTouch()) {
      if (this._iScroll) {
        setTimeout(function() {
          this._iScroll.refresh();
        }.bind(this), 0);
      } else {
        this._iScroll = this._createIScroll();
      }
    }
  };

  List.prototype._resetSelectedLocations = function(selectedLocations) {
    this._locations.forEach(function(location) {
      var el = this._itemElements[location.key];
      dom.toggleClass(el, 'selected', selectedLocations.indexOf(location) !== -1);
    }.bind(this));
  };

  List.prototype._addSelectedLocation = function(location) {
    var el = this._itemElements[location.key];
    if (el) {
      el.classList.add('selected');
    }
  };

  List.prototype._removeSelectedLocation = function(location) {
    var el = this._itemElements[location.key];
    if (el) {
      el.classList.remove('selected');
    }
  };

  List.prototype._createItemElement = function(location, selected) {
    var el = document.createElement('div');
    el.className = 'list-item' + (selected ? ' selected' : '');
    el.dataset.key = location.key;
    var textLength = location.name.length;
    if (textLength >= 17) {
      el.style.fontSize = Math.min(5 + 150 / textLength, 16) + 'px';
    }
    el.textContent = location.name;
    return el;
  };

  List.prototype._createIScroll = function() {
    return new IScroll(this.el, {
      tap: true,
      scrollbars: true,
      shrinkScrollbars: 'scale',
      fadeScrollbars: true,
    });
  };

  List.prototype._onclick = function(event) {
    event.preventDefault();
    var target = event.target;
    if (!target.classList.contains('list-item')) {
      return;
    }
    var key = target.dataset.key;
    var location = this._locations.find(function(location) {
      return (location.key === key);
    });
    if (!location) {
      return;
    }
    // toggle selection of location
    if (this._selectedLocations.includes(location)) {
      this._selectedLocations.remove(location);
    } else {
      this._selectedLocations.add(location);
    }
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
