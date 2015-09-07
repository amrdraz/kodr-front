import ChallengeCommon from 'kodr/mixins/challenge/java/challenge-common-java';
import Ember from 'ember';

export default Ember.Component.extend(ChallengeCommon, {
    evaluatedModelProperty: 'solution',
    validate() {
        var component = this;
        var model = component.get('model');
        component.EventBus.publish('console.show');
        component.EventBus.publish('console.write', 'Running Tests...\n');
        component.testInServer(model.get(component.get('evaluatedModelProperty')), model, function(res) {
            component.EventBus.publish('console.write', 'Compiled\n', res.sterr ? 'error' : 'result');
            if (res.sterr) {
                component.EventBus.publish('console.write', res.sterr, 'error');
                component.EventBus.publish('editor.lint', component.get('evaluatedModelProperty'), component.parseSterr(res.sterr));
            } else {
                component.printReport(res.report);
                component.sendAction(component.get("test"), res.report);
            }
        });
    },
    runCode() {
        var component = this;
        var model = component.get('model');
        component.EventBus.publish('console.show');
        component.EventBus.publish('console.write', 'Compiling...\n');
        component.runInServer(model.get(component.get('evaluatedModelProperty')), model, function(res) {
            component.EventBus.publish('console.write', 'Compiled\n', res.sterr ? 'error' : 'result');
            if (res.sterr) {
                component.EventBus.publish('console.write', res.sterr, 'error');
                component.EventBus.publish('editor.lint', component.get('evaluatedModelProperty'), component.parseSterr(res.sterr));
            } else {
                component.EventBus.publish('console.write', res.stout + "\n");
                component.EventBus.publish('editor.lint', component.get('evaluatedModelProperty'), []);
            }
        });
        this.sendAction(this.get('run'));
    },
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
