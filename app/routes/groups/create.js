import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import Ember from 'ember';

export default Ember.Route.extend(AuthenticatedRouteMixin,{
  controllerName: 'group.edit',
  // activate: function() {},
  deactivate: function() {
    var model = this.modelFor('groups.create');
    if(model && model.get('isNew')) {
      model.deleteRecord();
    }
  },
  // setupController: function(controller, model) {
  //   this.controllerFor('groupEdit').set('model',model);
  // },
  renderTemplate: function() {
    this.render('group.edit');
  },
  // beforeModel: function() {},
  // afterModel: function() {},
  
  model: function() {
      return this.store.createRecord('group');
  }
});
