import Ember from 'ember';
import $ from 'jquery';

import KEYCODE_TO_KEY_MAP from '../fixtures/keycode-to-key-map';

const { computed, isArray } = Ember;

function parseKeyShortHand(key, options) {
  // Parses sequences
  if (key.indexOf(',') !== -1) {
    const sequence = key.split(',');
    key = sequence.shift();
    options.sequence = sequence;
  }

  // Parses shorthand (f.e. ctrl+shift+k)
  if (key.indexOf('+') !== -1) {
    const combination = key.split('+');
    combination.forEach((k) => {
      switch (k) {
        case 'ctrl' : options.requireCtrl  = true; break;
        case 'meta' : options.requireMeta  = true; break;
        case 'alt'  : options.requireAlt   = true; break;
        case 'shift': options.requireShift = true; break;
        default: key = k;
      }
    });
  }

  return key;
}

export default Ember.Service.extend({
  _listeners: computed(function () { return {}; }),

  listenFor: function(key, context, listener, options) {
    if (options === null || options === undefined) { options = {}; }

    key = parseKeyShortHand(key, options);

    let listeners = this.get(`_listeners.${key}`);

    if (!isArray(listeners)) {
      listeners = [];
      this.set(`_listeners.${key}`, listeners);
    }

    listeners.push([context, listener, options]);
  },

  stopListeningFor: function(key, context, listener, options) {
    if (options === null || options === undefined) { options = {}; }

    key = parseKeyShortHand(key, options);

    let listeners = this.get(`_listeners.${key}`);

    if (!isArray(listeners)) { return; }

    const filteredListeners = listeners.filter((l) => {
      const sameContext  = l[0] === context;
      const sameListener = l[1] === listener;

      let sameOptions = true;
      sameOptions = sameOptions && l[2].sequence === options.sequence;

      return !(sameContext && sameListener && sameOptions);
    });

    this.set(`_listeners.${key}`, filteredListeners);
  },

  listenForOnce: function(key, context, listener, options) {
    if (options === null || options === undefined) { options = {}; }
    options.once = true;
    this.listenFor(key, context, listener, options);
  },

  _handleKeyPress: function(e) {
    const key = e.key || KEYCODE_TO_KEY_MAP[e.keyCode];
    let listeners = this.get(`_listeners.${key}`);

    if (isArray(listeners)) {
      listeners.forEach((listener) => {
        const [context, callback, options] = listener;

        // Check for modifier key requirements
        if (e.ctrlKey  && !options.requireCtrl)  { return; }
        if (e.metaKey  && !options.requireMeta)  { return; }
        if (e.altKey   && !options.requireAlt)   { return; }
        if (e.shiftKey && !options.requireShift) { return; }

        if (isArray(options.sequence) && options.sequence.length > 0) {
          // Handles sequences
          const [nextKey, ...nextSequence] = options.sequence;
          const nextOptions = Object.create(options);

          nextOptions.sequence = nextSequence;

          this.listenForOnce(nextKey, context, callback, nextOptions);
        } else {
          // Calls the actual callback function supplied to listenFor
          callback.call(context);
        }

        // If flagged listen once, then remove the listeners
        if (options.once) {
          this.stopListeningFor(e.key, context, callback, options);
        }
      });
    }
  },

  init: function() {
    const handler = (...args) => this._handleKeyPress.apply(this, args);
    this.set('_keyPressHandler', handler);
    $(() => $(document.body).on('keydown', handler));
    this._super.apply(arguments);
  },

  willDestroy: function() {
    const handler = this.get('_keyPressHandler');
    $(() => $(document.body).off('keydown', handler));
    this._super.apply(arguments);
  }
});
