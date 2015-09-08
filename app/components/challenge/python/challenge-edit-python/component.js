import Ember from 'ember';


var $B = window.__BRYTHON__;
var _b_ = $B.builtins;
var Debugger = window.Brython_Debugger;
var $io = {
    __class__: $B.$type,
    __name__: 'io'
};
$io.__mro__ = [$io, _b_.object.$dict];

export default Ember.Component.extend({
    canStep: false,
    isDebugging: false,
    isLastStep: false,
    isFirstStep: false,
    evaluatedModelProperty: 'solution',
    writeToConsole(data, type) {
        this.EventBus.publish('console.write', data, type);
    },
    clearConsole() {
        this.EventBus.publish('console.clear');
    },
    clearLint(){
        this.EventBus.publish('editor.lint', this.get('evaluatedModelProperty'), []);
    },
    goToLine(line){
        this.EventBus.publish('editor.line', this.get('evaluatedModelProperty'), line);
    },
    resetSrc() {
        var component = this;
        component.get('models').set(component.get('evaluatedModelProperty'), "");
        component.goToLine(0);
    },
    runCode(src) {
        this.clearConsole();
        this.clearLint();
        this.EventBus.publish('console.show');
        var t0 = Date.now();
        Debugger.run_no_debugger(src);
        this.writeToConsole('\n<completed in ' + ((Date.now() - t0) * 1000.0) + ' ms >\n');

    },
    startDebugger(src) {
        this.clearConsole();
        this.clearLint();
        this.EventBus.publish('console.show');
        Debugger.start_debugger(src, true);
    },
    stopDebugger() {
        Debugger.stop_debugger();
    },
    stepDebugger() {
        if (!Debugger.is_debugging()) {
            this.startDebugger();
        } else {
            Debugger.step_debugger();
        }
    },
    stepBackDebugger() {
        Debugger.step_back_debugger();
    },
    debug_started() {
        this.set('isLastStep', false);
        this.set('isFirstStep', true);
        this.set('isDebugging', Debugger.is_debugging());
        // doc('run').disabled = true;
        // doc('debug').disabled = true;
        // doc('step').disabled = false;
        // doc('stop').disabled = false;
        if (Debugger.is_recorded()) {
            if (Debugger.get_recorded_states().length > 0) {
                this.goToLine(Debugger.get_recorded_states()[0].next_line_no);
            } else {
                Debugger.stop_debugger();
            }
        } else {
            Debugger.step_debugger();
        }
    },
    debug_stoped() {
        this.set('isDebugging', Debugger.is_debugging());
        // doc('debug').disabled = false;
        // doc('run').disabled = false;
        // doc('step').disabled = true;
        // doc('back').disabled = true;
        // doc('stop').disabled = true;
    },
    debug_step(state) {
        this.clearConsole();
        this.writeToConsole(state.stdout + '\n');

        this.goToLine(state.next_line_no);

        this.set('isLastStep', Debugger.is_last_step());
        this.set('canStep', Debugger.can_step());
        this.set('isFirstStep', Debugger.is_first_step());
    },
    debug_error(err, Debugger) {
        // This is a syntax errorr
        if (Debugger.get_recorded_states().length === 0) {
            // doc('console').value = err.data;
            this.writeToConsole(err.data + '\n');
            Debugger.stop_debugger();
        }
        // {
        //         line_no: (line) - 1,
        //         column_no_start: column_no_start || 0,
        //         column_no_stop: column_no_stop || 200,
        //         message: msg,
        //         fragment: fragment || '',
        //         severity: "error"
        //     }
        err.column_no_start = 0;
        err.column_no_stop = 200;
        err.severity = 'error';

        this.EventBus.publish('editor.lint', this.get('evaluatedModelProperty'), [err]);
    },
    testCode(code, testCode) {
        console.log(code, testCode);
    },
    actions: {
        run() {
            this.runCode(this.get('model').get(this.get('evaluatedModelProperty')));
        },
        test() {
            this.testCode(this.get('model').get(this.get('evaluatedModelProperty')), this.get('model.tests'));
        },
        step() {
            this.stepDebugger();
        },
        back() {
            this.stepBackDebugger();
        },
        debug() {
            this.startDebugger(this.get('model').get(this.get('evaluatedModelProperty')));
        },
        stop() {
            this.stopDebugger();
        },
        reset() {
            this.sendAction(this.get('run'));
        },
    },
    didInsertElement() {
        window.brython(1);
        $B.brython_path = window.location.origin + "/brython/www/src/";
        // $B.path = [
        //     window.location.origin + "/brython/www/src"
        // ];
        var component = this;

        var cout = {
            __class__: $io,
            write: function(data) {
                component.writeToConsole(data);
                return _b_.None;
            },
            flush: function() {}
        };
        $B.stdout = $B.modules._sys.stdin = cout;
        $B.stderr = $B.modules._sys.stdin = cout;
        $B.stdin = $B.modules._sys.stdin = {
            __class__: $io,
            __original__:true,
            closed: false,
            len:1, pos:0,
            read: function () {
                return prompt();
            },
            readline: function() {
                return prompt();
            }
        };
        _b_.input = function input(arg) {
            var stdin = ($B.imported.sys && $B.imported.sys.stdin || $B.stdin);
            // $B.stdout.write(arg);
            if (stdin.__original__) { return prompt(arg); }
            var val = _b_.getattr(stdin, 'readline')();
            val = val.split('\n')[0];
            if (stdin.len === stdin.pos){
                _b_.getattr(stdin, 'close')();
            }
            // $B.stdout.write(val+'\n');
            return val;
        };

        window.Brython_Tester.init();

        Debugger.on_debugging_started(component.debug_started.bind(component));
        Debugger.on_debugging_end(component.debug_stoped.bind(component));
        Debugger.on_debugging_error(component.debug_error.bind(component));
        Debugger.on_step_update(component.debug_step.bind(component));

    },
    willClearRender() {

    }
});
