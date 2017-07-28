import KeyboardService  from 'ember-keyboard-service/services/keyboard';
import KeyboardMixin    from 'ember-keyboard-service/mixins/keyboard';
import { moduleForComponent, test } from 'ember-qunit';
import Object           from 'ember-object';
import $                from 'jquery';
import run              from 'ember-runloop';

moduleForComponent('Unit | Mixin | keyboard', { integration: true });

// Replace this with your real tests.
test('I can declare keyboard handlers', function(assert) {
  assert.expect(1);

  let KeyboardObject = Object.extend(KeyboardMixin, {
    keyboard: KeyboardService.create(),

    handler() { assert.ok(true); },
    keyboardHandlers: [
      { key: 'x', handler: 'handler' }
    ]
  });

  KeyboardObject.create();

  $(document.body).trigger($.Event('keydown', { key: 'x' }));
});

test('I can declare no keyboard handlers', function(assert) {
  assert.expect(0);

  let KeyboardObject = Object.extend(KeyboardMixin, {
    keyboard: KeyboardService.create()
  });

  KeyboardObject.create();
});

test('I can declare keyboard handlers with static arguments', function(assert) {
  assert.expect(1);

  let KeyboardObject = Object.extend(KeyboardMixin, {
    keyboard:         KeyboardService.create(),
    handler(e, arg) { assert.equal(arg, 'foo'); },
    keyboardHandlers: [
      { key: 'x', handler: 'handler', arguments: ['foo'] }
    ]
  });

  KeyboardObject.create();

  $(document.body).trigger($.Event('keydown', { key: 'x' }));
});

test('It fires on multiple instances', function(assert) {
  assert.expect(2);

  let KeyboardObject = Object.extend(KeyboardMixin, {
    keyboard: KeyboardService.create(),

    handler() { assert.ok(true); },
    keyboardHandlers: [
      { key: 'x', handler: 'handler' }
    ]
  });

  KeyboardObject.create();
  KeyboardObject.create();

  $(document.body).trigger($.Event('keydown', { key: 'x' }));
});

test('Handler must exist', function(assert) {
  let KeyboardObject = Object.extend(KeyboardMixin, {
    keyboard:         KeyboardService.create(),
    keyboardHandlers: [
      { key: 'x', handler: 'handler' }
    ]
  });

  let subject = KeyboardObject.create();

  assert.throws(() =>  {
    $(document.body).trigger($.Event('keydown', { key: 'x' }));
  }, /Assertion Failed/);

  // Needs destroy or it will interfere with other tests...
  run(() => subject.destroy());
});

test('I can declare keyboard handlers with options', function(assert) {
  assert.expect(1);

  let KeyboardObject = Object.extend(KeyboardMixin, {
    keyboard: KeyboardService.create(),

    handler() { assert.ok(true); },
    keyboardHandlers: [
      { key: 'x', handler: 'handler', options: { once: true } }
    ]
  });

  KeyboardObject.create();

  $(document.body).trigger($.Event('keydown', { key: 'x' }));
  $(document.body).trigger($.Event('keydown', { key: 'x' }));
});

test('keyboardHandlers is a concatenated property', function(assert) {
  assert.expect(2);

  let KeyboardObject = Object.extend(KeyboardMixin, {
    keyboard: KeyboardService.create(),

    handler() { assert.ok(true); },
    keyboardHandlers: [
      { key: 'x', handler: 'handler' }
    ]
  });

  let ExtendedKeyboardObject = KeyboardObject.extend({
    keyboardHandlers: [
      { key: 'x', handler: 'handler' }
    ]
  });

  ExtendedKeyboardObject.create();

  $(document.body).trigger($.Event('keydown', { key: 'x' }));
});
