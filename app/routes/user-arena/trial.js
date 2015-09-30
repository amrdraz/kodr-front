import Ember from 'ember';
import Mixed from 'kodr/models/mixed';
import ModalMethodsMixin from 'kodr/mixins/trial/trial-modal-methods';


export default Ember.Route.extend(ModalMethodsMixin, {
    controllerName: 'trial',
    renderTemplate: function() {
        this.render('trial');
    },
    setupController: function(controller, model) {
        controller.set('model', model);
    },
    model(params){
        return this.store.find('trial', params.trial_id);
    },
    afterModel: function(trial) {
        if (trial.get('work') === undefined) {
            trial.set('work', Mixed.create({
                solution: trial.get('challenge.blueprint.setup')
            }));
        }
        if (trial.get('blueprint') === undefined) {
            trial.set('blueprint', Mixed.create(trial.get('challenge.blueprint').toJSON()));
        }
        if (this.get('session.user.flags') && this.get('session.user.flags.no_setup') && !trial.get('started')) {
            trial.set('work.solution', '');
        }
    },
});
