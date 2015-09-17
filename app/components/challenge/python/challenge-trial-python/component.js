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
    runEvent(target, code){
        this.runCode(code);
    },
    typingTimer: null,
    endTyping(){
        var model = this.get('model');
        this.typingTimer = null;
        var endTime = Date.now();
        console.log("startTyping", this.startTyping ,"endTyping", endTime, model.get('work.solution'));
    },
    typing: function () {
        clearTimeout(this.typingTimer);
        if(!this.typingTimer) {
            this.startTyping = Date.now();
        }
        this.typingTimer =  _.delay(this.endTyping.bind(this), 3000);
    },
    watchEvents: function () {
        var model = this.get('model');
        model.addObserver('work.solution', this, this.typing);
    }.on("didInsertElement"),
    unWatchEvents: function () {
        var model = this.get('model');
        model.removeObserver('work.solution', this, this.typing);
    }.on("willClearRender")
});