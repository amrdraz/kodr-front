import Ember from 'ember';
import Mixed from 'kodr/models/mixed';

export default Ember.Route.extend({
    controllerName: 'trial',
    renderTemplate: function() {
        this.render('trial');
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
        if (this.get('session.flags') && this.get('session.flags.no_setup') && !trial.get('started')) {
            trial.work.set('solution', '');
        }
        if (!trial.get('started')) {
            trial.set('started', true);
            trial.save();
        }
    },
});
