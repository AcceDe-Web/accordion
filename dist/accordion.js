/**
 * @accede-web/accordion - WAI-ARIA accordion plugin based on AcceDe Web accessibility guidelines
 * @version v1.1.1
 * @link http://a11y.switch.paris/
 * @license ISC
 **/

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Accordion = factory());
}(this, (function () { 'use strict';

  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  /*eslint no-fallthrough: "off"*/
  var callbackEvents = ['hide', 'show'];
  var headersNodeNames = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];

  /**
   * Accordion constructor
   * @constructor
   * @param {Node} el - DOM node
   */

  var Accordion = function () {
    function Accordion(el) {
      _classCallCheck(this, Accordion);

      if (!el || !el.nodeName) {
        throw new Error('No DOM node provided. Abort.');
      }

      this.el = el;

      this.multiselectable = this.el.getAttribute('data-multiselectable') === 'true';

      this._accordion = {};

      this._callbacks = {};

      this._handleDisplay = this._handleDisplay.bind(this);
      this._handleFocus = this._handleFocus.bind(this);
      this._handleHeaders = this._handleHeaders.bind(this);
      this._handlePanelFocus = this._handlePanelFocus.bind(this);
      this._handlePanel = this._handlePanel.bind(this);
    }

    /**
     * Retrieve first activable header (that does not have `disabled` attribute)
     */


    _createClass(Accordion, [{
      key: '_firstActiveHeader',
      value: function _firstActiveHeader() {
        var activeHeaderIndex = void 0;

        this._accordion.headers.some(function (header, index) {
          if (!header.disabled) {
            activeHeaderIndex = index;

            return true;
          }
        });

        return activeHeaderIndex;
      }

      /**
       * Toggle display of the panel (show/hide)
       * @param {DOMEvent} e - Can be a `MouseEvent` or a `KeyboardEvent` object
       */

    }, {
      key: '_handleDisplay',
      value: function _handleDisplay(e) {
        e.preventDefault();

        var header = e.currentTarget;

        if (header.disabled) {
          return;
        }

        // ensure the header has the focus when a click occurs
        if (header !== document.activeElement) {
          header.focus();
        }

        this._toggleDisplay(this._accordion.headers.indexOf(header));
      }

      /**
       * Update the current header index before selecting the current panel
       * @param {DOMEvent} e - A `FocusEvent` object
       */

    }, {
      key: '_handleFocus',
      value: function _handleFocus(e) {
        var header = e.currentTarget;

        if (header.disabled) {
          return;
        }

        this._accordion.currentIndex = this._accordion.headers.indexOf(header);
      }

      /**
       * Handle keystroke on [role=panel]
       * @param {DOMEvent} e - A `KeyboardEvent` object
       */

    }, {
      key: '_handlePanel',
      value: function _handlePanel(e) {

        if (this._accordion.currentIndex === undefined) {
          this._handlePanelFocus(e);
        }

        switch (e.keyCode) {
          // ctrl + page up
          case 33:
            if (e.ctrlKey) {
              e.preventDefault();
              // focus the previous header
              this._switchPanel(this._accordion.currentIndex - 1);
            }
            break;
          // ctrl + page down
          case 34:
            if (e.ctrlKey) {
              e.preventDefault();
              // focus the next header
              this._switchPanel(this._accordion.currentIndex + 1);
            }
            break;

          // focus back to header
          // ctrl + up
          case 38:
            if (e.ctrlKey) {
              e.preventDefault();
              // focus linked header
              this._switchPanel(this._accordion.currentIndex);
            }
            break;
        }
      }

      /**
       * Ensure that the current header index is the one matching the panel
       * @param {DOMEvent} e - A `FocusEvent` or `KeyboardEvent` object
       */

    }, {
      key: '_handlePanelFocus',
      value: function _handlePanelFocus(e) {

        if (e.target.doubleFocus) {
          e.preventDefault();
          delete e.target.doubleFocus;

          return;
        }

        var panel = e.currentTarget;

        this._accordion.currentIndex = this._accordion.panels.indexOf(panel);

        // prevent double focus event when the inputs are focused
        if (['radio', 'checkbox'].indexOf(e.target.type) >= 0) {
          e.target.doubleFocus = true;
        }
      }

      /**
       * Handle keystroke on [role=tab]
       * @param {DOMEvent} e - A `KeyboardEvent` object
       */

    }, {
      key: '_handleHeaders',
      value: function _handleHeaders(e) {

        if (this._accordion.currentIndex === undefined) {
          this._handleFocus(e);
        }

        switch (e.keyCode) {
          // space
          case 32:
          // return
          case 13:
            // toggle the display of the linked panel
            this._handleDisplay(e);
            break;

          // end
          case 35:
            e.preventDefault();
            // focus the last header
            this._switchPanel(this._accordion.headers.length - 1);
            break;

          // home
          case 36:
            e.preventDefault();
            // focus the first active header
            this._switchPanel(this._firstActiveHeader());
            break;

          // left
          case 37:
          // up
          case 38:
            e.preventDefault();
            // focus the previous header
            this._switchPanel(this._accordion.currentIndex - 1);
            break;

          // right
          case 39:
          // down
          case 40:
            e.preventDefault();
            // focus the next header
            this._switchPanel(this._accordion.currentIndex + 1);
            break;
        }
      }

      /**
       * Dummy function
       */

    }, {
      key: '_noop',
      value: function _noop() {}

      /**
       * Move the focus to the header based on the index
       * @param {number} index - Index of the element to focus
       */

    }, {
      key: '_switchPanel',
      value: function _switchPanel(index) {

        // handle disabled header
        if (this._accordion.headers[index] && this._accordion.headers[index].disabled) {

          // cycling forward? Then go one item further
          var newIndex = index > this._accordion.currentIndex ? index + 1 : index - 1;

          this._switchPanel(newIndex);

          return;
        }

        var firstActiveHeader = this._firstActiveHeader();

        if (index < firstActiveHeader) {
          this._accordion.currentIndex = this._accordion.headersLength - 1;
        } else if (index >= this._accordion.headersLength) {
          this._accordion.currentIndex = firstActiveHeader;
        } else {
          this._accordion.currentIndex = index;
        }

        this._accordion.headers[this._accordion.currentIndex].focus();
      }

      /**
       * Toggle the `aria-expanded` attribute on the header based on the passed index
       * @param {integer} index - index of the panel
       * @param {boolean} show - whether or not display the panel
       */

    }, {
      key: '_toggleDisplay',
      value: function _toggleDisplay(index, show) {
        var header = this._accordion.headers[index];
        var panel = this._accordion.panels[index];
        var headerDisplayed = header.getAttribute('aria-expanded') === 'true';

        if (show === undefined) {
          show = header.getAttribute('aria-expanded') === 'false';
        }

        if (show && headerDisplayed || !show && !headerDisplayed) {
          return;
        }

        // close the previous header if the accordion doesn't allow multiple panels open
        if (show && !this.multiselectable && this._accordion.openedIndexes[0] !== undefined) {
          this._toggleDisplay(this._accordion.openedIndexes[0], false);
        }

        header.setAttribute('aria-expanded', show);
        panel.setAttribute('aria-hidden', !show);

        if (show) {
          this._accordion.openedIndexes.push(index);

          this._trigger('show', [header, panel]);
        } else {
          // remove the panel from the list of opened ones
          this._accordion.openedIndexes.splice(this._accordion.openedIndexes.indexOf(index), 1);

          this._trigger('hide', [header, panel]);
        }
      }
    }, {
      key: '_trigger',
      value: function _trigger(eventName, params) {
        var _this = this;

        if (!this._callbacks[eventName]) {
          return;
        }

        this._callbacks[eventName].forEach(function (callback) {
          callback.apply(_this, params);
        });
      }
    }, {
      key: 'closeAll',
      value: function closeAll() {
        var _this2 = this;

        this._accordion.panels.forEach(function (panel, index) {
          _this2._toggleDisplay(index, false);
        });
      }
    }, {
      key: 'close',
      value: function close(panel) {
        var index = this._accordion.panels.indexOf(panel);

        this._toggleDisplay(index, false);
      }

      /**
       * Parse the accordion children to setup the headers and panels elements
       */

    }, {
      key: 'mount',
      value: function mount() {
        var _this3 = this;

        // create reference arrays
        this._accordion.headers = [];
        this._accordion.panels = [];
        this._accordion.openedIndexes = [];

        // loop on each headers elements to find panel elements and update their attributes
        Array.prototype.slice.call(this.el.children).forEach(function (header, index) {
          var isHeader = headersNodeNames.indexOf(header.nodeName) > -1;

          // skip non header child
          if (!isHeader && header.getAttribute('role') !== 'heading' && !header.hasAttribute('aria-level')) {
            return;
          }

          // set the header to be the button actioning the panel
          header = header.querySelector('button[aria-controls], button[data-controls], [role="button"][aria-controls], [role="button"][data-controls]');

          if (!header) {
            return;
          }

          var id = header.getAttribute('aria-controls') || header.getAttribute('data-controls');

          var panel = document.getElementById(id);
          var openedTab = false;

          if (!panel) {
            throw new Error('Could not find associated panel for header ' + header.id + '. Use [aria-controls="panelId"] or [data-controls="panelId"] on the [role="header"] element to link them together');
          }

          // store the header and the panel on their respective arrays on the headerlist
          _this3._accordion.headers.push(header);
          _this3._accordion.panels.push(panel);

          header.disabled = header.hasAttribute('disabled') || header.getAttribute('aria-disabled') === 'true';

          if (header.getAttribute('data-expand') === 'true' && !header.disabled) {
            if (_this3.multiselectable || !_this3.multiselectable && !_this3._accordion.openedIndexes.length) {
              _this3._toggleDisplay(_this3._accordion.headers.length - 1, true);

              openedTab = true;
            }
          }

          // remove setup data attributes
          header.removeAttribute('data-expand');

          // set the attributes according the the openedTab status
          header.setAttribute('tabindex', 0);
          header.setAttribute('aria-expanded', openedTab);
          panel.setAttribute('aria-hidden', !openedTab);

          // subscribe internal events for header and panel
          header.addEventListener('click', _this3._handleDisplay);
          header.addEventListener('focus', _this3._handleFocus);
          header.addEventListener('keydown', _this3._handleHeaders);
          panel.addEventListener('focus', _this3._handlePanelFocus, true);
          panel.addEventListener('keydown', _this3._handlePanel);
        });

        // store constants
        this._accordion.headersLength = this._accordion.headers.length;
        this._accordion.panelsLength = this._accordion.panels.length;
      }
    }, {
      key: 'off',
      value: function off(event, callback) {
        if (!this._callbacks[event]) {
          return;
        }

        var callbackIndex = this._callbacks[event].indexOf(callback);

        if (callbackIndex < 0) {
          return;
        }

        this._callbacks[event].splice(callbackIndex, 1);
      }
    }, {
      key: 'on',
      value: function on(event, callback) {
        if (callbackEvents.indexOf(event) < 0) {
          return;
        }

        if (!this._callbacks[event]) {
          this._callbacks[event] = [];
        }

        this._callbacks[event].push(callback);
      }
    }, {
      key: 'openAll',
      value: function openAll() {
        var _this4 = this;

        if (!this.multiselectable) {
          return;
        }

        this._accordion.panels.forEach(function (panel, index) {
          _this4._toggleDisplay(index, true);
        });
      }
    }, {
      key: 'open',
      value: function open(panel) {
        var index = this._accordion.panels.indexOf(panel);

        this._toggleDisplay(index, true);
      }

      /**
       * Returns an array of opened panels
       */

    }, {
      key: 'unmount',


      /**
       * unbind accordion
       */
      value: function unmount() {
        var _this5 = this;

        this._accordion.headers.forEach(function (header, index) {
          var panel = _this5._accordion.panels[index];

          // unsubscribe internal events for header and panel
          header.removeEventListener('click', _this5._handleDisplay);
          header.removeEventListener('focus', _this5._handleFocus);
          header.removeEventListener('keydown', _this5._handleHeaders);

          header.removeAttribute('tabindex');
          header.removeAttribute('aria-expanded');

          panel.removeEventListener('focus', _this5._handlePanelFocus, true);
          panel.removeEventListener('keydown', _this5._handlePanel);
          panel.setAttribute('aria-hidden', 'false');
        });
      }
    }, {
      key: 'current',
      get: function get() {
        var _this6 = this;

        return this._accordion.openedIndexes.map(function (index) {
          return {
            header: _this6._accordion.headers[index],
            panel: _this6._accordion.panels[index]
          };
        });
      }
    }]);

    return Accordion;
  }();

  return Accordion;

})));
