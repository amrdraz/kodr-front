import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import Ember from 'ember';

export default Ember.Route.extend(AuthenticatedRouteMixin,{
    // activate: function() {},
    // deactivate: function() {},
    // setupController: function(controller, model) {
    //     controller.set('model', model);
    //     // controller.set('currentChallenge', model.get('arena.challenges.lastObject'));
    // },
    // renderTemplate: function() {},
    // beforeModel: function() {},
    model: function(params) {
        return this.store.createRecord('userArena', {
            arena:this.modelFor('userArena')
        }).save();
    }
});