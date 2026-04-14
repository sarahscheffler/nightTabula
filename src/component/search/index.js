import { data } from '../data';
import { state } from '../state';
import { bookmark } from '../bookmark';
import { groupAndBookmark } from '../groupAndBookmark';
import { searchEnginePreset } from '../searchEnginePreset';


import { Button } from '../button';
import { Control_text } from '../control/text';

import { node } from '../../utility/node';
import { trimString } from '../../utility/trimString';
import { isValidString } from '../../utility/isValidString';

import './index.css';

export const Search = function () {

  this.element = {
    search: node('div|class:search'),
    form: node('form|class:search-form,action,method:get'),
    submit: node('input|type:submit,value:Search,class:is-hidden'),
    input: new Control_text({
      object: state.get.current(),
      path: 'header.search.string',
      id: 'header-search-string',
      value: '',
      placeholder: 'Search Bookmarks or',
      labelText: 'Search',
      classList: ['search-input'],
      srOnly: true,
      action: () => {
        this.state();
        this.performSearch();
      }
    }),
    clear: new Button({
      text: 'Clear search',
      srOnly: true,
      iconName: 'cross',
      style: ['link', 'line'],
      title: 'Clear search',
      classList: ['search-clear'],
      func: () => {
        this.element.input.text.value = '';
        this.state();
        this.performSearch();
      }
    })
  };

  this.state = () => {

    if (isValidString(trimString(this.element.input.text.value))) {

      state.get.current().search = true;

    } else {

      state.get.current().search = false;

    }

    data.save();

  };

  this.placeholder = () => {

    this.element.input.text.placeholder = 'Type (Esc) Ctrl+Shift+F to search';

  };

  this.engine = {};

  this.engine.set = () => {

    switch (state.get.current().header.search.engine.selected) {

      case 'custom':

        if (isValidString(state.get.current().header.search.engine.custom.queryName) && isValidString(state.get.current().header.search.engine.custom.url)) {

          this.element.input.text.name = state.get.current().header.search.engine.custom.queryName;

          this.element.form.setAttribute('action', state.get.current().header.search.engine.custom.url);

        } else {

          this.element.input.text.name = '';

          this.element.form.setAttribute('action', '');

        }

        break;

      default:

        this.element.input.text.name = 'q';

        this.element.form.setAttribute('action', searchEnginePreset[state.get.current().header.search.engine.selected].url);

        break;

    }

    if (state.get.current().header.search.newTab) {
      this.element.form.setAttribute('target', '_blank');
    }

  };

  this.engine.bind = () => {
    this.element.input.addEventListener();
  };

  let selectedIndex = -1;

  this.getVisibleLinks = () => {
    return Array.from(document.querySelectorAll('.bookmark-link'));
  };

  this.clearSelection = () => {
    selectedIndex = -1;
    this.getVisibleLinks().forEach((link) => {
      link.closest('.bookmark').classList.remove('is-search-selected');
    });
  };

  this.setSelection = (index) => {
    const links = this.getVisibleLinks();
    links.forEach((link) => { link.closest('.bookmark').classList.remove('is-search-selected'); });
    selectedIndex = index;
    if (selectedIndex >= 0 && selectedIndex < links.length) {
      links[selectedIndex].closest('.bookmark').classList.add('is-search-selected');
    }
  };

  this.performSearch = () => {

    const html = document.querySelector('html');

    if (state.get.current().search) {

      html.classList.add('is-search');

      const searchString = trimString(this.element.input.text.value).toLowerCase();

      bookmark.all.forEach((item) => {

        item.items.forEach((item) => {

          item.searchMatch = false;

          let matchUrl = isValidString(item.url) && item.url.toLowerCase().includes(searchString);

          let matchName = isValidString(item.display.name.text) && trimString(item.display.name.text).toLowerCase().includes(searchString);

          if (matchUrl || matchName) {
            item.searchMatch = true;
          }

        });

      });

    } else {

      html.classList.remove('is-search');

      this.clearSearch();

    }

    groupAndBookmark.render();

    if (state.get.current().search) {
      this.setSelection(0);
    } else {
      this.clearSelection();
    }

  };

  this.clearSearch = () => {

    bookmark.all.forEach((item) => {

      item.items.forEach((item) => {

        delete item.searchMatch;

      });

    });

    data.save();

  };

  this.assemble = () => {

    this.element.input.text.type = 'Search';

    this.element.form.appendChild(this.element.input.text);

    this.element.form.appendChild(this.element.submit);

    this.element.form.appendChild(this.element.clear.button);

    this.element.search.appendChild(this.element.form);

    this.element.input.text.addEventListener('keydown', (event) => {
      if (!state.get.current().search) { return; }
      const links = this.getVisibleLinks();
      if (links.length === 0) { return; }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.setSelection(Math.min(selectedIndex + 1, links.length - 1));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.setSelection(Math.max(selectedIndex - 1, -1));
      } else if (event.key === 'Enter' && selectedIndex >= 0) {
        event.preventDefault();
        links[selectedIndex].click();
      }
    });

  };

  this.search = () => {

    return this.element.search;

  };

  this.resultCount = () => {

    const count = { total: 0, group: [] };

    bookmark.all.forEach((item, i) => {

      count.group.push({
        bookmarkCount: item.items.length,
        searchMatch: 0
      });

      const groupIndex = i;

      item.items.forEach((item) => {

        if (item.searchMatch) { count.group[groupIndex].searchMatch++; }

      });

      count.total = count.total + count.group[groupIndex].searchMatch;

    });

    return count;

  };

  this.update = {};

  this.update.style = () => {

    const html = document.querySelector('html');

    if (state.get.current().theme.header.search.opacity < 40) {

      html.classList.add('is-header-search-opacity-low');

    } else {

      html.classList.remove('is-header-search-opacity-low');

    }

  };

  this.assemble();

  this.placeholder();

  this.engine.set();

  this.clearSearch();

  this.update.style();

};
