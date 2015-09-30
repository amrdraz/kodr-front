import Ember from 'ember';
var _ = window._;

export default Ember.Mixin.create({
    modalSubscribe: function() {
        this.EventBus.subscribe('trial.complete.flow', this, this.submitSurvey);
    }.on('activate'),
    modalUnSubscribe: function() {
        this.EventBus.unsubscribe('trial.complete.flow', this, this.submitSurvey);
    }.on('deactivate'),
    submitSurvey(survey) {
        survey.flow = survey.challengeLevel/survey.skillLevel;
        var mesure = {
            event:'trial.flow.mesure',
            user: this.get('session.user.id'),
            trial: this.modelFor('user-arena.trial').get('id'),
            action:'flow',
            meta: survey
        };
        this.container.lookup('socket:main').emit('trial.event', mesure);
        this.EventBus.publish('trial.complete.reward');
    },
    actions: {
        showModal: function(name, model) {
            this.render(name, {
                into: 'trial',
                outlet: 'modal',
                model: model
            });
        },
        removeModal: function() {
            this.disconnectOutlet({
                outlet: 'modal',
                parentView: 'trial'
            });
        }
    }
});
