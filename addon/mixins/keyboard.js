import Ember from 'ember';

const { assert } = Ember;
const service = Ember.inject.service;

export default Ember.Mixin.create({
  keyboard: service(),

  concatenatedProperties: 'keyboardHandlers',

  init() {
    this._super.apply(this, arguments);
    const keyboard = this.get('keyboard');

    this.get('keyboardHandlers').forEach((handlerDef) => {
      const handler = this.get(handlerDef.handler);

      assert('The function ' + handlerDef.handler + ' must exist',
             typeof handler === 'function');

      keyboard.listenFor(handlerDef.key, this, handler, handlerDef.options);
    });
  },

  willDestroy() {
    const keyboard = this.get('keyboard');
    this.get('keyboardHandlers').forEach((handlerDef) => {
      keyboard.stopListeningFor(handlerDef.key,
        this, handlerDef.handler, handlerDef.options);
    });

    this._super.apply(this, arguments);
  }
});
