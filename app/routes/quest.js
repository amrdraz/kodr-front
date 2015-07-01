import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import Ember from 'ember';

var QuestRoute = Ember.Route.extend(AuthenticatedRouteMixin,{
  // activate: function() {},
  // deactivate: function() {},
  // setupController: function(controller, model) {},
  // renderTemplate: function() {},
  // beforeModel: function() {},
  // afterModel: function() {},
  
  // model: function(params) {
  //     return this.store.find('arena', params.arena_id);
  // }
});

export default QuestRoute;
