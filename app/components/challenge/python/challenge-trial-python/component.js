import Ember from 'ember';
import ChallengeCommon from 'kodr/mixins/challenge/python/challenge-common-python';
var _ = window._;
export default Ember.Component.extend(ChallengeCommon, {
    evaluatedModelProperty: 'solution',
    evaluatedModelObject: 'work',
    testEvent() {
        this.testCode({
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


    trialState: null,
    stateTimer: null,
    activeIntreface: 'description',
    getTrialState() {
        return {
            name: this.trialState,
            activeIntreface: this.activeIntreface
        };
    },
    /**
     * Change the current trialState forcing an event push to server
     * @param {String} trialState one of (typing, idle, run, debug, test, example, lookup)
     */
    setTrialState(trialState, event) {
        event = event || {};
        var model = this.get('model');
        var previous = this.get('trialState');
        if (previous !== trialState) {
            this.changingTrialState = true;
            if (previous !== null) {
                this.set('stateEndTime', _.now());
                var meta = {
                    trialState: this.getTrialState(),
                    startTime: this.stateStartTime,
                    endTime: this.stateEndTime,
                };

                switch (previous) {
                    case 'typing':
                        event = _.merge(event, {
                            event: 'trial.solution.change',
                            action: 'type',
                            verb: 'typed',
                            meta: _.merge({
                                solution: model.get('work.solution')
                            }, meta)
                        });
                        break;
                    case 'idle':
                        event = _.merge(event, {
                            event: 'trial.idle',
                            action: 'idle',
                            verb: 'idled',
                            meta: meta
                        });
                        break;
                    case 'example':
                        event = _.merge(event, {
                            event: 'trial.example.run',
                            action: 'run',
                            verb: 'ran',
                            meta: meta
                        });
                        break;
                    case 'run':
                        event = _.merge(event, {
                            event:'trial.solution.run',
                            action:'run',
                            ver:'ran',
                            meta: meta
                        });
                        break;
                    case 'debug':
                        event = _.merge(event, {
                            event:'trial.debug',
                            action:'debug',
                            ver:'debuged',
                            meta: meta
                        });
                        break;
                    case 'test':
                        event =  _.merge(event, {
                            event:'trial.test',
                            action:'debug',
                            ver:'debuged',
                            meta: meta
                        });
                        break;
                    case 'lookup':
                        event =  _.merge(event, {
                            event:'trial.lookup',
                            action:'lookup',
                            ver:'lookedup',
                            meta: meta
                        });
                        break;
                    default:
                        event =  _.merge(event, {
                            event:'trial.log',
                            action:'log',
                            verb:'logged',
                            meta: meta
                        });
                }

                this.handleTrialEvent(event);
            }
            this.stateStartTime = _.now();
            this.set('trialState', trialState);
            this.changingTrialState = false;
        }
        if(trialState!=='idle') {
            this.setTrialStateToIdle(event.instant);
        }
    },
    setTrialStateToIdle(instante) {
        if(instante===true || ((_.now() - this.stateStartTime) > 10000 && !this.changingTrialState)) {
            this.setTrialState('idle');
            return window.cancelAnimationFrame(this.stateTimer);
        }
        this.stateTimer = window.requestAnimationFrame(this.setTrialStateToIdle.bind(this));
    },
    setTrialStateToTyping() {
        this.setTrialState('typing');
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
            trial: this.get('model').serialize(),
        });
        this.container.lookup('socket:main').emit('trial.event', event);
    },
    updateActiveInterface(inter){
        if(this.get('activeIntreface')!==inter) {
            this.set('activeIntreface', inter);
            this.setTrialState('focus', {event:'tiral.tab.change', instant:true});
        }
    },
    watchEvents: function() {
        var component = this;
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

        if (!model.get('started')) {
            model.set('started', true);
            model.set('startTime', _.now());
            model.save(function (model) {
                component.setTrialState('start', {event:'trial.session.start', meta:{first:true, startTime:model.startTime}});
            });
        } else {
            this.setTrialState('start', {event:'trial.session.start', meta:{first:false}});
        }
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
        this.setTrialState('end', {event:'trial.session.end', instant:true, meta:{isComplete:model.get('complete')}});
        clearTimeout(this.stateTimer);
    }.on("willClearRender")
});
