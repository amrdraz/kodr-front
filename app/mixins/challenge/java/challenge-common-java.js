import ChallengeCommon from 'kodr/mixins/challenge/challenge-common';
import Ember from 'ember';
var toastr = window.toastr;


export default Ember.Mixin.create(ChallengeCommon, {
    runInServer(code, model, cb) {
        Ember.$.ajax({
            url: '/api/challenges/run',
            type: 'POST',
            data: {
                code: code,
                type: 'java',
                inputs: model.get('inputs')?model.get('inputs').mapBy("value"):model.get('challenge.inputs')
            }
        }).done(cb).fail(function(err) {
            toastr.error(err.statusText);
        });
    },
    testInServer(code, model, cb) {
        model = model.get('inputs')?model:model.get('challenge');
        var data = (model.getProperties(['type', 'tests', 'exp']));
        data.inputs = model.get('inputs').mapBy("value");
        Ember.$.ajax({
            url: '/api/challenges/test',
            type: 'POST',
            data: {
                code: code,
                challenge: data
            }
        }).done(cb).fail(function(err) {
            toastr.error(err.responseText);
        });
    },
    parseSterr(sterr) {
        var i, column_no_start, column_no_stop, errs, msg, line, fragment, lines = sterr.replace(/(Error.*line)/g, "\n$1").replace(/\^/g, "^\n").split('\n'),
            found = [];

        for (i = 0; i < lines.length;) {
            if ((/^Error/).test(lines[i])) {
                errs = lines[i++].match(/Error.* line (\d*).*:\d+: (.*)/);
                line = +errs[1];
                msg = errs[2];
                if (~lines[i].indexOf('found')) {
                    i += 2;
                } else {
                    fragment = lines[i++] + "\n";
                    column_no_start = lines[i++].length - 2;
                    column_no_stop = column_no_start + 1;
                }
            } else if (/RuntimeError/.test(lines[i])) {
                msg = (lines[i++].match(/RuntimeError: (.*)/))[1];
                line = +(lines[i++].match(/at.*:(\d)/))[1];
            } else {
                i++;
                continue;
            }
            found.push({
                line_no: (line) - 1,
                column_no_start: column_no_start || 0,
                column_no_stop: column_no_stop || 200,
                message: msg,
                fragment: fragment || '',
                severity: "error"
            });
        }
        // console.log(found);
        return found;
    },
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
});
