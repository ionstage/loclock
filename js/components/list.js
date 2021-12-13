(function(app) {
  'use strict';

  var IScroll = require('iscroll');
  var dom = app.dom || require('./dom.js');
  var Location = app.Location || require('../models/location.js');

  var List = function(el, ontoggle) {
    this.items = {};
    this.currentSelectedItems = [];
    this.el = el;
    this.scrolling = false;
    this.clickable = true;
    this.ontoggle = ontoggle;
  };

  List.prototype.init = function() {
    this.el.addEventListener('click', function(event) {
      event.preventDefault();
      if (this.scrolling || !this.clickable) {
        this.scrolling = false;
        this.clickable = true;
        return;
      }
      this.onclick(event);
    }.bind(this));

    this.el.addEventListener('touchstart', function() {
      this.clickable = !this.scrolling;
    }.bind(this));

    if (dom.supportsTouch()) {
      this.el.classList.add('unscrollable');
    }
  };

  List.prototype.setList = function(locations) {
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
        this.scroll = null;
      }

      this.scroll = new IScroll(this.el, {
        click: true,
        scrollbars: true,
        shrinkScrollbars: 'scale',
        fadeScrollbars: true,
      });

      this.scroll.on('scrollStart', function() {
        this.scrolling = true;
      }.bind(this));

      this.scroll.on('scrollEnd', function() {
        this.scrolling = false;
      }.bind(this));
    }
  };

  List.prototype.update = function(selectedLocations) {
    if (this.currentSelectedItems.length > selectedLocations.length) {
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

  List.prototype.onclick = function(event) {
    var target = event.target;
    if (!target.classList.contains('list-item')) {
      return;
    }
    var key = target.getAttribute('data-key');
    this.ontoggle(key);
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = List;
  } else {
    app.List = List;
  }
})(this.app || (this.app = {}));
