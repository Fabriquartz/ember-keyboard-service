# Ember Keyboard Service
[![npm version](https://badge.fury.io/js/ember-keyboard-service.svg)](http://badge.fury.io/js/ember-keyboard-service) [![Build Status](https://travis-ci.org/Fabriquartz/ember-keyboard-service.svg?branch=master)](https://travis-ci.org/Fabriquartz/ember-keyboard-service.svg?branch=master) [![Ember Observer Score](http://emberobserver.com/badges/ember-keyboard-service.svg)](http://emberobserver.com/addons/ember-keyboard-service)

## Installation

```shell
ember install ember-keyboard-service
```

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

You can optionally specify modifier keys:

```js
this.get('keyboard').listenFor('ctrl+alt+Delete', this, eventHandler);
```

And optionally specify combos (expirimental, use at own risk):

```js
const kombo = 'ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a';
this.get('keyboard').listenFor(kombo, this, eventHandler);
```

## Mixin Usage

Mixin the mixin and declare some keyboardHandlers

```js
Ember.Object.extend(KeyboardMixin, {
  keyboardHandlers: [
    { key: 'ctrl+x', handler: 'cut' }
    { key: 'ctrl+c', handler: 'copy' }
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

## Todo

- [ ] Improve key combo handling.
