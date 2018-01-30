var peekaboo =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "players", function() { return players; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ViewModel__ = __webpack_require__(2);
/**
 * @author Rafael Trevisan <rafael@trevis.ca>
 * @license
 * Copyright (c) 2018 Rafael Trevisan
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following players:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/* global apex $v */



const ko = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"knockout\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

const viewModel = new __WEBPACK_IMPORTED_MODULE_0__ViewModel__["a" /* default */]();
const { players } = viewModel;

const init = () => {
  apex.debug.info('Hello from APEX Peekaboo :: https://github.com/rafael-trevisan/apex-plugin-peekaboo');
  ko.applyBindings(viewModel);
};

const render = (pluginType, id, visibility) => {
  const { item } = visibility;
  const affectedElement = $(`#${id}`);
  const triggeringElement = item && $(`#${item}`);
  const triggeringElementType = item && (() => {
    switch (true) {
      case $(triggeringElement).hasClass('radio_group'):
        return 'radio';
      case $(triggeringElement).hasClass('checkbox_group'):
        return 'checkbox';
      case $(triggeringElement)[0].hasAttribute('data-checked-value'):
        return 'simple-checkbox';
      default:
        console.warn(`${item} is neither a "radio", a "checkbox" or a "simple-checkbox".`);
        return null;
    }
  })();
  const triggeringElementSelector = (() => {
    if (item) {
      return `input[type="radio"][name="${item}"],input[type="checkbox"][name="${item}"]`;
    }
    return 'input[type="radio"],input[type="checkbox"]';
  })();

  switch (true) {
    case pluginType === 'REGION':
      $(affectedElement).addClass(`peekaboo-${pluginType.toLowerCase()}`);
      $(affectedElement).attr('data-bind', `visible: peekaboo('${id}')`);
      break;
    case pluginType === 'TEXTFIELD' ||
         pluginType === 'RADIOGROUP' ||
         pluginType === 'CHECKBOX' ||
         pluginType === 'SIMPLE_CHECKBOX':
      $(affectedElement).addClass(`peekaboo-${pluginType.toLowerCase()}`);
      $(affectedElement).parents('.t-Form-fieldContainer').attr('data-bind', `visible: peekaboo('${id}')`);
      break;
    default:
      console.warn(`Affected Element "${id}" type (${pluginType}) is not supported by Peekaboo at this time.`);
  }

  $(triggeringElementSelector).each((i, e) => {
    const name = $(e).attr('name');
    const type = (() => {
      switch ($(e).attr('type')) {
        case 'radio':
          return 'radio';
        case 'checkbox':
          return $(e)[0].hasAttribute('data-checked-value') ? 'simple-checkbox' : 'checkbox';
        default:
          console.warn(`${item} is neither a "radio", a "checkbox" or a "simple-checkbox".`);
      }
      return null;
    })();
    const propagateChange = () => {
      if (viewModel[name]) {
        let val;
        /**
         * if viewModel[item] === observableArray (wich is true for checkboxes),
         * then it needs to be checked against an array object . Othersise it
         * needs to be checked against a plain value
         */
        if (typeof viewModel[name]() === 'object') {
          val = $v(name) ? $v(name).split(':') : [];
          if (!viewModel[name]().every(r => val.includes(r))) {
            viewModel[name](val);
          }
        } else {
          val = type === 'simple-checkbox' ? $(`#${name}`).prop('checked') : $v(name);
          if (viewModel[name]() !== val) {
            viewModel[name](val);
          }
        }
      }
    };

    $(e).attr('data-bind', `checked: ${name}`);
    $(`#${name}`).off('.peekaboo').on('change.peekaboo', propagateChange);

    switch (true) {
      case type === 'radio' || type === 'simple-checkbox':
        viewModel[name] = ko.observable();
        break;
      case type === 'checkbox':
        viewModel[name] = ko.observableArray();
        break;
      default:
        console.warn(`Triggering Element "${id}" is not supported by Peekaboo at this time.`);
    }
  });

  viewModel.players.push({
    id,
    triggeringElement: {
      id: item,
      type: triggeringElementType,
    },
    visibility,
    visible: ko.observable(),
  });

  // just in case => $._data($(window)[0], 'events');
  $(window).off('.peekaboo').on('theme42ready.peekaboo', init);
};




/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const ko = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"knockout\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

class ViewModel {
  constructor() {
    this.players = ko.observableArray();
    this.peekaboo = id => ko.pureComputed(() => {
      const player = this.players().find(e => e.id === id);
      const {
        condition, item, value, list, expr, actions,
      } = player.visibility;
      const { type: triggeringElementType } = player.triggeringElement;
      const triggeringElement = $(`#${item}`);
      const triggeringElementSelector = item ? `input[name=${item}]` : 'input[type=radio],input[type=checkbox]';
      const listener = ko.observableArray();
      let visible = false;

      $(triggeringElementSelector).each((i, e) => {
        listener.push(this[`${$(e).attr('name')}`]());
      });

      if (triggeringElementType === 'checkbox'
          && ['==', '!=', '>', '>=', '<', '<='].indexOf(condition) > -1) {
        console.warn('Heads Up! Checkboxes items should have their values checked for "NULL", "NOT NULL", "IN" and "NOT IN" only.');
      }

      switch (true) {
        case ['==', '!=', '>', '>=', '<', '<='].indexOf(condition) > -1:
          if (triggeringElementType === 'radio') {
            visible = this[item]() !== 'undefined' && eval(`"${this[item]()}" ${condition} "${value}"`);
          } else if (triggeringElementType === 'simple-checkbox') {
            const inputValue = this[item]() === true ?
              $(triggeringElement).attr('data-checked-value') :
              $(triggeringElement).attr('data-unchecked-value');
            visible = inputValue !== 'undefined' && eval(`"${inputValue}" ${condition} "${value}"`);
          }
          break;
        case condition === 'IS_NULL':
          visible = !this[item]();
          break;
        case condition === 'IS_NOT_NULL':
          visible = !!this[item]();
          break;
        case condition === 'IS_IN_LIST':
          if (triggeringElementType === 'radio') {
            visible = this[item]() && list.split(',').indexOf(this[item]()) > -1;
          } else if (triggeringElementType === 'checkbox') {
            visible = this[item]() && list.split(',').some(r => this[item]().includes(r));
          }
          break;
        case condition === 'IS_NOT_IN_LIST':
          if (triggeringElementType === 'radio') {
            visible = this[item]() && list.split(',').indexOf(this[item]()) < 0;
          } else if (triggeringElementType === 'checkbox') {
            visible = this[item]() && !list.split(',').some(r => this[item]().includes(r));
          }
          break;
        case condition === 'JAVASCRIPT_EXPRESSION':
          visible = eval(expr);
          break;
        default:
          console.warn('An unexepcted condition has been found. Take a look into your players.');
          console.warn(player);
      }

      if (visible && !player.visible()) {
        eval(actions.onShow.code);
      } else if (!visible && player.visible()) {
        eval(actions.onHide.code);
      }

      player.visible(visible);

      $(triggeringElementSelector).each((i, e) => {
        $(e).triggerHandler('click');
      });

      return player.visible();
    }, this);
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ViewModel;



/***/ })
/******/ ]);
//# sourceMappingURL=peekaboo.bundle.js.map