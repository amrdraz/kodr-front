import Ember from 'ember';

export default Ember.Controller.extend({
    breadCrumb:'arenas',
    breadCrumbPath:'userArenas',
    needs: ['userArena'],
    arena: Ember.computed.alias("controllers.userArena.model.arena"),
    trials: function() {
        return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
            sortProperties: ['order'],
            content: this.store.query('trial', {arena:this.get('arena.id'), user:this.get('session.user.id')})
        });
    }.property('model.trials'),
    actions: {
        try: function(trial) {
            this.transitionToRoute('userArena.trial', this.get('model'), trial);
        }
    }
});
