/* global JSHINT*/
import Ember from 'ember';


export default Ember.Mixin.create(Ember.Evented, {
    evaluates: 'code',
    jshint: function(code, cb, options) {
        options = options || {};
        var console = this.get('console') || console;
        console.Write = console.Write || console.log;
        var sb = options.sandbox || this.get('csandbox') || window;
        JSHINT(code, {
            "asi": true, // supress simicolon warning
            "boss": true, // supress warning about using assignment inside while condition
            "eqnull": true,
            "expr": true, // you can type random expressions
            "esnext": false,
            "bitwise": true,
            "curly": false,
            "eqeqeq": true,
            "immed": false,
            "latedef": false,
            "newcap": false,
            "noarg": true,
            "undef": false,
            "strict": false,
            "trailing": false,
            "smarttabs": true,
        });
        var errors = JSHINT.errors;
        if (!errors.length) {
            if (cb) {
                cb.call(this, code, console, sb);
            }
        } else {
            this.testError({
                lineNumber: errors[0].line,
                message: errors[0].reason,
                rest: errors
            });
        }

        // debugger;
        return errors;
    },
    testError: function(error) {
        var console = this.get('console') || console;
        console.Write = console.Write || console.log;
        console.Write('Syntax Error line(' + error.lineNumber + '): ' + error.message + '\n', 'error');
        return false;
    },
    testSuccess: function(report) {
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
                            controller.EventBus.publish('console.write', '\t' + fail.message.replace(/\n/g, "\\n") + '\n', 'error');
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

        return report.passed;
    },
    parseSterr: function(sterr) {
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
    runInServer: function(code, model, cb) {
        Ember.$.ajax({
            url: '/api/challenges/run',
            type: 'POST',
            data: {
                code: code,
                language: model.get('language'),
                inputs: model.get('inputs').mapBy("value")
            }
        }).done(cb).fail(function(err) {
            toastr.error(err.statusText);
        });
    },
    testInServer: function(code, challenge, cb) {
        var data = (challenge.getProperties(['language', 'tests', 'exp']));
        data.inputs = challenge.get('inputs').mapBy("value");
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
    actions: {
        sandboxLoaded: function(sb) {
            var that = this;
            var log = function(msg) {
                console.log(msg);
                that.get('console').Write(msg.toString() + '\n');
            };

            sb.on('error', this.testError.bind(this));
            sb.on('test.done', this.testSuccess.bind(this));
            // sb.on('structure.done', log);
            sb.on('log', log);
            console.log('loaded sandbox');
        },
        runInConsole: function() {
            this.EventBus.publish('console.show');
            this.send('consoleEval', this.get('model.' + this.get('evaluates')));
        },
        consoleEval: function(command) {
            var that = this;
            this.jshint(command, function(code, console, sb) {
                console.Focus();
                sb.evaljs(code, function(error, res) {
                    if (error) {
                        that.trigger('console.write',error.name + ': ' + error.message + '\n', 'error');
                    } else {
                        var run = res !== undefined;
                        console.Write((run ? '==> ' + res : '\n' + code) + '\n', run ? 'result' : 'jqconsole-old-prompt');
                    }
                });
            });
        }
    }
});
