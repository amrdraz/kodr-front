import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import Ember from 'ember';

export default Ember.Route.extend(AuthenticatedRouteMixin,{
  actions: {
    remove: function(model) {
      if(confirm('Are you sure?')) {
        model.destroyRecord();
      }
    }
  },
  beforeModel(){
    if(this.get('session.isStudent')){
      return this.transitionTo('userArenas');
    }
  },
  model: function() {
    return this.store.findAll('arena');
  }
});
