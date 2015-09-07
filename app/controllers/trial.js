import Ember from 'ember';

export default Ember.Controller.extend({
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
    test: function(report) {
        var model = this.get('model');
        model.set('report', report);
        model.set('complete', report.passed);
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
        run() {
           // Happens in challenge component
        },
        test(report){
            this.test(report);
        },
        rest() {
            var model = this.get('model');
            model.set('code', model.get('challenge.setup'));
        }
    }
});
