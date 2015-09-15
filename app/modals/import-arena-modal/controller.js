import Ember from 'ember';

export default Ember.Controller.extend({
    importString:"",
    actions: {
        importChallenges(){
            this.EventBus.publish("arena.edit.import", this.get("importString"));
        }
    }
});
