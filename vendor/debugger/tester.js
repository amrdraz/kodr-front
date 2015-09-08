/**
 * This is a tester for the debugger, allows running code multiple times and inspecting it
 * It adds a global Brython_Tester containing all the API functions
 */
(function(win) {
    var Test = win.Brython_Tester = {
        init: init,
        get_code: getCode,
        set_code:setCode,
        set_input: setInput,
        unset_input:unsetInput,
        get_report:getReport,
        run_code:runCode,
        report:appendToReport,
        pass:pass,
        fail:fail,
        expect:expect,
        matches:matches,
        contains:contains,
    };

    var $B = window.__BRYTHON__;
    var _b_ = $B.builtins;
    var Debugger = window.Brython_Debugger;
    var $io = {
        __class__: $B.$type,
        __name__: 'io'
    };
    $io.__mro__ = [$io, _b_.object.$dict];

    var DEFAULT_PASS_MESSAGE = "Passed Test";
    var DEFAULT_FAIL_MESSAGE = "Failed Test";
    var DEFAULT_SCORE = 0;

    var did_set_input = false;
    var code, scope;
    var report = {};

    function init () {
        restTest();
        scope = {
            __name__:"__main__"
        };
        $B.$__import__("io",scope, {}, []);
        scope.StringIO = _b_.getattr($B.imported.io,"StringIO");
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
        report = [];
        code = "";
    }

    /**
     * Sets the input stream that will be read should input be called during run
     * @param {String} stdin [description]
     */
    function setInput(stdin) {
        did_set_input = true;
        scope.stdin = _b_.getattr(scope.StringIO,"__call__")(stdin);
        scope.__stdin__ = $B.stdin;
        $B.stdin = $B.modules._sys.stdin = scope.stdin;
    }

    /**
     * unsets the input stream back to normal
     */
    function unsetInput() {
        did_set_input = false;
        $B.stdin = $B.modules._sys.stdin = scope.__stdin__;
    }

    function runCode(code) {
        Test.set_code(code);
        if(!did_set_input) {
            setInput("");
        }
        Debugger.set_no_input_trace(true);
        Debugger.start_debugger(code);
        Debugger.step_to_last_step();
        var state = Debugger.get_current_state;
        unsetInput();
        // some processing
        return state;
    }

    function appendToReport(pass, msg, point, tag) {
        var rep = {
            "pass": pass ,
            "message": msg ,
            "score": point || DEFAULT_SCORE,
            tag: tag
        };
        report.push(rep);
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
        appendToReport(true, msg || DEFAULT_PASS_MESSAGE, point, tag);
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
        appendToReport(false, msg || DEFAULT_FAIL_MESSAGE, point, tag);
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
        if(isObject(test)) {
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
        if(isObject(test)) {
            expected = test.expected;
            msg = test.msg;
            failmsg = test.failmsg;
            score = test.score;
            tag = test.tag;
            test = test.test;
        }
        if (test===expected) {
            return Test.pass(msg, score, tag);
        } else {
            return Test.fail(failmsg || "Expected " + test + " to equal " + expected + "", score, tag);
        }
    }

    defineModule("Test", Test);
})(window);
