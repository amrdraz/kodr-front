/**
 * This is a tester for the debugger, allows running code multiple times and inspecting it
 * It adds a global Brython_Tester containing all the API functions
 */
(function(win) {
    var Test = win.Brython_Tester = {
        init: init,
        get_code: getCode,
        set_code: setCode,
        set_input: setInput,
        unset_input: unsetInput,
        get_report: getReport,
        run_code: runCode,
        run_test: runTest,
        add_test: appendTestToReport,
        ok: pass,
        fail: fail,
        expect: expect,
        expect_for: expectFor,
        matches: matches,
        contains: contains,
        exists: exists,
        on_test_error: callbackSetter('testError'),
    };

    var $B = window.__BRYTHON__;
    var _b_ = $B.builtins;
    var Debugger = window.Brython_Debugger;
    var _ = window._;

    var noop = function() {};
    var events = ['testError'];
    var callbacks = {};
    events.forEach(function(key) {
        callbacks[key] = noop;
    });

    function callbackSetter(key) {
        return function(cb) {
            callbacks[key] = cb;
        };
    }

    var DEFAULT_PASS_MESSAGE = "Passed Test";
    var DEFAULT_FAIL_MESSAGE = "Failed Test";
    var DEFAULT_SCORE = 0;

    var did_set_input = false;
    var did_set_output = false;
    var code, scope;
    var report = {
        passed: false,
        score: 0,
        passes: [],
        failures: [],
        tests: []
    };

    function init() {
        restTest();
        scope = {
            __name__: "__main__"
        };
        $B.$__import__("io", scope, {}, []);
        scope.StringIO = _b_.getattr($B.imported.io, "StringIO");
    }

    function defineModule(name, mod) {
        mod.__class__ = $B.$ModuleDict;
        mod.__name__ = name;
        mod.__repr__ = mod.__str__ = function() {
            return "<module '" + name + "' (external)>";
        };
        $B.imported[name] = $B.modules[name] = mod;
    }

    function getCode() {
        return code;
    }

    function setCode(c) {
        code = c;
    }

    function getReport() {
        return report;
    }

    function restTest() {
        report = report = {
            passed: false,
            score: 0,
            passes: [],
            failures: [],
            tests: []
        };
        code = "";
    }

    /**
     * Sets the input stream that will be read should input be called during run
     * @param {String} stdin [description]
     */
    function setInput(stdin) {
        did_set_input = true;
        stdin = $B.pyobj2jsobj(stdin);
        if(_.isArray(stdin)) {
            stdin = stdin.join("\n");
        }
        scope.stdin = _b_.getattr(scope.StringIO, "__call__")(stdin);
        scope.__stdin__ = $B.stdin;
        $B.stdin = $B.modules._sys.stdin = scope.stdin;
    }
    /**
     * Sets output stream during test in order to supress the regular output
     */
    function setOutput() {
        did_set_output = true;
        scope.stdout = _b_.getattr(scope.StringIO, "__call__")("");
        scope.stderr = _b_.getattr(scope.StringIO, "__call__")("");
        scope.__stdout__ = $B.stdout;
        scope.__stderr__ = $B.stderr;
        $B.stdout = $B.modules._sys.stdout = scope.stdout;
        $B.stderr = $B.modules._sys.stderr = scope.stderr;
    }

    /**
     * unsets the input stream back to normal
     */
    function unsetInput() {
        did_set_input = false;
        $B.stdin = $B.modules._sys.stdin = scope.__stdin__;
    }
    /**
     * unsets the input stream back to normal
     */
    function unsetOutput() {
        did_set_output = false;
        $B.stdout = $B.modules._sys.stdout = scope.__stdout__;
        $B.stderr = $B.modules._sys.stderr = scope.__stderr__;
    }

    function runCode() {
        if (!did_set_input) {
            setInput("");
        }
        setOutput();
        Debugger.unset_events();
        Debugger.set_no_input_trace(true);
        Debugger.start_debugger(code, true);
        var history = Debugger.get_session();
        Debugger.stop_debugger();
        Debugger.reset_events();
        unsetInput();
        unsetOutput();
        // some processing
        return history;
    }

    /**
     * Run test code that tests the set code
     * should not be used inside the test code
     * @return {Array} report of test run
     */
    function runTest(options) {
        restTest();
        setCode(options.code);
        var test = "import Test;" + options.test;
        var module_name = '__main__';
        $B.$py_module_path[module_name] = window.location.href;
        try {
            var root = $B.py2js(test, module_name, module_name, '__builtins__');

            var js = root.to_js();
            if ($B.debug > 1) {
                console.log(js);
            }

            var None = _b_.None;
            var getattr = _b_.getattr;
            var setattr = _b_.setattr;
            var delattr = _b_.delattr;

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
                errorWhileTesting(exc);
            } else {
                throw exc;
            }
        }

        var tests = report.tests;
        report.passes = _.filter(tests, 'passed');
        report.failures = _.reject(tests, 'passed');
        report.score = _.reduce(tests, function(sum, t) {
            return sum + t.score;
        }, 0);
        report.score = Math.max(0, Math.min(report.score, options.exp));
        report.passed = report.passes.length === tests.length;

        return report;
    }

    /**
     * Fire when an error occurrs while parsing or during runtime
     */
    function errorWhileTesting(err) {
        var info = "";
        try {
            info = _b_.getattr(err, 'info');
        } catch (er) {
            // guess it doesn't work here
        }
        var trace = {
            type: 'runtime_error',
            data: info + '\n' + _b_.getattr(err, '__name__') + ": " + err.$message + '\n',
            stack: err.$stack,
            message: err.$message,
            name: _b_.getattr(err, '__name__'),
            frame: $B.last(err.$stack),
            err: err,
            line_no: +($B.last(err.$stack)[1].$line_info.split(',')[0]),
            module_name: +($B.last(err.$stack)[1].$line_info.split(',')[1])
        };
        if (trace.name === "SyntaxError") {
            trace.type = 'syntax_error';
        }
        callbacks['testError'](trace, Test);
    }

    function appendTestToReport(test) {
        test.message = test.message || DEFAULT_PASS_MESSAGE;
        test.fail_message = test.fail_message || DEFAULT_FAIL_MESSAGE;
        test.score = test.score || DEFAULT_SCORE;
        test.message = (test.passed)?test.message:test.fail_message;
        report.tests.push(test);
        return test.passed;
    }

    function pass() {
        var obj = processPassFailArguments.apply(this, arguments);
        obj.passed = true;
        obj.score = obj.score?Math.max(obj.score, 0):DEFAULT_SCORE;
        return appendTestToReport(obj);
    }

    function fail() {
        var obj = processPassFailArguments.apply(this, arguments);
        obj.passed = false;
        obj.score = obj.score?Math.min(obj.score, 0):DEFAULT_SCORE;
        return appendTestToReport(obj);
    }

    function matches() {
        var obj = processArguments.apply(this, arguments);
        var re = new RegExp(obj.expect);
        obj.passed = re.test(obj.test);
        obj.message = obj.message || obj.test+" matches "+obj.expect;
        obj.fail_message = obj.fail_message || "Expected "+obj.test+" to match " + obj.expect;
        return appendTestToReport(obj);
    }

    function contains() {
        var obj = processArguments.apply(this, arguments);
        obj.passed = _.includes(obj.test, obj.expect);
        obj.message = obj.message || obj.test+" contains "+obj.expect;
        obj.fail_message = obj.fail_message || "Expected "+obj.test+" to contain " + obj.expect;
        return _.includes(obj.test, obj.expect);
    }

    function expect() {
        var obj = processArguments.apply(this, arguments);
        obj.passed = _.isEqual(obj.test,obj.expect);
        obj.message = obj.message || obj.test+" equals "+obj.expect;
        obj.fail_message = obj.fail_message || "Expected "+obj.test+" to equal " + obj.expect;
        return appendTestToReport(obj);
    }

    function expectFor() {
        var premessage = [].shift.call(arguments) || 'inputs';
        var obj = processArguments.apply(this, arguments);
        obj.passed = _.isEqual(obj.test,obj.expect);
        obj.message = obj.message || "Expected For "+premessage+": "+obj.expect + " got " + obj.test;
        obj.fail_message = obj.fail_message || "Expected For "+premessage+": "+obj.expect + " got " + obj.test;
        return appendTestToReport(obj);
    }

    function exists() {
        var obj = processArguments.apply(this, arguments);
        obj.passed = (true && obj.test[obj.expect]);
        obj.message = obj.message || obj.expect+" is defined";
        obj.fail_message = obj.fail_message || obj.expect+" does not exist";
        return appendTestToReport(obj);
    }

     /**
     * Process argumetns that come into test and return them as object
     * @param (String) message  message to write on success or fail
     * @param (Number) score    score awarded for test
     * @param (String) tag      tag assissiated with test
     */
    function processPassFailArguments () {
        if (_.isObject(arguments[0])) {
            return arguments[0];
        }
        var obj = {};
        switch(arguments.length){
        case 1:
            if(_.isNumber(arguments[0])) {
                obj.score = arguments[0];
            }
            break;
        case 2:
            if(_.isNumber(arguments[0])) {
                obj.score = arguments[0];
                obj.tag = arguments[1];
            } else {
                obj.message = obj.fail_message = arguments[0];
                obj.score = arguments[1];
            }
            break;
        default:
            obj.message = obj.fail_message = arguments[0];
            obj.score = arguments[1];
            obj.tag = arguments[2];
        }
        return obj;
    }

    /**
     * Process argumetns that come into test and return them as object
     * @param test          String test value
     * @param expect      String excpected value of test value
     * @param message       String message to write on success
     * @param fail_message  String message to write on failure
     * @param score         Number score awarded for test
     * @param tag           String tag assissiated with test
     */
    function processArguments () {
        var test, expect, message, fail_message, score, tag;
        if (arguments.length===1) {
            var obj = arguments[0];
            obj = $B.pyobj2jsobj(obj);
            obj.test = cutLastNewLine(obj.test);
            return obj;
        }
        test = $B.pyobj2jsobj(arguments[0]);
        test = cutLastNewLine(test);
        expect = $B.pyobj2jsobj(arguments[1]);
        switch(arguments.length) {
        case 3:
            if(_.isNumber(arguments[2])) {
                score = arguments[2];
            } else {
                message = arguments[2];
            }
            break;
        case 4:
            if(_.isNumber(arguments[2])) {
                score = arguments[2];
                tag = arguments[3];
            } else {
                message = arguments[2];
                if (_.isNumber(arguments[3])) {
                    score = arguments[3];
                } else {
                    fail_message = arguments[3];
                }
            }
            break;
        default:
            message = arguments[2];
            if (_.isNumber(arguments[3])) {
                score = arguments[3];
                tag = arguments[4];
            } else {
                fail_message = arguments[3];
                score = arguments[4];
                tag = arguments[5];
            }
        }
        return {
            test:test,
            expect:expect,
            message:message,
            fail_message:fail_message,
            score:score,
            tag:tag
        };
    }

    function cutLastNewLine(test) {
        if(_.isString(test) && /\n$/.test(test)) {
            return test.substr(0, test.length-1);
        }
        return test;
    }

    defineModule("Test", Test);
})(window);
