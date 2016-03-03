import Ember from 'ember';
import ChallengeCommon from 'kodr/mixins/challenge/python/challenge-common-python';
import randomChallenge from 'kodr/controllers/random-challenge'
var _ = window._;
export default Ember.Component.extend(ChallengeCommon, {
    evaluatedModelProperty: 'solution',
    evaluatedModelObject: 'work',
    resetSrc() {
        var component = this;
        var model =component.get('model');
        if (this.get('session.user.flags') && this.get('session.user.flags.no_setup')) {
            model.set('work.solution', '');
        } else {
            model.set('work.solution', model.get('challenge.blueprint.setup'));
        }
        component.goToLine(0);
    },
    testEvent() {
        var test = this.testCode({
            code: this.get('model.work').get('solution'),
            test: this.get('model.challenge.blueprint.tests'),
            exp: this.get('model.challenge.exp')
        });
        return test
    },
    test_error() {
        this.writeToConsole("You have found a failure case that was not acounted for leading to an error in the Tests" + '\n', 'error');
    },
    runEvent(target, code) {
        this.runCode(code);
    },

    actions: {
        next() {
            var nextButton = Ember.$('#next').click();
            console.log('BTN', nextButton);
        },
        run() {
                this.setTrialStateToRun({
                    event: 'trial.solution.run'
                });
                var hist = this._super();
                var model = this.get('model');
                this.incrementSessionCountFor('run');
                hist.runCount = this.getSessionCountFor('run');
                hist.printCount = hist.prints.length;
                if (hist.error) {
                    hist.totalErrorCount = this.incrementSessionCountFor('error');
                    hist.errorState = _.pick(hist.errorState, ['name', 'line_no', 'type', 'message', 'step', 'module_name']);
                }
                hist = _.omit(hist, ['globals', 'locals', 'prints', 'stdout', 'states']);
                this.setTrialStateToRun({
                    resolveNow: true,
                    meta: hist
                });
                model.get('work').set('errorCount', this.getSessionCountFor('error'));
                model.get('work').set('runCount', this.getSessionCountFor('run'));
                model.save();
            },
            test() {
                var component = this;
                this.setTrialStateToTest({
                    event: 'trial.solution.test'
                });
                var report = this.testEvent();
                var model = this.get('model');
                report.testRunCount = this.incrementSessionCountFor('test');
                report.passesCount = report.passes.length;
                report.failuresCount = report.failures.length;
                report.testsCount = report.tests.length;
                report = _.omit(report, ['passes', 'failures']);
                this.setTrialStateToTest({
                    resolveNow: true,
                    meta: report
                });

                if(report.passed && !model.get('complete')) {
                    model.set('endTime', _.now());
                    model.set('complete', report.passed);
                }
                model.get('work').setProperties(report);
                model.save().then(function () {
                    component.sendAction('test', report);
                });

            },
            debug() {
                this.incrementSessionCountFor('debug');
                this.setTrialStateToDebug({
                    event: 'trial.solution.debug',
                    meta: {
                        debugCount: this.getSessionCountFor('debug')
                    }
                });
                this._super();
                var model = this.get('model');
                model.get('work').set('debugCount', this.getSessionCountFor('debug'));
                model.save();
            },
            step() {
                this._super();
                this.setTrialStateToDebug({
                    resetWaitForIdleTime:true,
                });
            },
            back() {
                this._super();
                this.setTrialStateToDebug({
                    resetWaitForIdleTime:true,
                });
            },
            stop() {
                this._super();
                this.setTrialStateToDebug({
                    resolveNow:true,
                });
            },
            reset() {
                this._super();
                this.setTrialState('log', {
                    resetWaitForIdleTime:true,
                    activeInterface:'solution',
                    meta: {
                        event: 'trial.solution.rest',
                        action: 'rest',
                        verb: 'reseted',
                        resolveNow: true,
                    }
                });
            },
    },

    trialState: null,
    trialStateEvent: null,
    idleStateTimer: null,
    activeIntreface: 'description',
    defaultIdleWaitTime: 10000,
    sessionTime:{},
    sessionCount:{},
    sessionStartTime: null,
    sessionEndTime: null,
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
            if (trialState !== 'idle' && trialState!=='end') {
                this.setTrialStateToIdle(event.idle);
            }
        } else {
            this.updateTrialStateEvent(event);
        }
        if(event.resolveNow) {
            this.resolveTrialState();
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
        this.setTrialStateSpentTime();
        this.handleTrialEvent(this.trialStateEvent);
        this.trialState = null;
        this.trialStateEvent = null;
        this.idleStateTimer = null;
    },
    setTrialStateToIdle(now) {
        var isIdleTime = (_.now() - this.startedWaitingForIdleTime) > this.idleWaitTime;
        if (now === true || (isIdleTime && !this.changingTrialState)) {
            this.setIdleWaitTime(this.defaultIdleWaitTime);
            this.setTrialState('idle');
            return window.cancelAnimationFrame(this.idleStateTimer);
        }
        this.idleStateTimer = window.requestAnimationFrame(this.setTrialStateToIdle.bind(this));
    },
    setIdleWaitTime(time){
        this.idleWaitTime = time;
    },
    setTrialStateToTyping() {
        if(this.get('model.work.solution')===""){
            return this.setTrialState('typing', {
                resetWaitForIdleTime:true,
                activeInterface:'solution',
                meta: {
                    event: 'trial.solution.clear',
                    action: 'type',
                    verb: 'typed',
                    resolveNow: true,
                    solution: this.get('model.work.solution')
                }
            });
        }
        this.setTrialState('typing', {
            resetWaitForIdleTime:true,
            activeInterface:'solution',
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
        this.container.lookup('socket:main').emit('trial.event', event);
    },
    updateActiveInterface(inter) {
        var that = this;
        if (that.get('activeIntreface') !== inter) {
            that.setTrialState('tab.click', {
                event: 'trial.tab.change',
                action:'click',
                verb:'clicked',
                resolveNow: true,
                activeInterface: inter,
            });
        }
    },
    setActiveInterface(inter, action) {
        this.setTrialState('focus.'+inter, {
            event: 'trial.interface.focus',
            action:action,
            resetWaitForIdleTime:true,
            activeInterface: inter,
        });
    },
    startTrial: function() {
        var component = this;
        var model = this.get('model');
        this.setIdleWaitTime(this.defaultIdleWaitTime);
        this.sessionStartTime = _.now();
        this.sessionTime = {};
        this.sessionCount = {};
        if (!model.get('started')) {
            model.set('started', true);
            model.set('startTime', this.sessionStartTime);
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
                    startTime: this.sessionStartTime,
                    first: false
                }
            });
        }
    }.on("didInsertElement"),
    watchEvents: function() {
        var model = this.get('model');
        var that = this;
        this.$('#solution').on('keydown', this.setTrialStateToTyping.bind(this));
        this.$('.description .panel-body').on('scroll', function () {
            that.setActiveInterface('description', 'scroll');
        });
        this.$('.description .panel-body').on('mousemove', function () {
            that.setActiveInterface('description', 'mousemove');
        });
        // model.addObserver('work.solution', this, );
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
        clearTimeout(this.idleStateTimer);
    }.on("willClearRender"),
    endTrialSession: function() {
        var model = this.get('model');
        this.sessionEndTime = _.now();
        this.sessionTime['total'] =  this.sessionStartTime - this.sessionEndTime,
        this.setTrialState('end', {
            action:'end',
            event: 'trial.session.end',
            resolveNow: true,
            meta: {
                startTime: this.sessionStartTime,
                endTime: this.sessionEndTime,
                sessionTime: this.sessionTime,
                sessionCount: this.sessionCount,
                isComplete: model.get('complete')
            }
        });
        clearTimeout(this.idleStateTimer);
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
                    verb: 'ran',
                }, event);
                break;
            case 'debug':
                event = _.merge({
                    event: 'trial.solution.debug',
                    action: 'debug',
                    verb: 'debuged',
                }, event);
                break;
            case 'test':
                event = _.merge({
                    event: 'trial.solution.test',
                    action: 'test',
                    verb: 'tested',
                }, event);
                break;
            case 'lookup':
                event = _.merge({
                    event: 'trial.lookup',
                    action: 'lookup',
                    verb: 'lookedup',
                }, event);
                break;
            default:
                event = _.merge({
                    event: 'trial.log',
                    action: 'log',
                }, event);
                event.verb = event.action + 'ed';
        }
        return event;
    }, 
    setTrialStateSpentTime() {
        var startTime = this.trialStateEvent.meta.startTime;
        var endTime = this.trialStateEvent.meta.endTime;
        var sessionTime = startTime - endTime;
        this.sessionTime[this.trialState] += sessionTime;
    },
    incrementSessionCountFor(state) {
        this.sessionCount[state] = this.getSessionCountFor(state) + 1;
        return this.sessionCount[state];
    },
    getSessionCountFor(state) {
        return this.sessionCount[state] || 0;
    },
});
