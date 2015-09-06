import Ember from 'ember';
import debounce from 'kodr/utils/debounce';
import ChallengeMixin from 'kodr/mixins/challenge';
import Runner from 'kodr/runners/runner';
import iframeTemplate from 'kodr/demo/iframe';

export default Ember.Controller.extend(ChallengeMixin, {
    isChallengeTrial: function() {
        return this.container.lookup('controller:application').get('currentPath').split('.').contains('challenge');
    }.property('currentPath'),

    breadCrumb: function() {
        return this.get('isChallengeTrial') ? 'edit' : 'arena';
    }.property('isChallengeTrial'),
    breadCrumbPath: function() {
        return this.get('isChallengeTrial') ? 'arena.edit' : 'arenaTrial';
    }.property('isChallengeTrial'),
    needs: ['challenge'],
    //
    init: function() {
        this._super();
    },
    // returns true if dirty but unsaved, so that mock trials show complete instead of resubmit
    isDirtyish: function() {
        return this.get('model.hasDirtyAttributes') && !this.get('model.isNew');
    }.property('model.hasDirtyAttributes', 'model.isNew'),
    
    testError: function (errors) {
        var model = this.get('model');
        model.set('report', {
            errors: errors
        });
        model.set('complete', this._super(errors));
        this.save();
    },
    testSuccess: function(report) {
        var model = this.get('model');
        var that = this;
        var complete = this._super(report);
        model.set('report', report);
        model.set('complete', complete);
        this.save(function (model) {
            if(model.get('completed')===1) {
                swal("+"+model.get('exp')+" EXP", "For completeing this challenge", "success");
            }
        });
    },
    save: function(cb) {
        var model = this.get('model');
        if (!this.get('isChallengeTrial')) {
            return model.save().then(cb);
        } else {
            if(model.get('complete')){
                swal("Great Job", "You could have earned "+model.get('challenge.exp')+" EXP if you where logged in", "success");
            } else {
                toastr.info('You meight want to change those failures in your code, check the console');
            }
        }
    },
    actions: {
        run:function () {
            var model = this.get('model');
            var challenge = this.get('model.challenge');
            var controller = this;
            if(challenge.get('isJS')) {
                controller.send('runInConsole');
            } else {
                controller.EventBus.publish('console.show');
                controller.EventBus.publish('console.write', 'Compiling...\n');
                controller.runInServer(model.get('code'), challenge,function (res) {
                    controller.EventBus.publish('console.write', 'Compiled\n',res.sterr?'error':'result');
                    if(res.sterr){
                        controller.EventBus.publish('console.write', res.sterr,'error');
                        controller.EventBus.publish('lintCode', 'code',controller.parseSterr(res.sterr));
                    } else {
                        controller.EventBus.publish('console.write', res.stout+ '\n');
                        controller.EventBus.publish('lintCode', 'code',[]);
                    }
                });
            }
        },
        rest:function () {
            var model = this.get('model');
            model.set('code', model.get('challenge.setup'));
        },
        test: debounce(function() {
            var model = this.get('model');
            var challenge = this.get('model.challenge');
            var controller = this;
            if(challenge.get('isJS')) {
                var sb = controller.get('sandbox');
                controller.jshint(model.get('code'), function(code, jconsole, sb) {
                    sb.load(iframeTemplate, function() {
                        sb.evaljs(Runner.test(code, challenge.get('tests')));
                    });
                }, {
                    sandbox: sb,
                    run: true
                });
            } else {
                controller.EventBus.publish('console.show');
                controller.EventBus.publish('console.write', 'Running Tests...\n');
                controller.testInServer(model.get('code'), challenge,function (res) {
                    controller.EventBus.publish('console.write', 'Compiled\n',res.sterr?'error':'result');
                    if(res.sterr){
                        controller.EventBus.publish('console.write', res.sterr,'error');
                        controller.EventBus.publish('lintCode', 'code',controller.parseSterr(res.sterr));
                    } else {
                        controller.testSuccess(res.report);
                        controller.EventBus.publish('lintCode', 'code',[]);
                    }
                });
            }
        })
    }
});
