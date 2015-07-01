import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import Ember from 'ember';

export default Ember.Route.extend(AuthenticatedRouteMixin,{
  controllerName: 'arena.edit',
  // activate: function() {},
  deactivate: function() {
    var model = this.modelFor('arenas.create');
    if(model.get('isNew')) {
      model.deleteRecord();
    }
  },
  // setupController: function(controller, model) {
  //   this.controllerFor('arenaEdit').set('model', model);
  // },
  renderTemplate: function() {
    this.render('arena.edit');
  },
  // beforeModel: function() {},
  // afterModel: function() {},
  
  model: function() {
      return this.store.createRecord('arena');
  }
});
