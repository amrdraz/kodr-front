import Ember from 'ember';
import ChallengeCommon from 'kodr/mixins/challenge/python/challenge-common-python';
var _ = window._;
export default Ember.Component.extend(ChallengeCommon, {
    evaluatedModelProperty: 'solution',
    evaluatedModelObject: 'work',
    testEvent() {
        return this.testCode({
            code: this.get('model.work').get('solution'),
            test: this.get('model.challenge.blueprint.tests'),
            exp: this.get('model.challenge.exp')
        });
    },
    test_error() {
        this.writeToConsole("You have found a failure case that was not acounted for leading to an error in the Tests" + '\n', 'error');
    },
    runEvent(target, code) {
        this.runCode(code);
    },

    actions: {
        run() {
                this.setTrialStateToRun({
                    event: 'trial.solution.run'
                });
                var hist = this._super();
                var model = this.get('model');
                this.runCount += 1;
                hist.runCount = this.runCount;
                hist.printCount = hist.prints.length;
                if (hist.error) {
                    hist.totalErrorCount = this.errorCount = this.errorCount + 1;
                    hist.errorState = _.pick(hist.errorState, ['name', 'line_no', 'type', 'message', 'step', 'module_name']);
                }
                hist = _.omit(hist, ['globals', 'locals', 'prints', 'stdout', 'states']);
                this.setTrialStateToRun({
                    resolveNow: true,
                    meta: hist
                });
                model.get('work').set('errorCount', this.errorCount);
                model.get('work').set('runCount', this.runCount);
                model.save();
            },
            test() {
                var component = this;
                this.setTrialStateToTest({
                    event: 'trial.solution.test'
                });
                var report = this.testEvent();
                var model = this.get('model');
                this.testRunCount += 1;
                report.testRunCount = this.testRunCount;
                report.passesCount = report.passes.length;
                report.failuresCount = report.failures.length;
                report.testsCount = report.tests.length;
                report = _.omit(report, ['passes', 'failures', 'tests']);
                this.setTrialStateToTest({
                    resolveNow: true,
                    meta: report
                });

                model.set('complete', report.passed);
                model.get('work').setProperties(report);
                model.save().then(function () {
                    component.sendAction('test', report);
                });
            },
            debug() {
                this.setTrialStateToDebug({
                    event: 'trial.solution.debug'
                });
                this._super();
                var model = this.get('model');
                this.debugCount += 1;


                model.get('work').set('debugCount', this.debugCount);
                model.save();
            }
    },

    trialState: null,
    trialStateEvent: null,
    stateTimer: null,
    activeIntreface: 'description',
    defaultIdleWaitTime: 10000,
    errorCount: 0,
    runCount: 0,
    testRunCount: 0,
    debugCount: 0,
    getTrialState() {
        return {
            name: this.trialState,
            activeIntreface: this.activeIntreface
        };
    },
    updateTrialStateEvent(event) {
        switch (this.get('trialState')) {
            default: this.trialStateEvent = _.merge(this.trialStateEvent, event);
        }
    },
    /**
     * Change the previous trialState forcing a trial.event push to server
     * By default a state will start a timer and end when a state switch happens
     * if te same state event is called twice it does not submit but updates the state Event value
     * By default Idle state will be set after idleWaitTime
     * @param {String} trialState one of (typing, idle, run, debug, test, example, lookup)
     * @param {Object} event overloading event information only data in the meta attribute will be saved
     *                       the rest is used for configuring option such as
     *                       idle: Boolean, when true immidiatly switch to idle)
     *                       resolveNow: Booelan, when true immidiatly save event instead of waiting till the next one
     *                       resetWaitForIdleTime: Boolean, wait for idle time is the time refrence for
     *                           how long it is till idle, by default startedWaitingForIdleTime is the same as
     *                           the stateStartTime but it can be reset using this flag
     */
    setTrialState(trialState, event) {
        event = event || {};
        var previousTrialState = this.trialState;
        if (previousTrialState !== trialState) {
            this.changingTrialState = true;
            if (previousTrialState !== null) {
                this.resolveTrialState();
            }
            this.stateStartTime = this.startedWaitingForIdleTime = _.now();
            this.trialState = trialState;
            event = this.trialStateEventDefaults(event);
            this.trialStateEvent = event;
            if(event.activeInterface) {
                this.set('activeIntreface', event.activeInterface);
            }
            this.changingTrialState = false;
            if (trialState !== 'idle') {
                this.setTrialStateToIdle(event.idle);
            }
        } else {
            this.updateTrialStateEvent(event);
            if(event.resolveNow) {
                this.resolveTrialState();
            }
        }
        if(event.resetWaitForIdleTime) {
            this.startedWaitingForIdleTime = _.now();
        }
    },
    resolveTrialState(){
        this.stateEndTime =  _.now();
        this.updateTrialStateEvent({
            meta: {
                trialState: this.getTrialState(),
                startTime: this.stateStartTime,
                endTime: this.stateEndTime,
            }
        });
        this.handleTrialEvent(this.trialStateEvent);
        this.trialState = null;
        this.trialStateEvent = null;
        this.stateTimer = null;
    },
    setTrialStateToIdle(now) {
        var isIdleTime = (_.now() - this.startedWaitingForIdleTime) > this.idleWaitTime;
        if (now === true || (isIdleTime && !this.changingTrialState)) {
            this.setIdleWaitTime(this.defaultIdleWaitTime);
            this.setTrialState('idle');
            return window.cancelAnimationFrame(this.stateTimer);
        }
        this.stateTimer = window.requestAnimationFrame(this.setTrialStateToIdle.bind(this));
    },
    setIdleWaitTime(time){
        this.idleWaitTime = time;
    },
    setTrialStateToTyping() {
        this.setTrialState('typing', {
            resetWaitForIdleTime:true,
            meta: {
                solution: this.get('model.work.solution')
            }
        });
    },
    setTrialStateToExample(meta) {
        this.setTrialState('example', meta);
    },
    setTrialStateToRun(meta) {
        this.setTrialState('run', meta);
    },
    setTrialStateToTest(meta) {
        this.setTrialState('test', meta);
    },
    setTrialStateToDebug(meta) {
        this.setTrialState('debug', meta);
    },
    setTrialStateToLookup(meta) {
        this.setTrialState('lookup', meta);
    },
    handleTrialEvent(event) {
        event = _.merge(event, {
            user: this.get('model.user.id'),
            trial: this.get('model.id'),
        });
        console.log(event);
        this.container.lookup('socket:main').emit('trial.event', event);
    },
    updateActiveInterface(inter) {
        if (this.get('activeIntreface') !== inter) {
            this.setTrialState('focus', {
                event: 'tiral.tab.change',
                action:'click',
                verb:'clicked',
                resolveNow: true,
                activeInterface: inter,
            });
        }
    },
    startTrial: function() {
        var component = this;
        var model = this.get('model');
        this.setIdleWaitTime(this.defaultIdleWaitTime);
        if (!model.get('started')) {
            model.set('started', true);
            model.set('startTime', _.now());
            model.save(function(model) {
                component.setTrialState('start', {
                    event: 'trial.session.start',
                    action:'start',
                    meta: {
                        first: true,
                        startTime: model.startTime
                    }
                });
            });
        } else {
            this.setTrialState('start', {
                event: 'trial.session.start',
                action:'start',
                meta: {
                    first: false
                }
            });
        }
    }.on("didInsertElement"),
    watchEvents: function() {
        var model = this.get('model');
        model.addObserver('work.solution', this, this.setTrialStateToTyping);
        this.EventBus.subscribe('trial.event', this, this.handleTrialEvent);
        this.EventBus.subscribe('trial.event.example.run', this, this.setTrialStateToExample);
        this.EventBus.subscribe('trial.event.solution.run', this, this.setTrialStateToRun);
        this.EventBus.subscribe('trial.event.solution.reset', this, this.setTrialStateToRun);
        this.EventBus.subscribe('trial.event.solution.test', this, this.setTrialStateToTest);
        this.EventBus.subscribe('trial.event.solution.debug', this, this.setTrialStateToDebug);
        this.EventBus.subscribe('trial.event.lookup', this, this.setTrialStateToLookup);
        this.EventBus.subscribe('trial.event.tab.select', this, this.updateActiveInterface);
    }.on("didInsertElement"),
    unWatchEvents: function() {
        var model = this.get('model');
        model.removeObserver('work.solution', this, this.setTrialStateToTyping);
        this.EventBus.unsubscribe('trial.event', this, this.handleTrialEvent);
        this.EventBus.unsubscribe('trial.event.example.run', this, this.setTrialStateToExample);
        this.EventBus.unsubscribe('trial.event.solution.run', this, this.setTrialStateToRun);
        this.EventBus.unsubscribe('trial.event.solution.reset', this, this.setTrialStateToRun);
        this.EventBus.unsubscribe('trial.event.solution.test', this, this.setTrialStateToTest);
        this.EventBus.unsubscribe('trial.event.solution.debug', this, this.setTrialStateToDebug);
        this.EventBus.unsubscribe('trial.event.lookup', this, this.setTrialStateToLookup);
        this.EventBus.unsubscribe('trial.event.tab.select', this, this.updateActiveInterface);
        this.setTrialState('end', {
            event: 'trial.session.end',
            resolveNow: true,
            meta: {
                isComplete: model.get('complete')
            }
        });
        clearTimeout(this.stateTimer);
    }.on("willClearRender"),
    trialStateEventDefaults(event) {
        switch (this.trialState) {
            case 'typing':
                event = _.merge({
                    event: 'trial.solution.change',
                    action: 'type',
                    verb: 'typed',
                }, event);
                break;
            case 'idle':
                event = _.merge({
                    event: 'trial.idle',
                    action: 'idle',
                    verb: 'idled',
                }, event);
                break;
            case 'example':
                event = _.merge({
                    event: 'trial.example.run',
                    action: 'run',
                    verb: 'ran',
                }, event);
                break;
            case 'run':
                event = _.merge({
                    event: 'trial.solution.run',
                    action: 'run',
                    ver: 'ran',
                }, event);
                break;
            case 'debug':
                event = _.merge({
                    event: 'trial.solution.debug',
                    action: 'debug',
                    ver: 'debuged',
                }, event);
                break;
            case 'test':
                event = _.merge({
                    event: 'trial.solution.test',
                    action: 'debug',
                    ver: 'debuged',
                }, event);
                break;
            case 'lookup':
                event = _.merge({
                    event: 'trial.lookup',
                    action: 'lookup',
                    ver: 'lookedup',
                }, event);
                break;
            default:
                event = _.merge({
                    event: 'trial.log',
                    action: 'log',
                    verb: 'logged',
                }, event);
        }
        return event;
    }
});
