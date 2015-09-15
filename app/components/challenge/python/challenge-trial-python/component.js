import Ember from 'ember';
import ChallengeCommon from 'kodr/mixins/challenge/python/challenge-common-python';

export default Ember.Component.extend(ChallengeCommon, {
    evaluatedModelProperty: 'code',
    testEvent(){
        this.testCode({
            code: this.get('model.blueprint').get(this.get('evaluatedModelProperty')),
            test: this.get('model.challenge.blueprint.tests'),
            exp: this.get('model.challenge.exp')
        });
    }
});