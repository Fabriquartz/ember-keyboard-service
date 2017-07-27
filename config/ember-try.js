/* eslint-env node */
module.exports = {
  scenarios: [
    {
      name: 'default',
      dependencies: { }
    },
    {
      name: 'ember-release',
      dependencies: { 'ember-source': 'ember#release' },
      resolutions:  { 'ember-source': 'release' }
    },
    {
      name: 'ember-beta',
      dependencies: { 'ember-source': 'ember#beta' },
      resolutions:  { 'ember-source': 'beta' }
    },
    {
      name: 'ember-canary',
      dependencies: { 'ember-source': 'ember#canary' },
      resolutions:  { 'ember-source': 'canary' }
    }
  ]
};