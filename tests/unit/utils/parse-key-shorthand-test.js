import { module, test } from 'qunit';
import parseKeyShorthand from 'ember-keyboard-service/utils/parse-key-shorthand';

module('Unit | Utils | parseKeyShorthand');

test('just a key', (assert) => {
  const options = {};
  assert.equal(parseKeyShorthand('k', options), 'k');
  assert.deepEqual(options, {});
});

test('a key with ctrl modifier', (assert) => {
  const options = {};
  assert.equal(parseKeyShorthand('ctrl+k', options), 'k');
  assert.deepEqual(options, { requireCtrl: true });
});

test('a key with alt modifier', (assert) => {
  const options = {};
  assert.equal(parseKeyShorthand('alt+k', options), 'k');
  assert.deepEqual(options, { requireAlt: true });
});

test('a key with shift modifier', (assert) => {
  const options = {};
  assert.equal(parseKeyShorthand('shift+k', options), 'k');
  assert.deepEqual(options, { requireShift: true });
});

test('a key with meta modifier', (assert) => {
  const options = {};
  assert.equal(parseKeyShorthand('meta+k', options), 'k');
  assert.deepEqual(options, { requireMeta: true });
});

test('a key with multiple modifiers', (assert) => {
  const options = {};
  assert.equal(parseKeyShorthand('ctrl+shift+k', options), 'k');
  assert.deepEqual(options, { requireCtrl: true, requireShift: true });
});

test('cmd is an alternative for meta', function(assert) {
  const options = {};
  assert.equal(parseKeyShorthand('cmd+k', options), 'k');
  assert.deepEqual(options, { requireMeta: true });
});

test('option is an alternative for alt', function(assert) {
  const options = {};
  assert.equal(parseKeyShorthand('option+k', options), 'k');
  assert.deepEqual(options, { requireAlt: true });
});

test('nctrl is a also sets useCmdOnMac in addition to requireCtrl', (assert) => {
  const options = {};
  assert.equal(parseKeyShorthand('nctrl+k', options), 'k');
  assert.deepEqual(options, { requireCtrl: true, useCmdOnMac: true });
});
