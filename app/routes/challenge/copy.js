import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import Ember from 'ember';


export default Ember.Route.extend(AuthenticatedRouteMixin,{
  controllerName: 'challenge.edit',
  // activate: function() {},
  deactivate: function() {
    var model = this.modelFor('challenge.copy');
    if(model.get('isNew')) {
      model.deleteRecord();
    }
  },
  // setupController: function(controller, model) {
  //   // controller.needs('challenge.edit').set('model', model);
  // },
  renderTemplate: function() {
    this.render('challenge.edit');
  },
  // beforeModel: function() {},
  // afterModel: function() {},
  
  model: function() {
      var challenge = this.modelFor('challenge').serialize();
      challenge.arena = this.modelFor('arena');
      challenge.isPublished = false;
      console.log(challenge);

      return this.store.createRecord('challenge', challenge);
  }
});