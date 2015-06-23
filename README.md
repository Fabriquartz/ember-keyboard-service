# Ember Keyboard Service

## Installation

```shell
ember install ember-keyboard-service
```

## Usage

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

## Todo

- [ ] Add a mixin that adds a DSL for declaring keyboard handling.
- [ ] Improve key combo handling.
