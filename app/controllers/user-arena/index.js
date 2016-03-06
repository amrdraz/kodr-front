import Ember from 'ember';

export default Ember.Controller.extend({
    breadCrumb:'arenas',
    breadCrumbPath:'userArenas',
    needs: ['userArena'],
    arena: Ember.computed.alias("controllers.userArena.arena"),
    trials: Ember.computed.alias("controllers.userArena.trials"),
    randomResult: null,
    actions: {
        try: function(trial) {
            this.transitionToRoute('userArena.trial', trial);
        },
        random: function(userArena) {
            console.log("RANDOM", userArena);
            this.set('randomResult', userArena);
        }
    }
});
