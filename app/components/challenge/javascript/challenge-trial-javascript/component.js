import ChallengeCommon from 'kodr/mixins/challenge/javascript/challenge-common-javascript';
import Ember from 'ember';

export default Ember.Component.extend(ChallengeCommon, {
    evaluatedModelProperty:'code',
    actions: {
        run: function () {
            this.send('runInConsole');
        },
        test: function () {
           this.evaluate();
        },
        reset: function () {
            this.sendAction(this.get("reset"));
        },
    }
});
