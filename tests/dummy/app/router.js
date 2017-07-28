
import Router from 'ember-router';
import config from './config/environment';

export default Router.extend({
  location: config.locationType,
  rootURL:  config.rootURL
}).map(function() { });