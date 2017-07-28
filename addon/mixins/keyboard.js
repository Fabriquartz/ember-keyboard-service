import Ember from 'ember';
import Mixin from 'ember-metal/mixin';
import Service  from 'ember-service/inject';

const { isArray } = Ember;
const service = Service;

export default Mixin.create({
  keyboard: service(),

  concatenatedProperties: 'keyboardHandlers',

  init() {
    this._super(...arguments);

    let keyboard = this.get('keyboard');
    let handlerDefinitions = this.get('keyboardHandlers');

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
    let keyboard = this.get('keyboard');
    this.get('keyboardHandlers').forEach(({ key, handler, options }) => {
      keyboard.stopListeningFor(key, this, handler, options);
    });

    this._super(...arguments);
  }
});
