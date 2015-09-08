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
        pass: pass,
        fail: fail,
        expect: expect,
        matches: matches,
        contains: contains,
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
        Debugger.step_to_last_step();
        var state = Debugger.get_current_state();
        Debugger.stop_debugger();
        Debugger.reset_events();
        unsetInput();
        unsetOutput();
        // some processing
        return state;
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
        report.passes = _.filter(tests, 'pass');
        report.failures = _.reject(tests, 'pass');
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
        var trace = {
            type: 'runtime_error',
            data: _b_.getattr(err, 'info') + '\n' + _b_.getattr(err, '__name__') + ": " + err.$message + '\n',
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

    function appendTestToReport(pass, msg, point, tag) {
        var rep = {
            "pass": pass,
            "message": msg,
            "score": point || DEFAULT_SCORE,
            tag: tag
        };
        report.tests.push(rep);
    }

    function isObject(obj) {
        return obj && obj instanceof Object && !(obj instanceof Array);
    }

    function pass(msg, point, tag) {
        if (isObject(msg)) {
            point = msg.point || 0;
            tag = msg.tag;
            msg = msg.msg;
        }
        if (point < 0) { // you can not award negative points for pass
            point = 0;
        }
        appendTestToReport(true, msg || DEFAULT_PASS_MESSAGE, point, tag);
        return true;
    }

    function fail(msg, point, tag) {
        if (isObject(msg)) {
            point = msg.point || 0;
            tag = msg.tag;
            msg = msg.msg;
        }
        if (point < 0) { // you can not award negative points for pass
            point = 0;
        }
        appendTestToReport(false, msg || DEFAULT_FAIL_MESSAGE, point, tag);
        return false;
    }

    /**
     * Tests using regular expresion whether a given String matches another string
     * @param test     String test
     * @param expected String regexp
     * @param msg      String msg to write on success
     * @param failmsg  String msg to write on failure
     * @param s        int    score awarded for test
     * @param tag      String tag assissiated with test
     */
    function matches(test, expected, msg, failmsg, score, tag) {
        if (isObject(test)) {
            expected = test.expected;
            msg = test.msg;
            failmsg = test.failmsg;
            score = test.score;
            tag = test.tag;
            test = test.test;
        }
        var re = new RegExp(expected);
        if (re.test(test)) {
            return Test.pass(msg, score, tag);
        } else {
            msg = failmsg || "Expected " + test + " to match " + expected + "";
            return Test.fail(msg, score, tag);
        }
    }

    /**
     * Tests whether a given String contains another string using matches
     * @param user     String user string to test
     * @param expected String substring in the given user string
     * @param msg      String msg to write on success
     * @param failmsg  String msg to write on failure
     * @param s        int    score awarded for test
     * @param tag      String tag assissiated with test
     */
    function contains(user, expected, msg, failmsg, score, tag) {
        return Test.matches(user, "[\\s\\S]*" + expected + "[\\s\\S]*", msg, failmsg, score, tag);
    }

    /**
     * Tests whether a given Object matches another using equals method
     * @param test     Object to equate
     * @param expected expected result
     * @param msg      msg to write on success
     * @param failmsg  msg to write on failure
     * @param s        score awarded for test
     * @param tag      tag assissiated with test
     */
    function expect(test, expected, msg, failmsg, score, tag) {
        if (isObject(test)) {
            expected = test.expected;
            msg = test.msg;
            failmsg = test.failmsg;
            score = test.score;
            tag = test.tag;
            test = test.test;
        }
        if (test === expected) {
            return Test.pass(msg, score, tag);
        } else {
            return Test.fail(failmsg || "Expected " + test + " to equal " + expected + "", score, tag);
        }
    }

    defineModule("Test", Test);
})(window);
