import Ember from 'ember';
import Mixed from 'kodr/models/mixed';

export default Ember.Route.extend({
    afterModel: function(trial) {
        if(trial.work===undefined) {
            trial.set('work', Mixed.create({solution:trial.get('challenge.blueprint.setup')}));
        }
        if(this.get('session.flags') && this.get('session.flags.no_setup') && !trial.get('started')) {
            trial.work.set('solution', '');
        }
        if(!trial.get('started')) {
            trial.set('started', true).save();
        }
    },
});
