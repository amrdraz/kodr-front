import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import Ember from 'ember';

var GroupRoute = Ember.Route.extend(AuthenticatedRouteMixin,{
  // activate: function() {},
  // deactivate: function() {},
  // setupController: function(controller, model) {},
  // renderTemplate: function() {},
  // beforeModel: function() {},
  // afterModel: function() {},
  
  model: function(params) {
      return this.store.findRecord('group', params.group_id);
  }
});

export default GroupRoute;
