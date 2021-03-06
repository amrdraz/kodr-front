import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin,{

  model: function (params) {
    console.log(params);
    return null;
  },

  setupController: function (controller, model) {
    this._super(controller, model);

    controller.set('title', 'Create a new Post');
    controller.set('buttonLabel', 'Create');
  },

  renderTemplate() {
    this.render('solution/form');
  },

  actions: {

    savePost(newPost,tags) {
      newPost.set('tags',tags);
      newPost.save().then((post) => {
        this.transitionTo('discussions.view',newPost.id);
      });
    },

    willTransition() {
      let model = this.controller.get('model');

      if (model.get('isNew')) {
        model.destroyRecord();
      }
    }
  }
});
