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
    evaluatedModelProperty: 'solution',
    writeToConsole(data, type) {
        this.EventBus.publish('console.write', data + '\n', type);
    },
    clearConsole() {
        this.EventBus.publish('console.clear');
    },
    resetSrc() {
        var component = this;
        component.get('models').set(component.get('evaluatedModelProperty'), "");
        component.EventBus.publish('editor.line', component.get('evaluatedModelProperty'), 0);
    },
    runCode(src) {
        this.clearConsole();
        this.EventBus.publish('console.show');

        var t0 = Date.now();
        var module_name = '__main__';
        $B.$py_module_path[module_name] = window.location.href;
        try {
            var root = $B.py2js(src, module_name, module_name, '__builtins__');
            //earney
            var js = root.to_js();
            if ($B.debug > 1) {
                console.log(js);
            }

            var None = _b_.None;
            var getattr = _b_.getattr;
            var setattr = _b_.setattr;

            if ($B.async_enabled) {
                js = $B.execution_object.source_conversion(js);

                //console.log(js)
                eval(js);
            } else {
                // Run resulting Javascript
                eval(js);
            }
        } catch (exc) {
            $B.leave_frame();
            $B.leave_frame();
            if (exc.$py_error) {
                this.writeToConsole(_b_.getattr(exc, 'info') + '\n' + _b_.getattr(exc, '__name__') + ": " + exc.$message + '\n');
            } else {
                throw exc;
            }
        }

        this.writeToConsole('<completed in ' + ((Date.now() - t0) * 1000.0) + ' ms >');

    },
    actions: {
        run() {
            this.runCode(this.get('model').get(this.get('evaluatedModelProperty')));
        },
        test() {
            this.sendAction(this.get('run'));
        },
        step() {
            this.sendAction(this.get('run'));
        },
        back() {
            this.sendAction(this.get('run'));
        },
        debug() {
            this.sendAction(this.get('run'));
        },
        stop() {
            this.sendAction(this.get('run'));
        },
        reset() {
            this.sendAction(this.get('run'));
        },
    },
    didInsertElement() {
        window.brython(1);
        var component = this;

        var cout = {
            __class__: $io,
            write: function(data) {
                component.writeToConsole(data);
                return _b_.None;
            },
            flush: function() {}
        };
        $B.stdout = cout;
        $B.stderr = cout;

    },
    willClearRender() {

    }
});
