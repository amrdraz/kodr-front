import Ember from 'ember';

export default Ember.Controller.extend({
    
    userArena: function() {
        return this.store.queryRecord('userArena', {arena:this.get('model.id'), user:this.get('session.user.id')});
    }.property('model.user')
});
