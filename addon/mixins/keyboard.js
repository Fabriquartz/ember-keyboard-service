import Ember from 'ember';

const { isArray } = Ember;
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
      if (isArray(handlerDef.arguments)) {
        handlerDef.options = handlerDef.options || {};
        handlerDef.options.arguments = handlerDef.arguments;
      }

      keyboard.listenFor(
        handlerDef.key, this, handlerDef.handler, handlerDef.options);
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
