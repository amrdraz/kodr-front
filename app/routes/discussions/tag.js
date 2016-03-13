import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.store.query('post', {tag:params.tag_id});
  },
  actions: {}
});
