import Ember from 'ember';
import ChallengeCommon from 'kodr/mixins/challenge/java/challenge-common-java';

export default Ember.Component.extend(ChallengeCommon, {
    evaluatedModelProperty:'code',
    actions: {
        run: function () {
            this.runCode();
        },
        test: function () {
           this.validate();
        },
        reset: function () {
            this.sendAction(this.get("reset"));
        },
    }
});
