import Ember from 'ember';

export default Ember.Mixin.create(Ember.Evented, {
    evaluatedModelProperty: 'code',
    printReport(report) {
        // var tests = report.tests.length;
        var passes = report.passes.length;
        var failures = report.failures.length;
        var controller = this;
        var pass = report.passed;
        var writeTest = function(test, pass) {
            controller.EventBus.publish('console.write', (test.fullName || test.message.replace(/\n/g, "\\n")) + '\n', pass);
        };
        console.log(report);
        controller.EventBus.publish('console.write', "========= Running Submission " + (pass ? 'Passed' : 'Failed') + " ==========\n", pass ? 'result' : 'error');

        if (passes) {
            report.passes.forEach(function(test) {
                writeTest(test, 'result');
            });
            if (failures) {
                controller.EventBus.publish('console.write', '\n-----------------------------------\n\n');
            }
        }

        if (failures) {
            report.failures.forEach(function(test) {
                writeTest(test, 'error');
                if (test.failedExpectations) {
                    test.failedExpectations.forEach(function(fail) {
                        if (fail.message.indexOf('Error: Timeout')) {
                            writeTest(fail, 'error');
                        } else {
                            controller.EventBus.publish('console.write', '\tTimeout this test ran (' + test.durationSec + 's)\n', 'error');
                        }
                    });
                }
                // console.error(test.failedExpectations[0].stack);
            });
        }
        if (passes || failures) {
            controller.EventBus.publish('console.write', "==============================================\n", pass ? 'result' : 'error');
        }

        return report;
    },
    actions:{
        run() {
            this.sendAction(this.get('run') || 'run');
        },
        test() {
            this.sendAction(this.get('test') || 'test');
        },
        reset() {
            this.sendAction(this.get("reset") || 'rest');
        },
    }
});
