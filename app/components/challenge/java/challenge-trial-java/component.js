import Ember from 'ember';
import ChallengeCommon from 'kodr/mixins/challenge/challenge-common-java';

export default Ember.Component.extend(ChallengeCommon, {
    tagName:'section',
    classNames:['row'],
    evaluatedModelProperty:'code',
    actions: {
        run: function () {
            this.run();
        },
        test: function () {
           this.validate();
        },
        reset: function () {
            this.sendAction(this.get("reset"));
        },
    }
});
