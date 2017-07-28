import $ from 'jquery';
import { moduleFor, test } from 'ember-qunit';
import run from 'ember-runloop';

// Haven't found a reliable way of spoofing user agent on phantom js.
let setUserAgent, resetUserAgent, service;
if (!/PhantomJS/i.test(window.navigator.userAgent)) {
  let originalNavigator = window.navigator.__lookupGetter__('userAgent');
  setUserAgent = function setUserAgent(str) {
    window.navigator.__defineGetter__('userAgent', function() {
      return str;
    });
  };

  resetUserAgent = function resetUserAgent() {
    window.navigator.__defineGetter__('userAgent', originalNavigator);
  };
}

moduleFor('service:keyboard', 'Unit | Service | keyboard', {
  unit: true,

  beforeEach() {
    service = this.subject({
      activities: [{ id: 1 }],

      selectionService: {
        setContent() { }
      }
    });
  }
});

test('it listens for key down presses', function(assert) {
  assert.expect(3);

  service.listenFor('f', this, function() { assert.ok(true); });
  service.listenFor('o', this, function() { assert.ok(true); });

  // Types 'foo'
  $(document.body).trigger($.Event('keydown', { key: 'f' }));
  $(document.body).trigger($.Event('keydown', { key: 'o' }));
  $(document.body).trigger($.Event('keydown', { key: 'o' }));
});

test('listener can be a function name', function(assert) {
  assert.expect(1);
  let service = this.subject();

  let context = {
    foo() { assert.ok(true); }
  };

  service.listenFor('x', context, 'foo');

  $(document.body).trigger($.Event('keydown', { key: 'x' }));
});

test('the first argument to the callback is the event object', function(assert) {
  let service = this.subject();

  let event = { key: 'x' };
  service.listenFor('x', this, function(e) { assert.equal(e.key, event.key); });

  $(document.body).trigger($.Event('keydown', event));
});

test('it can handle an array of static arguments as option', function(assert) {
  assert.expect(1);
  let service = this.subject();

  service.listenFor('x', this, function(e, n) { assert.equal(n, 42); }, {
    arguments: [42]
  });

  $(document.body).trigger($.Event('keydown', { key: 'x' }));
});

test('it throws when no key is given', function(assert) {
  assert.expect(1);
  let service = this.subject();

  assert.throws(() => {
    service.listenFor();
  });
});

test('it can handle ctrl modifier', function(assert) {
  assert.expect(1);
  let service = this.subject();

  service.listenFor('x', this, function() {
    assert.ok(false, 'should not run with ctrl pressed');
  });

  service.listenFor('x', this, function() { assert.ok(true); }, {
    requireCtrl: true
  });

  $(document.body).trigger($.Event('keydown', { key: 'x', ctrlKey: true }));
});

test('it can handle alt key modifier', function(assert) {
  assert.expect(1);
  let service = this.subject();

  service.listenFor('x', this, function() {
    assert.ok(false, 'should not run with alt pressed');
  });
  service.listenFor('x', this, function() { assert.ok(true); }, {
    requireAlt: true
  });

  $(document.body).trigger($.Event('keydown', { key: 'x', altKey: true }));
});

test('it can handle shift key modifier', function(assert) {
  assert.expect(1);
  let service = this.subject();

  service.listenFor('x', this, function() {
    assert.ok(false, 'should not run with shift pressed');
  });

  service.listenFor('x', this, function() { assert.ok(true); }, {
    requireShift: true
  });

  $(document.body).trigger($.Event('keydown', { key: 'x', shiftKey: true }));
});

test('it can handle meta key modifier', function(assert) {
  assert.expect(1);
  let service = this.subject();

  service.listenFor('x', this, function() {
    assert.ok(false, 'should not run with meta pressed');
  });

  service.listenFor('x', this, function() { assert.ok(true); }, {
    requireMeta: true
  });

  $(document.body).trigger($.Event('keydown', { key: 'x', metaKey: true }));
});

// Haven't found a reliable way of spoofing user agent on phantom js.
if (!/PhantomJS/i.test(window.navigator.userAgent)) {
  test('it can handle meta as ctrl key modifier on Mac OS X when useCmdOnMac is enabled', function(assert) {
    setUserAgent('Mac OS X');
    let service = this.subject();

    let cmdTriggered  = 0;
    let ctrlTriggered = 0;

    service.listenFor('ctrl+x', this, function() {
      ctrlTriggered += 1;
    });
    service.listenFor('ctrl+x', this, function() {
      cmdTriggered += 1;
    }, {
      useCmdOnMac: true
    });

    $(document.body).trigger($.Event('keydown', { key: 'x', ctrlKey: true }));
    assert.equal(ctrlTriggered, 1, 'ctrl hit on mac - ctrl count is 1');
    assert.equal(cmdTriggered,  0, 'ctrl hit on mac - cmd count is 0');
    $(document.body).trigger($.Event('keydown', { key: 'x', metaKey: true }));
    assert.equal(ctrlTriggered, 1, 'cmd hit on mac - ctrl count is 1');
    assert.equal(cmdTriggered,  1, 'cmd hit on mac - cmd count is 1');

    setUserAgent('Windows NT');

    $(document.body).trigger($.Event('keydown', { key: 'x', ctrlKey: true }));
    assert.equal(ctrlTriggered, 2, 'ctrl hit on win - ctrl count is 2');
    assert.equal(cmdTriggered,  2, 'ctrl hit on win - cmd count is 2');
    $(document.body).trigger($.Event('keydown', { key: 'x', metaKey: true }));
    assert.equal(ctrlTriggered, 2, 'cmd hit on win - ctrl count is 2');
    assert.equal(cmdTriggered,  2, 'cmd hit on win - cmd count is 2');

    resetUserAgent();
  });
}

test('it can handle a combination of key modifiers', function(assert) {
  assert.expect(1);
  let service = this.subject();

  service.listenFor('Del', this, function() { assert.ok(false, 'should not run'); });
  service.listenFor('Del', this, function() {
    assert.ok(false, 'should not run');
  }, {
    requireAlt: true
  });
  service.listenFor('Del', this, function() { assert.ok(true); }, {
    requireCtrl: true,
    requireAlt:  true
  });

  $(document.body).trigger($.Event('keydown', {
    key:     'Del',
    ctrlKey: true,
    altKey:  true
  }));
});

test('it can handle a combination shorthand', function(assert) {
  assert.expect(1);
  let service = this.subject();

  service.listenFor('x', this, function() {
    assert.ok(false, 'should not run with ctrl pressed');
  });

  service.listenFor('ctrl+x', this, function() { assert.ok(true); });

  $(document.body).trigger($.Event('keydown', { key: 'x', ctrlKey: true }));
});

test('stopListeningFor removes the keyboard handler', function(assert) {
  assert.expect(3);
  let service = this.subject();

  let listener = function() { assert.ok(true); };
  service.listenFor('ctrl+x', this, listener);
  service.listenFor('ctrl+x', this, function() { assert.ok(true); });

  $(document.body).trigger($.Event('keydown', { key: 'x', ctrlKey: true }));

  service.stopListeningFor('ctrl+x', this, listener);

  $(document.body).trigger($.Event('keydown', { key: 'x', ctrlKey: true }));
});

test('listenForOnce only gets called once', function(assert) {
  assert.expect(1);
  let service = this.subject();

  service.listenForOnce('x', this, function() { assert.ok(true); });

  $(document.body).trigger($.Event('keydown', { key: 'x' }));
  $(document.body).trigger($.Event('keydown', { key: 'x' }));
});

test('it falls back to event.keyCode if event.key is not set', function(assert) {
  assert.expect(1);
  let service = this.subject();

  service.listenFor('x', this, function() { assert.ok(true); });

  $(document.body).trigger($.Event('keydown', { keyCode: 88 }));
});

test('it can handle the space key', function(assert) {
  assert.expect(1);
  let service = this.subject();

  service.listenFor(' ', this, function() { assert.ok(true); });

  $(document.body).trigger($.Event('keydown', { key: ' ' }));
});

test('multiple shortcuts can be specified at once', function(assert) {
  assert.expect(2);
  let service = this.subject();

  service.listenFor(['a', 'b'], this, function() { assert.ok(true); });

  $(document.body).trigger($.Event('keydown', { key: 'a' }));
  $(document.body).trigger($.Event('keydown', { key: 'b' }));
});

test('multiple shortcuts can be specified at once - with modifiers',
function(assert) {
  assert.expect(2);
  let service = this.subject();

  service.listenFor(['ctrl+a', 'shift+b'], this, function() { assert.ok(true); });

  $(document.body).trigger($.Event('keydown', { key: 'a', ctrlKey: true }));
  $(document.body).trigger($.Event('keydown', { key: 'b', ctrlKey: true }));
  $(document.body).trigger($.Event('keydown', { key: 'b', shiftKey: true }));
});

test('stopListingFor also support multiple shortcuts', function(assert) {
  assert.expect(0);
  let service = this.subject();

  let callback = function() { assert.ok(false); };
  service.listenFor(['ctrl+a', 'shift+b'], this, callback);
  service.stopListeningFor(['ctrl+a', 'shift+b'], this, callback);

  $(document.body).trigger($.Event('keydown', { key: 'a', ctrlKey: true }));
  $(document.body).trigger($.Event('keydown', { key: 'b', shiftKey: true }));
});

test('if event.target is an input ignore by default', function(assert) {
  assert.expect(0);
  let service = this.subject();

  service.listenFor('x', this, function() { assert.ok(true); });

  let input    = document.createElement('input');
  let textarea = document.createElement('textarea');

  $(document.body).trigger($.Event('keydown', { key: 'x', target: input }));
  $(document.body).trigger($.Event('keydown', { key: 'x', target: textarea }));
});

test('if event.target is an input handle if option is set', function(assert) {
  assert.expect(2);
  let service = this.subject();

  service.listenFor('x', this, function() { assert.ok(true); }, {
    actOnInputElement: true
  });

  let input    = document.createElement('input');
  let textarea = document.createElement('textarea');

  $(document.body).trigger($.Event('keydown', { key: 'x', target: input }));
  $(document.body).trigger($.Event('keydown', { key: 'x', target: textarea }));
});

test('options.debounce wraps callback in run.debounce with specified time',
function(assert) {
  assert.expect(1);
  let done = assert.async();
  let service = this.subject();

  service.listenFor('x', this, function() { assert.ok(true); done(); }, {
    debounce: 1
  });

  $(document.body).trigger($.Event('keydown', { key: 'x' }));
  $(document.body).trigger($.Event('keydown', { key: 'x' }));
});

test('options.throttle wraps callback in run.throttle with specified time',
function(assert) {
  assert.expect(2);
  let done = assert.async();
  let service = this.subject();

  service.listenFor('x', this, function() { assert.ok(true); }, {
    throttle: 1
  });

  $(document.body).trigger($.Event('keydown', { key: 'x' }));
  $(document.body).trigger($.Event('keydown', { key: 'x' }));

  setTimeout(() => {
    $(document.body).trigger($.Event('keydown', { key: 'x' }));
    done();
  }, 1);
});

test('options.scheduleOnce wraps callback in run.once', function(assert) {
  assert.expect(1);
  let service = this.subject();

  service.listenFor('x', this, function() { assert.ok(true); }, {
    scheduleOnce: true
  });

  run(() => {
    $(document.body).trigger($.Event('keydown', { key: 'x' }));
    $(document.body).trigger($.Event('keydown', { key: 'x' }));
    $(document.body).trigger($.Event('keydown', { key: 'x' }));
  });
});

// regressions

test('listening for "." works', function(assert) {
  assert.expect(1);
  let service = this.subject();

  service.listenFor('.', this, function() { assert.ok(true); });

  run(() => {
    $(document.body).trigger($.Event('keydown', { key: '.' }));
  });
});
