export const KeyboardShortcut = function ({
  keycode = false,
  ctrl = false,
  alt = false,
  shift = false,
  action = false
} = {}) {

  this.action = () => {
    if (keycode) {
      if ((event.keyCode == keycode) && (ctrl == event.ctrlKey) && (alt == event.altKey) && (shift == event.shiftKey)) {

        event.preventDefault();

        if (action) {
          action();
        }

      }
    }
  };

  this.add = () => { window.addEventListener('keydown', this.action); };

  this.remove = () => { window.removeEventListener('keydown', this.action); };

};
