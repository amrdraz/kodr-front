import Ember from 'ember';

export default Ember.Component.extend({
    tagName:'section',
    actions: {
        run() {
            this.sendAction(this.get('run'));
        },
        test(report) {
            this.sendAction(this.get('test'), report);
        },
        reset() {
            this.sendAction(this.get('reset'));
        },
    }
});
