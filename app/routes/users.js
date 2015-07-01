import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import Ember from 'ember';

// UserRoute = require('./routes/user');
// UserIndexRoute = require('./routes/user/index');
// UserEditRoute = require('./routes/user/edit');

var UsersRoute = Ember.Route.extend(AuthenticatedRouteMixin,{
  // activate: function() {},
  // deactivate: function() {},
  // setupController: function(controller, model) {},
  // renderTemplate: function() {},
  // beforeModel: function() {},
  // afterModel: function() {},
  
  model: function(params) {
      return this.store.findAll('user');
  }
});

export default UsersRoute;
