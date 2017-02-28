# Ember Keyboard Service
[![npm version](https://badge.fury.io/js/ember-keyboard-service.svg)](http://badge.fury.io/js/ember-keyboard-service) [![Build Status](https://travis-ci.org/Fabriquartz/ember-keyboard-service.svg?branch=master)](https://travis-ci.org/Fabriquartz/ember-keyboard-service) [![Ember Observer Score](http://emberobserver.com/badges/ember-keyboard-service.svg)](http://emberobserver.com/addons/ember-keyboard-service) [![Code Climate](https://codeclimate.com/github/Fabriquartz/ember-keyboard-service/badges/gpa.svg)](https://codeclimate.com/github/Fabriquartz/ember-keyboard-service)

The keyboard service helps you let your app respond to keyboard input.

You can either do this declaratively with a DSL mixin, or use the lower level
service, that gives you more control.

# NO LONGER BEING MAINTAINED
I'd recommend using either the [`ember-keyboard`](https://github.com/null-null-null/ember-keyboard) mixin or the [`ember-key-manager`](https://github.com/IcarusWorks/ember-key-manager/) service.

## Installation

```shell
ember install ember-keyboard-service
```

## Specifying keyboard combos

You can specify normal key characters by using the literal value. Examples:
`'a'`, `'$'`, `' '`.

You can add modifier keys using `'ctrl'`, `'alt'`, `'shift'` or `'meta'`.
`'cmd'` is an alias for `'meta'`, `'option'` is an alias for `'alt'`.

An example of a combo with modifiers: `'ctrl+v'`.

There is also a special modifier: `'nctrl'`, on OS X this modifier is an alias
for `'cmd'`, on any other system it is just `'ctrl'`.

## DSL Mixin Usage

Use it do declare shortcuts in a simple manner.

```js
import KeyboardMixin from 'ember-keyboard-service/mixins/keyboard';

Ember.Object.extend(KeyboardMixin, {
  keyboardHandlers: [
    { key: 'ctrl+x', handler: 'cut'   }
    { key: 'ctrl+c', handler: 'copy'  }
    { key: 'ctrl+v', handler: 'paste' }
  ],

  cut() {
    console.log("every day i'm cuttin");
  },

  copy() {
    console.log("every day i'm copyin");
  },

  paste() {
    console.log("every day i'm pastin");
  }
});
```

You can also specify static arguments for keyboard handlers:

```js
Ember.Object.extend(KeyboardMixin, {
  keyboardHandlers: [
    { key: 'ctrl+g', handler: 'goto', arguments: [42] }
  ],

  goto(e, line) {
    console.log(`going to line ${line}`);
  }
});
```

You can choose to bind multiple key shortcuts to the same handler:

```js
keyboardHandlers: [
  { key: ['a', 'b'], handler: 'doStuff' }
]
```

You can use some of the Ember run loop features:

```js
keyboardHandlers: [
  // debounces key handlers by 30ms
  { key: 'a', handler: 'debouncedHandler', debounce: 30 },

  // throttles key handlers by 30ms
  { key: 'b', handler: 'throttledHandler', throttle: 30 },

  // only calls the handler once every run loop
  { key: 'c', handler: 'scheduleOnceHandler', scheduleOnce: true }
]
```

For more usage examples you can check out the [tests](https://github.com/Fabriquartz/ember-keyboard-service/blob/master/tests/unit/mixins/keyboard-test.js)

## Service Usage

Use `Ember.inject.service` to inject the service onto your Ember object.

```js
Ember.Object.extend({
  keyboard: service()
});
```

Then use `listenFor` to start listening for keyboard events:
(The key names are equal to those used for `KeyboardEvent.key`.)

```js
this.get('keyboard').listenFor('x', this, eventHandler);
```

You can alternatively pass a function name instead of an eventHandler:

```js
this.get('keyboard').listenFor('x', this, 'xEventHandler');
```

You can optionally specify modifier keys:

```js
// possible modifiers are: ctrl, cmd, alt, shift
this.get('keyboard').listenFor('ctrl+alt+Delete', this, eventHandler);
```

You can listen for a key stroke once:

```js
this.get('keyboard').listenForOnce('x', this, eventHandler);
```

You can stop listening for key strokes, you must supply the exact same
arguments as you did to `listenFor`.

```js
this.get('keyboard').stopListeningFor('x', this, eventHandler);
```

The service will not handle the event if the even target was an input or similar element.
To override this you can do:

```js
this.get('keyboard').listenFor('x', this, eventHandler, {
  actOnInputElement: true
});
```

For more usage examples you can check out the [tests](https://github.com/Fabriquartz/ember-keyboard-service/blob/master/tests/unit/services/keyboard-test.js)
