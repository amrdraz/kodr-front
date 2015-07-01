import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import Ember from 'ember';

export default Ember.Route.extend(AuthenticatedRouteMixin,{
  model: function() {
      return Ember.Object.create({name:'', from:0, to:0});
  }
});
