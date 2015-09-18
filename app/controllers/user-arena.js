import Ember from 'ember';

export default Ember.Controller.extend({
    trials: function() {
        return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
            sortProperties: ['order'],
            content: this.get('model.trials')
        });
    }.property('model.trials')
});
