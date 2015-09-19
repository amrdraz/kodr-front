import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import Ember from 'ember';

var UserArenaRoute = Ember.Route.extend(AuthenticatedRouteMixin,{
  // activate: function() {},
  // deactivate: function() {},
  // setupController: function(controller, model) {},
  // renderTemplate: function() {},
  // beforeModel: function() {},
  // afterModel: function(model) {
  //   return this.store.query('trial', {arena:model.get('arena.id'), user:this.get('session.user.id')});
  // },
  model: function(params) {
      var store = this.store;
      return store.findRecord('userArena', params.user_arena_id);
  }
});

export default UserArenaRoute;
