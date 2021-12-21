(function(app) {
  'use strict';

  var dom = app.dom || require('./dom.js');
  var Attributes = app.Attributes || require('../base/attributes.js');
  var Button = app.Button || require('./button.js');
  var Clock = app.Clock || require('./clock.js');
  var List = app.List || require('./list.js');

  var Main = function(el, props) {
    this.el = el;
    this._menuButton = new Button(this.el.querySelector('.menu-button'));
    this._list = new List(this.el.querySelector('.list'), props);
    this._clock = new Clock(this.el.querySelector('.clock'), { locations: props.selectedLocations });
    this._attrs = new Attributes({ listVisible: false });
  };

  Main.prototype.init = function() {
    this._menuButton.init();
    this._list.init();
    this._clock.init();

    this._attrs.on('change:listVisible', this._updateListVisibility.bind(this));
    this._menuButton.on('click', this._toggleList.bind(this));
    this._clock.on('pointerdown', this._hideList.bind(this));
  };

  Main.prototype.resize = function() {
    this._clock.resize();
  };

  Main.prototype._toggleList = function() {
    var visible = !this._attrs.get('listVisible');
    this._attrs.set('listVisible', visible);
    this._clock.setDragEnabled(!visible);
  };

  Main.prototype._hideList = function() {
    this._attrs.set('listVisible', false);
    this._clock.setDragEnabled(true);
  };

  Main.prototype._updateListVisibility = function(visible) {
    dom.toggleClass(this.el, 'list-visible', visible);
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Main;
  } else {
    app.Main = Main;
  }
})(this.app || (this.app = {}));
