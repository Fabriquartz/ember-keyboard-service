import $ from 'jquery';
import { moduleFor, test } from 'ember-qunit';

moduleFor('service:keyboard', 'Unit | Service | keyboard');

test('it listens for key down presses', function(assert) {
  assert.expect(3);
  const service = this.subject();

  service.listenFor('f', this, function() { assert.ok(true); });
  service.listenFor('o', this, function() { assert.ok(true); });

  // Types 'foo'
  $(document.body).trigger($.Event('keydown', { key: 'f' }));
  $(document.body).trigger($.Event('keydown', { key: 'o' }));
  $(document.body).trigger($.Event('keydown', { key: 'o' }));
});

test('listener can be a function name', function(assert) {
  assert.expect(1);
  const service = this.subject();

  const context = {
    foo() { assert.ok(true); }
  };

  service.listenFor('x', context, 'foo');

  $(document.body).trigger($.Event('keydown', { key: 'x' }));
});

test('it can handle an array of static arguments as option', function(assert) {
  assert.expect(1);
  const service = this.subject();

  service.listenFor('x', this, function(n) { assert.equal(n, 42); }, {
    arguments: [42]
  });

  $(document.body).trigger($.Event('keydown', { key: 'x' }));
});

test('it can handle ctrl modifier', function(assert) {
  assert.expect(1);
  const service = this.subject();

  service.listenFor('x', this, function() { assert.ok(false, 'should not run with ctrl pressed'); });
  service.listenFor('x', this, function() { assert.ok(true); }, {
    requireCtrl: true
  });

  $(document.body).trigger($.Event('keydown', { key: 'x', ctrlKey: true }));
});

test('it can handle alt key modifier', function(assert) {
  assert.expect(1);
  const service = this.subject();

  service.listenFor('x', this, function() { assert.ok(false, 'should not run with alt pressed'); });
  service.listenFor('x', this, function() { assert.ok(true); }, {
    requireAlt: true
  });

  $(document.body).trigger($.Event('keydown', { key: 'x', altKey: true }));
});

test('it can handle shift key modifier', function(assert) {
  assert.expect(1);
  const service = this.subject();

  service.listenFor('x', this, function() { assert.ok(false, 'should not run with shift pressed'); });
  service.listenFor('x', this, function() { assert.ok(true); }, {
    requireShift: true
  });

  $(document.body).trigger($.Event('keydown', { key: 'x', shiftKey: true }));
});

test('it can handle meta key modifier', function(assert) {
  assert.expect(1);
  const service = this.subject();

  service.listenFor('x', this, function() { assert.ok(false, 'should not run with meta pressed'); });
  service.listenFor('x', this, function() { assert.ok(true); }, {
    requireMeta: true
  });

  $(document.body).trigger($.Event('keydown', { key: 'x', metaKey: true }));
});

test('it can handle meta or ctrl key modifier', function(assert) {
  assert.expect(2);
  const service = this.subject();

  service.listenFor('x', this, function() { assert.ok(false, 'should not run with meta or ctrl pressed'); });
  service.listenFor('x', this, function() { assert.ok(true); }, {
    requireCtrlOrMeta: true
  });

  $(document.body).trigger($.Event('keydown', { key: 'x', metaKey: true }));
  $(document.body).trigger($.Event('keydown', { key: 'x', ctrlKey: true }));
});

test('it can handle a combination of key modifiers', function(assert) {
  assert.expect(1);
  const service = this.subject();

  service.listenFor('Del', this, function() { assert.ok(false, 'should not run'); });
  service.listenFor('Del', this, function() { assert.ok(false, 'should not run'); }, {
    requireAlt: true
  });
  service.listenFor('Del', this, function() { assert.ok(true); }, {
    requireCtrl:  true,
    requireAlt:   true
  });

  $(document.body).trigger($.Event('keydown', { key: 'Del', ctrlKey: true, altKey: true }));
});

test('it can handle a combination shorthand', function(assert) {
  assert.expect(1);
  const service = this.subject();

  service.listenFor('x', this, function() { assert.ok(false, 'should not run with ctrl pressed'); });
  service.listenFor('ctrl+x', this, function() { assert.ok(true); });

  $(document.body).trigger($.Event('keydown', { key: 'x', ctrlKey: true }));
});

test('stopListeningFor removes the keyboard handler', function(assert) {
  assert.expect(3);
  const service = this.subject();

  const listener = function() { assert.ok(true); };
  service.listenFor('ctrl+x', this, listener);
  service.listenFor('ctrl+x', this, function() { assert.ok(true); });

  $(document.body).trigger($.Event('keydown', { key: 'x', ctrlKey: true }));

  service.stopListeningFor('ctrl+x', this, listener);

  $(document.body).trigger($.Event('keydown', { key: 'x', ctrlKey: true }));
});

test('listenForOnce only gets called once', function(assert) {
  assert.expect(1);
  const service = this.subject();

  service.listenForOnce('x', this, function() { assert.ok(true); });

  $(document.body).trigger($.Event('keydown', { key: 'x' }));
  $(document.body).trigger($.Event('keydown', { key: 'x' }));
});

test('it falls back to event.keyCode if event.key is not set', function(assert) {
  assert.expect(1);
  const service = this.subject();

  service.listenFor('x', this, function() { assert.ok(true); });

  $(document.body).trigger($.Event('keydown', { keyCode: 88 }));
});

test('it can handle the space key', function(assert) {
  assert.expect(1);
  const service = this.subject();

  service.listenFor(' ', this, function() { assert.ok(true); });

  $(document.body).trigger($.Event('keydown', { key: ' ' }));
});

test('it can handle keyboard sequences', function(assert) {
  const service = this.subject();
  let run = false;

  service.listenFor('ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a',
                    this, function() { run = true; });

  $(document.body).trigger($.Event('keydown', { key: 'ArrowUp' }));
  assert.ok(!run);
  $(document.body).trigger($.Event('keydown', { key: 'ArrowUp' }));
  assert.ok(!run);
  $(document.body).trigger($.Event('keydown', { key: 'ArrowDown' }));
  assert.ok(!run);
  $(document.body).trigger($.Event('keydown', { key: 'ArrowDown' }));
  assert.ok(!run);
  $(document.body).trigger($.Event('keydown', { key: 'ArrowLeft' }));
  assert.ok(!run);
  $(document.body).trigger($.Event('keydown', { key: 'ArrowRight' }));
  assert.ok(!run);
  $(document.body).trigger($.Event('keydown', { key: 'ArrowLeft' }));
  assert.ok(!run);
  $(document.body).trigger($.Event('keydown', { key: 'ArrowRight' }));
  assert.ok(!run);
  $(document.body).trigger($.Event('keydown', { key: 'b' }));
  assert.ok(!run);
  $(document.body).trigger($.Event('keydown', { key: 'a' }));
  assert.ok(run);
});
