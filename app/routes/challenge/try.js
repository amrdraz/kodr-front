import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import Mixed from 'kodr/models/mixed';
import Ember from 'ember';


export default Ember.Route.extend(AuthenticatedRouteMixin, {
    // activate: function() {},
    // deactivate: function() {},
    setupController: function(controller, model) {
        this.controllerFor('trial').set('model', model);
    },
    renderTemplate: function() {
        this.render('trial');
    },
    // beforeModel: function() {},
    // afterModel: function() {},

    model: function() {
        var challenge = this.modelFor('challenge');
        var trial = {
            challenge: challenge,
            work: Mixed.create({solution:challenge.get('blueprint.setup')}),
            blueprint: challenge.get('blueprint')
        };
        if(this.get('session.flags') && this.get('session.flags.no_setup')) {
            trial.set('work.solution', '');
        }
        var record = this.store.createRecord('trial', trial);
        return record;

    }
});