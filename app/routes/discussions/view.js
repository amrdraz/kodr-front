import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return Ember.RSVP.hash({
       post: this.store.findRecord('post', params.post_id).then((post)=>{
         console.log(post.get('author'));
         return post;
       }),
       comments: this.store.query('comment',{post:params.post_id})
     });
  },
  post: null,
  setupController: function(controller, model) {
    //console.log(model.post.get('author.content.id'));
    controller.set('model', model.post);
    controller.set('comments', model.comments);
    this.set('post',model.post);
  },

  session: Ember.inject.service('session'),
  actions: {
    unAuthenticated(){
      this.transitionTo('login');
    },
    deletePost(post) {
      let confirmation = confirm('Are you sure?');

      if (confirmation) {
        post.destroyRecord().then(() => this.transitionTo('discussions'));
      }
    },
    saveComment(text) {
      if(!this.get('session.isAuthenticated')){
        this.transitionTo('login');
      } else {
        var post  = this.get('post');
        var newComment = this.store.createRecord('comment',{text: text});
        newComment.set('post',post);
        newComment.save().then(()=>{
          this.refresh();
        });
      }
    },
    deleteComment(comment) {
      let confirmation = confirm('Are you sure?');

      if (confirmation) {
          //var post  = this.currentModel;
          comment.destroyRecord();
          //post.get('comments').removeObject(comment);
          //post.save();
      }
    },
    saveReply(text,comment) {
      var newReply = this.store.createRecord('reply',{text: text});
      newReply.set('comment',comment);
      newReply.save();
    },
    deleteReply(reply , comment) {
      let confirmation = confirm('Are you sure?');

      if (confirmation) {
          reply.destroyRecord();
          comment.get('replies').removeObject(reply);
          comment.save();
      }
    }
  }
});
