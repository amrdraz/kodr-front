import Ember from 'ember';
import ChallengeCommon from 'kodr/mixins/challenge/python/challenge-common-python';


export default Ember.Component.extend(ChallengeCommon, {
    evaluatedModelProperty: 'solution',
    testEvent(){
        this.clearLint('tests');
        this.testCode({
            code: this.get('model.blueprint').get(this.get('evaluatedModelProperty')),
            test: this.get('model.blueprint.tests'),
            exp: this.get('model.exp')
        });
    }
});
