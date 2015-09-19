import Ember from 'ember';
import DS from 'ember-data';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import Mixed from 'kodr/models/mixed';

var ChallengeTrialRoute = Ember.Route.extend(AuthenticatedRouteMixin, {
    // activate: function() {},
    // deactivate: function() {},
    // setupController: function(controller, model) {},
    // renderTemplate: function() {},
    afterModel: function(trial) {
        this.transitionTo('trial', trial.get('arena'), trial);
    },
    // afterModel: function() {},
    model: function(params) {
        var store = this.store;
        var session = this.get('session');
        return DS.PromiseObject.create({
            promise: store.find('challenge', params.challenge_id).then((challenge) => {
                var trial = {
                    challenge: challenge.id,
                    work: Mixed.create({
                        solution: challenge.get('blueprint.setup')
                    }),
                    blueprint: challenge.get('blueprint').toJSON(),
                    user: session.user_id
                };
                if (session.get('user.flags') && session.get('user.flags.no_setup')) {
                    trial.work.set('solution', '');
                }
                return Ember.$.ajax({
                    url: 'api/trials',
                    method: 'POST',
                    data: {
                        trial: trial
                    }
                });
            }).then(function(response) {
                var trial = response.trial;
                trial.id = trial._id;
                trial = store.push('trial', trial);
                return trial;
            })
        });
    }
});

export default ChallengeTrialRoute;
