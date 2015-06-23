import Ember from 'ember';
import KeyboardService from 'ember-keyboard-service/services/keyboard';
import KeyboardMixin from 'ember-keyboard-service/mixins/keyboard';
import { module, test } from 'qunit';

const computed = Ember.computed;

module('Unit | Mixin | keyboard');

// Replace this with your real tests.
test('I can declare keyboard handlers', function(assert) {
  assert.expect(1);

  var KeyboardObject = Ember.Object.extend(KeyboardMixin, {
    keyboard: KeyboardService.create(),

    handler() { assert.ok(true); },
    keyboardHandlers: [
      { key: 'x', handler: 'handler' }
    ]
  });

  var subject = KeyboardObject.create();

  $(document.body).trigger($.Event('keydown', { key: 'x' }));
});


test('It fires on multiple instances', function(assert) {
  assert.expect(2);

  var KeyboardObject = Ember.Object.extend(KeyboardMixin, {
    keyboard: KeyboardService.create(),

    handler() { assert.ok(true); },
    keyboardHandlers: [
      { key: 'x', handler: 'handler' }
    ]
  });

  var one = KeyboardObject.create();
  var two = KeyboardObject.create();

  $(document.body).trigger($.Event('keydown', { key: 'x' }));
});

test('Handler must exist', function(assert) {
  var KeyboardObject = Ember.Object.extend(KeyboardMixin, {
    keyboard: KeyboardService.create(),
    keyboardHandlers: [
      { key: 'x', handler: 'handler' }
    ]
  });

  assert.throws(() =>  {
    KeyboardObject.create();
  }, /Assertion Failed/);
});

test('I can declare keyboard handlers with options', function(assert) {
  assert.expect(1);

  var KeyboardObject = Ember.Object.extend(KeyboardMixin, {
    keyboard: KeyboardService.create(),

    handler() { assert.ok(true); },
    keyboardHandlers: [
      { key: 'x', handler: 'handler', options: { once: true } }
    ]
  });

  var subject = KeyboardObject.create();

  $(document.body).trigger($.Event('keydown', { key: 'x' }));
  $(document.body).trigger($.Event('keydown', { key: 'x' }));
});

test('keyboardHandlers is a concatenated property', function(assert) {
  assert.expect(2);

  var KeyboardObject = Ember.Object.extend(KeyboardMixin, {
    keyboard: KeyboardService.create(),

    handler() { assert.ok(true); },
    keyboardHandlers: [
      { key: 'x', handler: 'handler' }
    ]
  });

  var ExtendedKeyboardObject = KeyboardObject.extend({
    keyboardHandlers: [
      { key: 'x', handler: 'handler' }
    ]
  });

  var subject = ExtendedKeyboardObject.create();

  $(document.body).trigger($.Event('keydown', { key: 'x' }));
});
