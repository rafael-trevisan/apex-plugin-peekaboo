const ko = require('knockout');

export default class ViewModel {
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
