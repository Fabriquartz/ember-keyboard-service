import Ember from 'ember';

const { assert, isArray } = Ember;
const service = Ember.inject.service;

export default Ember.Mixin.create({
  keyboard: service(),

  concatenatedProperties: 'keyboardHandlers',

  init() {
    this._super.apply(this, arguments);

    const keyboard = this.get('keyboard');
    const handlerDefinitions = this.get('keyboardHandlers');

    if (!isArray(handlerDefinitions)) { return; }

    this.get('keyboardHandlers').forEach((handlerDef) => {
      let handler = this.get(handlerDef.handler);

      assert('The function ' + handlerDef.handler + ' must exist',
             typeof handler === 'function');

      if (isArray(handlerDef.arguments)) {
        const originalHandler = handler;
        handler = function() {
          originalHandler.apply(this, handlerDef.arguments);
        };
      }

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
