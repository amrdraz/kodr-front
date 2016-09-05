import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default Ember.Route.extend(RouteMixin, AuthenticatedRouteMixin, {
  queryParams: 'page',
  page: 1,
  perPage: 10,
  totalPages: 3,
  model(params) {
    return Ember.RSVP.hash({
      posts: this.findPaged('post', {
        challenge: null,
        page: this.get('page'),
        perPage: this.get('perPage')
      }),
      postsCount: $.getJSON("http://localhost:3000/api/posts?count=true&challenge=null")
    });
  },
  setupController: function(controller, model) {
    controller.set('model', model.posts);
    let perPage = this.get('perPage');
    let totalPosts = model.postsCount.count;
    let totalPages = totalPosts/perPage +(totalPosts%perPage==0?0:1);
    controller.set('totalPagesCount', parseInt(totalPages));
  },
  actions: {}
});
