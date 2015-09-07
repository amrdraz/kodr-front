import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        run() {
            this.sendAction(this.get('run'));
        }
    }
});
