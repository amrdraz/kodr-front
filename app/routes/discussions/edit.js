import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin,{

  model(params) {
    return this.store.findRecord('post', params.post_id).then((res)=>{
        var currentUserId = this.get('session.user.id').toString();
        var authorId = res.get('author.id').toString();
        if(currentUserId!==authorId){
          this.transitionTo('index');
          return;
        }
        return res;
    });
  },

  setupController(controller, model) {
    this._super(controller, model);

    controller.set('title', 'Edit Post');
    controller.set('buttonLabel', 'Save Changes');
  },

  renderTemplate() {
    this.render('discussions/form');
  },

  actions: {

    savePost(newPost,tags) {
      newPost.set('tags',tags);
      newPost.save().then(() => this.transitionTo('discussions.view',newPost.id));
    },

    willTransition(transition) {
      let model = this.controller.get('model');

      if (model.get('hasDirtyAttributes')) {
        let confirmation = confirm("Your changes haven't saved yet. Would you like to leave this form?");

        if (confirmation) {
          model.rollbackAttributes();
        } else {
          transition.abort();
        }
      }
    }
  }
});
