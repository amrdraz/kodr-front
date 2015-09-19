import Ember from 'ember';

export default Ember.Controller.extend({
    arena: Ember.computed.alias("model.arena"),
    trials: function() {
        return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
            sortProperties: ['order'],
            content: this.store.query('trial', {arena:this.get('arena.id'), user:this.get('session.user.id')})
        });
    }.property('model.trials')
});
