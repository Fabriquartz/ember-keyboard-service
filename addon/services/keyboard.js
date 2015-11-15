import Ember from 'ember';
import $ from 'jquery';

import parseKeyShorthand from '../utils/parse-key-shorthand';
import KEYCODE_TO_KEY_MAP from '../fixtures/keycode-to-key-map';

const { assert, computed, isArray, get, set } = Ember;
const { debounce, once, throttle } = Ember.run;
const rMacOs = /Mac OS X/;

function elementIsInputLike(element) {
  return ['INPUT', 'TEXTAREA'].indexOf(element.tagName) !== -1;
}

function optionsAreEqual(optionsA, optionsB) {
  const keysA = Object.keys(optionsA);
  const keysB = Object.keys(optionsB);

  const equalOptions = Object.keys(optionsA).reduce((allEqual, key) => {
    return optionsA[key] === optionsB[key];
  }, true);

  return keysA.length === keysB.length && equalOptions;
}

function isMacOs() {
  return rMacOs.test(window.navigator.userAgent);
}

function withMultipleKeys(fn) {
  return function(keys, context, listener, options = {}) {
    if (!isArray(keys)) {
      keys = [keys];
    }

    keys.forEach((key) => {
      let singleOptions = $.extend({}, options);
      key = parseKeyShorthand(key, singleOptions);
      fn.call(this, key, context, listener, singleOptions);
    });
  };
}

export default Ember.Service.extend({
  _listeners: computed(function () {
    return {};
  }),

  _listenersForKey(key) {
    if (key === '.') {
      key = 'dot';
    }

    let listeners = get(this, `_listeners.${key}`);

    if (!isArray(listeners)) {
      listeners = [];
      set(this, `_listeners.${key}`, listeners);
    }

    return listeners;
  },

  listenFor: withMultipleKeys(function(key, context, listener, options) {
    const listeners = this._listenersForKey(key);
    listeners.push([context, listener, options]);
  }),

  stopListeningFor: withMultipleKeys(function(key, context, listener, options) {
    const listeners = this._listenersForKey(key);

    for (let index = listeners.length - 1; index >= 0; --index) {
      const [lContext, lListener, lOptions] = listeners[index];

      const sameContext  = lContext  === context;
      const sameListener = lListener === listener;
      const sameOptions  = optionsAreEqual(lOptions, options);

      if (sameContext && sameListener && sameOptions) {
        listeners.splice(index, 1);
      }
    }
  }),

  listenForOnce(key, context, listener, options = {}) {
    options.once = true;
    this.listenFor(key, context, listener, options);
  },

  _handleKeyPress(e) {
    let key = e.key || KEYCODE_TO_KEY_MAP[e.keyCode];
    const listeners = this._listenersForKey(key);

    if (key === '.') {
      key = 'dot';
    }

    listeners.forEach(([context, callback, options]) => {
      // Ignore input on input-like elements by default
      if (elementIsInputLike(e.target) && !options.actOnInputElement) {
        return;
      }

      // Check modifier key requirements
      if (isMacOs() && options.useCmdOnMac) {
        if (e.metaKey === !options.requireCtrl) { return; }
      } else {
        if (e.ctrlKey === !options.requireCtrl ) { return; }
        if (e.metaKey === !options.requireMeta ) { return; }
      }

      if (e.altKey === !options.requireAlt)   { return; }
      if (e.shiftKey === !options.requireShift) { return; }

      let fn = callback;

      // if callback is string, lookup function with that name on context
      // also assert that the resolved callback is a function.
      if (typeof callback === 'string') {
        fn = get(context, callback);
        assert(`The callback function '${callback}' must exist and be a function`,
               typeof fn === 'function');
      } else {
        assert(`Expected '${fn}' to be a function`, typeof fn === 'function');
      }

      // Push the event object onto arguments
      const args = options.arguments || [];
      args.unshift(e);

      // Use run loop if debounce, throttle or scheduleOnce is specified
      // else call callback immediately
      if (options.debounce > 0) {
        // fancy for: `debounce(context, fn, ...options.arguments, options.debounce)`
        debounce.apply(undefined, [context, fn].concat(args, [options.debounce]));
      } else if (options.throttle > 0) {
        throttle.apply(undefined, [context, fn].concat(args, [options.throttle]));
      } else if (options.scheduleOnce) {
        once.apply(undefined, [context, fn].concat(args));
      } else {
        fn.apply(context, args);
      }

      // If flagged listen once, then remove the listeners
      if (options.once) {
        this.stopListeningFor(key, context, callback, options);
      }
    });
  },

  init() {
    const handler = (...args) => this._handleKeyPress(...args);
    set(this, '_keyPressHandler', handler);
    $(() => $(document.body).on('keydown', handler));

    this._super(...arguments);
  },

  willDestroy() {
    const handler = get(this, '_keyPressHandler');
    $(() => $(document.body).off('keydown', handler));

    this._super(...arguments);
  }
});
