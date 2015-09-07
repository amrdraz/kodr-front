import Ember from 'ember';

export default Ember.Component.extend({
    tagName:'section',
    classNames:['challenge-content', 'row'],
    actions: {
        run() {
            this.sendAction(this.get('run'));
        },
        test(report) {
            this.sendAction(this.get('test'), report);
        }
    }
});
