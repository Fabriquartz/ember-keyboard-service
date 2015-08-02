import $ from 'jquery';
import { moduleFor, test } from 'ember-qunit';

// Haven't found a reliable way of spoofing user agent on phantom js.
var setUserAgent, resetUserAgent;
if (!/PhantomJS/i.test(window.navigator.userAgent)) {
  const originalNavigator = window.navigator.__lookupGetter__('userAgent');
  setUserAgent = function setUserAgent(str) {
    window.navigator.__defineGetter__('userAgent', function(){
        return str;
    });
  };

  resetUserAgent = function resetUserAgent() {
    window.navigator.__defineGetter__('userAgent', originalNavigator);
  };
}

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

test('it throws when no key is given', function(assert) {
  assert.expect(1);
  const service = this.subject();

  assert.throws(() => {
    service.listenFor();
  });
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

// Haven't found a reliable way of spoofing user agent on phantom js.
if (!/PhantomJS/i.test(window.navigator.userAgent)) {
  test('it can handle meta as ctrl key modifier on Mac OS X when useCmdOnMac is enabled', function(assert) {
    setUserAgent('Mac OS X');
    const service = this.subject();

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

test('cmd in shorthand is alternative for meta', function(assert) {
  assert.expect(1);
  const service = this.subject();

  service.listenFor('cmd+x', this, function() { assert.ok(true); });

  $(document.body).trigger($.Event('keydown', { key: 'x', metaKey: true }));
});

test('option in shorthand is alternative for alt', function(assert) {
  assert.expect(1);
  const service = this.subject();

  service.listenFor('option+x', this, function() { assert.ok(true); });

  $(document.body).trigger($.Event('keydown', { key: 'x', altKey: true }));
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

test('if event.target is an input ignore by default', function(assert) {
  assert.expect(0);
  const service = this.subject();

  service.listenFor('x', this, function() { assert.ok(true); });

  const input    = document.createElement('input');
  const textarea = document.createElement('textarea');

  $(document.body).trigger($.Event('keydown', { key: 'x', target: input }));
  $(document.body).trigger($.Event('keydown', { key: 'x', target: textarea }));
});

test('if event.target is an input handle if option is set', function(assert) {
  assert.expect(2);
  const service = this.subject();

  service.listenFor('x', this, function() { assert.ok(true); }, {
    actOnInputElement: true
  });

  const input    = document.createElement('input');
  const textarea = document.createElement('textarea');

  $(document.body).trigger($.Event('keydown', { key: 'x', target: input }));
  $(document.body).trigger($.Event('keydown', { key: 'x', target: textarea }));
});
