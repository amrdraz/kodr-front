import ChallengeCommon from 'kodr/mixins/challenge/java/challenge-common-java';
import Ember from 'ember';

export default Ember.Component.extend(ChallengeCommon, {
    evaluatedModelProperty: 'solution',
    actions: {
        run() {
            this.runCode();
        }
    },
    didInsertElement() {
        this.EventBus.subscribe('challenge.test', this, this.validate);
    },
    willClearRender() {
        this.EventBus.unsubscribe('challenge.test', this, this.validate);
    }
});
