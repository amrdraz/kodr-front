import ChallengeCommon from 'kodr/mixins/challenge/javascript/challenge-common-javascript';
import Ember from 'ember';
import Runner from 'kodr/runners/runner';
import iframeTemplate from 'kodr/demo/iframe';

export default Ember.Mixin.create(ChallengeCommon, {
    jshint(code, cb, options) {
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
    testError(error) {
        var console = this.get('console') || console;
        console.Write = console.Write || console.log;
        console.Write('Syntax Error line(' + error.lineNumber + '): ' + error.message + '\n', 'error');
        return false;
    },
    evaluate() {
        var model = this.get('model');
        var component = this;
        var sb = component.get('sandbox');

        this.EventBus.publish('console.show');
        component.jshint(model.get(component.get('evaluatedModelProperty')), function(code, console, sb) {
            sb.load(iframeTemplate, function() {
                sb.evaljs(Runner.test(code, model.get('tests')));
            });
        }, {
            sandbox: sb,
            run: true
        });
    },
    // Evaluate a line of code in the console window
    consoleEval(command) {
            var that = this;
            this.jshint(command, function(code, console, sb) {
                console.Focus();
                sb.evaljs(code, function(error, res) {
                    if (error) {
                        that.EventBus.publish('console.write',error.name + ': ' + error.message + '\n', 'error');
                    } else {
                        var run = res !== undefined;
                        console.Write((run ? '==> ' + res : '\n' + code) + '\n', run ? 'result' : 'jqconsole-old-prompt');
                    }
                });
            });
    },
    actions: {
        // action called to run code in console
        runInConsole() {
            this.EventBus.publish('console.show');
            this.consoleEval(this.get('model.' + this.get('evaluatedModelProperty')));
        },
        // what to do on sandbox load
        sandboxLoaded(sb) {
            var component = this;
            var log = function(msg) {
                console.log(msg);
                component.EventBus.publish('console.write', msg.toString() + '\n');
            };

            sb.on('error', component.testError.bind(component));
            sb.on('test.done', component.parseReport.bind(component));
            // sb.on('structure.done', log);
            sb.on('log', log);
            console.log('loaded sandbox');
        }
    }
});
