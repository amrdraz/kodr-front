import Ember from 'ember';

export default Ember.Controller.extend({
    breadCrumb:'arena',
    breadCrumbPath:'arenaTrial',
    needs: ['arenaTrial'],
    arena: Ember.computed.alias("controllers.arenaTrial.model"),
    trials: function() {
        return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
            sortProperties: ['order'],
            content: this.get('model.trials')
        });
    }.property('model.trials'),
    init: function() {
        this._super();
    },
    currentTrial: function() {
        return this.get('model.trials.firstObject');
    }.property('arena.challenges.[]'),
    actions: {
        try: function(trial) {
            this.transitionToRoute('trial', trial);
        }
    }
});
