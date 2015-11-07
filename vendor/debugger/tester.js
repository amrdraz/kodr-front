/**
 * This is a tester for the debugger, allows running code multiple times and inspecting it
 * It adds a global Brython_Tester containing all the API functions
 */
(function(win) {

    var $B = window.__BRYTHON__;
    var _b_ = $B.builtins;
    var Debugger = window.Brython_Debugger;
    var _ = window._;

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
        assert: assert,
        expect: expect,
        expect_for: expectFor,
        matches: matches,
        contains: contains,
        exists: exists,
        on_test_error: callbackSetter('testError'),
    };

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

    /**
     * Initialise the Test object's and brython (should it not have ran before)
     * imports the io module inorder to use StringIO to mock input stream
     */
    function init() {
        restTest();
        scope = firstRunCheck();
        $B.$import("io", [], [], scope, true);
        scope.StringIO = _b_.getattr($B.imported.io, "StringIO");
    }

    /**
     * define Module in brython prgramatically
     * used to inject Brython_Tester as a module called Test
     * @param  {[type]} name [description]
     * @param  {[type]} mod  [description]
     */
    function defineModule(name, mod) {
        mod.__class__ = $B.$ModuleDict;
        mod.__name__ = name;
        mod.__repr__ = mod.__str__ = function() {
            return "<module '" + name + "' (external)>";
        };
        $B.imported[name] = $B.modules[name] = mod;
    }

    /**
     * returns teh current test's code
     * @return {String} code test is runniing against
     */
    function getCode() {
        return code;
    }

    /**
     * sets code to run test against
     */
    function setCode(c) {
        code = c;
    }

    /**
     * returns the test report object
     * the report is of the form
     *     {Boolean} passed whether the entier test suite passed or not
     *     {Number} score the acumilated score the user quired from the test
     *     {[Test]} passes an array of the tests that passed
     *     {[Test]} failures an array of the tests that failed
     *     {[Test]} tests an array of all tests
     *     A single test object is of the form
     *         {Booelan} passed whether this test passed or not
     *         {String}  message the message that is to be displayed
     *         {Number}  score   the score awarded for passing this test
     *         {String}  tag     a string labeling this test in case passing it is speccial
     * @return {Object} [description]
     */
    function getReport() {

        var tests = report.tests;
        report.passes = _.filter(tests, 'passed');
        report.failures = _.reject(tests, 'passed');
        report.score = _.reduce(tests, function(sum, t) {
            return sum + t.score;
        }, 0);
        report.passed = report.passes.length === tests.length && report.passes.length>0;

        return report;
    }

    /**
     * restes test back to initial state with empty report and no code set
     */
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
     * unsets the input stream back to the original strin
     */
    function unsetInput() {
        did_set_input = false;
        $B.stdin = $B.modules._sys.stdin = scope.__stdin__;
    }
    /**
     * unsets the input stream back to original stdout and stderr
     */
    function unsetOutput() {
        did_set_output = false;
        $B.stdout = $B.modules._sys.stdout = scope.__stdout__;
        $B.stderr = $B.modules._sys.stderr = scope.__stderr__;
    }

    /**
     * run code that is to be tested
     * @return {Object} history the debugger session of run, an object used to get information about the run
     *                          {String}  stdout  The final output to the console
     *                          {[State]} prints  An array that is composed of every time the print function
     *                                            Has a property String data containing the actal line printed
     *                                            Has a property String stdout containing the overal prints sofar
     *                          {Object}  locals  A dictionarry containing all the variables declared in the scope of the last frame that ran
     *                          {Object}  globals A dictionarry containing all the variables declared globaly in the last frame that ran
     *                          {[State]} states  An array of the state of the program after each line ran
     *                          {Boolean} error   whether an error occured during the run
     *                          {State}   errorState the state containing the error also caontins information about the error see Debugger's doc for properties
     */
    function runCode() {
        if (!did_set_input) {
            setInput("");
        }
        setOutput();
        Debugger.unset_events();
        Debugger.set_no_input_trace(true);
        Debugger.start_debugger(code, true);
        var history = Debugger.get_session();
        Debugger.set_no_input_trace(false);
        Debugger.stop_debugger();
        Debugger.reset_events();
        unsetInput();
        unsetOutput();
        // some processing
        Object.keys(history).forEach(function (key) {
            history[key] = $B.jsobj2pyobj(history[key]);
        });
        return $B.jsobj2pyobj(history);
    }

    /**
     * Run test code that tests the set code
     * should not be used inside the test code
     * @return {Object} report of test run
     */
    function runTest(options) {
        restTest();
        firstRunCheck();
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
        var report = getReport(options);
        if(options.exp!==undefined) {
            report.score = Math.max(0, Math.min(report.score, options.exp));
        }
        return report;
    }

    /**
     * Fire testError hook when an error occurrs while parsing or during runtime
     */
    function errorWhileTesting(err) {
        var info = "";
        try {
            info = _b_.getattr(err, 'info');
        } catch (er) {
            // guess it doesn't work here, sometimes info doesn't exist when you have a syntax error
        }
        var trace = {
            event: 'line',
            type: 'runtime_error',
            data: info + '\n' + _b_.getattr(err, '__name__') + ": " + err.$message + '\n',
            stack: err.$stack,
            message: err.$message,
            name: _b_.getattr(err, '__name__'),
            frame: $B.last(err.$stack),
            err: err,
        };
        trace.line_no = trace.next_line_no = $B.last(err.$stack)[1].$line_info?(+($B.last(err.$stack)[1].$line_info.split(',')[0])):-1;
        trace.column_no_start = 0;
        trace.column_no_stop = 200;
        if (err.args[1] && err.args[1][1] === trace.line_no) {
            trace.fragment = err.args[1][3];
            trace.column_no_start = Math.max(0, err.args[1][2] - 3);
            trace.column_no_stop = err.args[1][2] + 3;
        }
        if (trace.name === "SyntaxError") {
            trace.type = 'syntax_error';
        }
        callbacks['testError'](trace, Test);
    }

    /**
     * appends a single test to the report's test array
     * this is used by all the tests methods
     * @param  {Object} test  The test to append in an incomplete form
     *                        This function will set defaults to the message field and score
     *                        This function will not allow negative score for passed tests nor positive score for failed tests
     * @return {Boolean}      whether the test passed or not
     */
    function appendTestToReport(test) {
        test.message = test.message || DEFAULT_PASS_MESSAGE;
        test.fail_message = test.fail_message || DEFAULT_FAIL_MESSAGE;
        test.score = test.score || DEFAULT_SCORE;
        test.score = Math[test.passed?'max':'min'](test.score, 0);
        test.message = (test.passed)?test.message:test.fail_message;
        
        delete test.test;
        delete test.expect;
        delete test.fail_message;

        report.tests.push(test);
        return test.passed;
    }

    /**
     * add a passing test to the report with message, score and tag
     * @return {Boolean} always true
     */
    function pass() {
        var obj = processPassFailArguments.apply(this, arguments);
        obj.passed = true;
        return appendTestToReport(obj);
    }

    /**
     * add a failing test to the report with message, score and tag
     * @return {Boolean} always false
     */
    function fail() {
        var obj = processPassFailArguments.apply(this, arguments);
        obj.passed = false;
        return appendTestToReport(obj);
    }

    /**
     * add a test to the report with message, score and tag
     * the tests passes based on the boolean expression passed as the first argument
     * @return {Boolean} whether expression was true or not
     */
    function assert() {
        var obj = processAssertArguments.apply(this, arguments);
        obj.passed = obj.test;
        return appendTestToReport(obj);
    }

    /**
     * Add a test to the report with message, failure message, score and tag
     * used for strings
     * The tests passes based on whether the test argument matches to the expected argument which is a regular expression
     * @return {Boolean} whether the test passed or not
     */
    function matches() {
        var obj = processArguments.apply(this, arguments);
        var re = new RegExp(obj.expect);
        obj.passed = re.test(obj.test);
        obj.message = obj.message || obj.test+" matches "+obj.expect;
        obj.fail_message = obj.fail_message || "Expected `"+obj.test+"` to match `" + obj.expect+"`";
        return appendTestToReport(obj);
    }

    /**
     * Add a test to the report with message, failure message, score and tag
     * The tests passes based on whether the test argument contains the expected argument
     * @return {Boolean} whether the test passed or not
     */
    function contains() {
        var obj = processArguments.apply(this, arguments);
        obj.passed = _.includes(obj.test, obj.expect);
        obj.message = obj.message || obj.test+" contains "+obj.expect;
        obj.fail_message = obj.fail_message || "Expected "+obj.test+" to contain " + obj.expect;
        return appendTestToReport(obj);
    }


    /**
     * Add a test to the report with message, failure message, score and tag
     * The tests passes based on whether the test argument is deeply equal to the expected argument
     * @return {Boolean} whether the test passed or not
     */
    function expect() {
        var obj = processArguments.apply(this, arguments);
        obj.passed = _.isEqual(obj.test,obj.expect);
        obj.message = obj.message || obj.test+" equals "+obj.expect;
        obj.fail_message = obj.fail_message || "Expected `"+obj.test+"` to equal `" + obj.expect+"`";
        return appendTestToReport(obj);
    }


    /**
     * Add a test to the report with message, failure message, score and tag
     * The difference from expect is that teh first argument is prepended to the default success and falure message
     * The tests passes based on whether the test argument is deeply equal to the expected argument
     * @return {Boolean} whether the test passed or not
     */
    function expectFor() {
        var premessage = [].shift.call(arguments) || 'inputs';
        var obj = processArguments.apply(this, arguments);
        obj.passed = _.isEqual(obj.test,obj.expect);
        obj.message = obj.message || "Expected For "+premessage+": `"+obj.expect + "` got `" + obj.test+"`";
        obj.fail_message = obj.fail_message || "Expected For "+premessage+": `"+obj.expect + "` got `" + obj.test+"`";
        return appendTestToReport(obj);
    }


    /**
     * Add a test to the report with message, failure message, score and tag
     * The tests passes based on whether the test has the expected argument defined
     * @return {Boolean} whether the test passed or not
     */
    function exists() {
        var obj = processArguments.apply(this, arguments);
        obj.passed = obj.test[obj.expect]!==undefined;
        obj.message = obj.message || obj.expect+" is defined";
        obj.fail_message = obj.fail_message || obj.expect+" does not exist";
        return appendTestToReport(obj);
    }

     /**
     * Process arguments that come into test and return them as object
     * @param (String) message  message to write on success or fail
     * @param (Number) score    score awarded for test
     * @param (String) tag      tag assissiated with test
     */
    function processPassFailArguments () {
        var obj = $B.pyobj2jsobj(arguments[0]);
        if (_.isObject(obj)) {
            return obj;
        }
        obj = {};
        switch(arguments.length){
        case 1:
            if(_.isNumber(arguments[0])) {
                obj.score = arguments[0];
            } else {
                obj.message = obj.fail_message = arguments[0];
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
     * @param (Boolean) test    A boolean expression to pass or fail
     * @param (String) message  message to write on success or fail
     * @param (String) fail_message  message to write on success or fail
     * @param (Number) score    score awarded for test
     * @param (String) tag      tag assissiated with test
     */
    function processAssertArguments () {
        var obj = $B.pyobj2jsobj(arguments[0]);
        if (_.isObject(obj)) {
            return obj;
        }
        obj = {
            test: arguments[0]
        };
        switch(arguments.length){
        case 2:
            if(_.isNumber(arguments[1])) {
                obj.score = arguments[1];
            } else {
                obj.message = obj.fail_message = arguments[1];
            }
            break;
        case 3:
            if(_.isNumber(arguments[1])) {
                obj.score = arguments[1];
                obj.tag = arguments[2];
            } else {
                obj.message = arguments[1];
                if(_.isNumber(arguments[2])) {
                    obj.score = arguments[2];
                } else {
                    obj.fail_message = arguments[2];
                }
            }
            break;
        default:
            obj.message = arguments[1];
            if(_.isNumber(arguments[2])) {
                obj.score = arguments[2];
                obj.tag = arguments[3];
            } else {
                obj.fail_message = arguments[2];
                obj.score = arguments[3];
                if (arguments[4]) { obj.tag = arguments[4];}
            }
        }
        return obj;
    }

    /**
     * Process arguments that are passed into the test/expect functions and return them as object with al properties set
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

    /**
     * when matching strings in the strign ends in a new line is is removed
     * This is for convenience as print statements often end with a new line and are used to evaluating the algorithem's output
     * @param  {Mixed} test could be anythin
     * @return {Mixed}      if it is a string and has a new line at the end it is removed.
     */
    function cutLastNewLine(test) {
        if(_.isString(test) && /\n$/.test(test)) {
            return test.substr(0, test.length-1);
        }
        return test;
    }

    /**
     * utility functions used to in tests suite when we want to test without appending a test
     * this is usefule when testing for optional test cases
     */
    Test.util = $B.jsobj2pyobj({
            /**
             * test a regular expression expect with a string test 
             * @param  {String} expect a regex string
             * @param  {String} test   string to test
             * @param  {String} flags  flags for regex
             * @return {Boolean}        whether the regex matches or not
             */
            matches: function matches (expect, test, flags) {
                var re = new RegExp(expect, flags);
                return re.test(test);
            },
            /**
             * run the Javascript string match function on a string test and return the resulting arrays 
             * Usefule for counting the number of occurance of a pattern using the g flag
             * and checking if something exists in the code in first place
             * @param  {String} test   string to match
             * @param  {String} expect a regex as string
             * @param  {String} flags  flags for regex
             * @return {Boolean}       whether the regex matches or not
             */
            match: function match (test, expect, flags) {
                var re = new RegExp(expect, flags);
                return test.match(re);
            },
            /**
             * check if a propertu exists in an object
             * @param  {object} test   an object
             * @param  {String} expect key to check for
             * @return {Boolean}        whether the property is defined or not
             */
            exists: function exists (test, expect) {
                return test[expect]!==undefined;
            },
            /**
             * uses lodash's include function on test with prameter expect
             */
            includes: function includes (test, expect) {
                return _.includes(test, expect);
            },
            /**
             * check if test is equal to exp
             * test if a string will be striped from it's last newline character
             * @param  {object} test   an object
             * @param  {String} exp    another object
             * @return {Boolean}       whether the property is defined or not
             */
            expect: function expect (test, exp) {
                test = cutLastNewLine($B.pyobj2jsobj(test));
                exp = $B.pyobj2jsobj(exp);
                return _.isEqual(cutLastNewLine(test),  exp);
            }
    });

    defineModule("Test", Test);

    /**
     * Initialize the first frame the first time Brython runs
     */
    function firstRunCheck() {
        if ($B.frames_stack < 1) {
            var module_name = '__main__';
            $B.$py_module_path[module_name] = window.location.href;
            var root = $B.py2js("", module_name, module_name, '__builtins__');
            var js = root.to_js();
            eval(js);
        }
        var frame = $B.frames_stack[0];
        return frame.length>2?frame[3]:frame[1];
    }
})(window);
