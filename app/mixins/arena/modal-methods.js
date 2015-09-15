import Ember from 'ember';
var _ = window._;

export default Ember.Mixin.create({
    modalSubscribe: function() {
        this.EventBus.subscribe('arena.edit.import', this, this.importChallenges);
    }.on('activate'),
    modalUnSubscribe: function() {
        this.EventBus.unsubscribe('arena.edit.import', this, this.importChallenges);
    }.on('deactivate'),
    importChallenges(string) {
        var challenges = JSON.parse(string);
        var arena = this.modelFor('arena');
        var store = this.get('store');
        console.log(challenges);
        challenges = _.map(challenges, (ch) => {
            ch.arena = arena;
            ch.isPublished = false;
            ch.valid = false;
            return store.createRecord('challenge', ch);
        });
        challenges.forEach((ch)=>{ch.save();});
        arena.notifyPropertyChange('challenges');
    },
    actions: {
        showModal: function(name, model) {
            this.render(name, {
                into: 'arena.edit',
                outlet: 'modal',
                model: model
            });
        },
        removeModal: function() {
            this.disconnectOutlet({
                outlet: 'modal',
                parentView: 'arena.edit'
            });
        }
    }
});
