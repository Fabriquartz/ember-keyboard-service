import Ember from 'ember';

const { isArray } = Ember;
const service = Ember.inject.service;

export default Ember.Mixin.create({
  keyboard: service(),

  concatenatedProperties: 'keyboardHandlers',

  init() {
    this._super(...arguments);

    const keyboard = this.get('keyboard');
    const handlerDefinitions = this.get('keyboardHandlers');

    if (!isArray(handlerDefinitions)) { return; }

    this.get('keyboardHandlers').forEach((handlerDef) => {
      let { key, handler, options } = handlerDef;
      if (isArray(handlerDef.arguments)) {
        options = options || {};
        options.arguments = handlerDef.arguments;
      }

      keyboard.listenFor(key, this, handler, options);
    });
  },

  willDestroy() {
    const keyboard = this.get('keyboard');
    this.get('keyboardHandlers').forEach(({ key, handler, options }) => {
      keyboard.stopListeningFor(key, this, handler, options);
    });

    this._super(...arguments);
  }
});
