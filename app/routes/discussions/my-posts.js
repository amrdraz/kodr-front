import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  session: Ember.inject.service('session'),
  userId: function () {
      return this.get('session.content.secure.user_id');
  }.property('session.content.secure'),
  model() {
    return this.store.query('post', {
      author: this.get('userId')
    });
  },
  actions: {}
});
