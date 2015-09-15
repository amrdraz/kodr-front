import Ember from 'ember';
import ChallengeCommon from 'kodr/mixins/challenge/python/challenge-common-python';
var _ = window._;
export default Ember.Component.extend(ChallengeCommon, {
    evaluatedModelProperty: 'solution',
    evaluatedModelObject: 'work',
    testEvent(){
        this.testCode({
            code: this.get('model.work').get('solution'),
            test: this.get('model.challenge.blueprint.tests'),
            exp: this.get('model.challenge.exp')
        });
    },
    typing: _.debounce(function () {
        var model = this.get('model');
        console.log("typing", Date.now(), model.get('work.solution'));
    }, 200),
    watchEvents: function () {
        var model = this.get('model');
        model.addObserver('work.solution', model, this.typing);
    }.on("didInsertElement"),
    unWatchEvents: function () {
        var model = this.get('model');
        model.removeObserver('work.solution', model, this.typing);
    }.on("willClearRender")
});