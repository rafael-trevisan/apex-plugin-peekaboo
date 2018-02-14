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

import ViewModel from './ViewModel';

const ko = require('knockout');

const viewModel = new ViewModel();
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
      $(affectedElement).parents(`#${id}_CONTAINER`).attr('data-bind', `visible: peekaboo('${id}')`);
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

export {
  render,
  players,
};
