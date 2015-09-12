import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import Ember from 'ember';

var UserArenaRoute = Ember.Route.extend(AuthenticatedRouteMixin,{
  // activate: function() {},
  // deactivate: function() {},
  // setupController: function(controller, model) {},
  // renderTemplate: function() {},
  // beforeModel: function() {},
  // afterModel: function() {},
    model: function(params) {
        var store = this.store;
        return store.findRecord('arena', params.arena_id);
    }
});

export default UserArenaRoute;
