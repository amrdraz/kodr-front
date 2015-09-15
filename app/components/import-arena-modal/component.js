import Ember from 'ember';

export default Ember.Component.extend({
    importString:"",
    actions: {
        importChallenges(){
            this.sendAction("importChallenges", this.get("importString"));
        }
    }
});
