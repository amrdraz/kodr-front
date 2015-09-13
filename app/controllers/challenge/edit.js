import debounce from 'kodr/utils/debounce';
import Ember from 'ember';
var toastr = window.toastr;


export default Ember.Controller.extend({
    needs: ['challenge', 'arena', 'application'],
    arena: Ember.computed.alias("controllers.arena"),
    breadCrumb: 'edit',
    breadCrumbPath: 'arena.edit',
    evaluates: 'solution',
    // queryParams: ['arena'],
    // originalArena: null,
    init: function() {
        this._super();
    },
    isNew: function () {
        var path = this.container.lookup('controller:application').get('currentPath').split('.');
        return path.contains('create') || path.contains('copy');
    },
    unPublish: function() {
        if (this.get('model.isPublished')) {
            this.set('model.isPublished', false);
        }
    },
    publish: function() {
        if (this.get('intentToPublish')) {
            this.set('intentToPublish', false);
            this.set('model.isPublished', true);
        }
    },
    test: function(report) {
        var model = this.get('model');
        var result = report.passed;
        // console.log(report);
        if(report.score < model.get('exp')) {
            this.EventBus.publish('console.write','Awarded ('+report.score+"/"+model.get('exp')+') - Solution to challenge should reach maximum score tests','error');
            result = false;
        }

        model.set('valid', result);
        if (result) {
            this.publish();
            toastr.success('All Clear' + (this.get('model.isPublished') ? '' : ' you can now publish'));
        } else {
            toastr.error('Tests didn\'t pass check console');
            this.unPublish();
        }
        this.save();
    },
    valueWillChange: function(obj, key){
        this['changing'+key] = obj.get(key);
        // console.log('changing',key, obj.get(key));
    }.observesBefore('model.solution', 'model.setup', 'model.tests'),
    invalidate: function (obj, key) {
        // console.log('to',key, obj.get(key));
        var change  = this['changing'+key] === obj.get(key);
        this.set('model.valid', change && this.get('model.valid'));
    }.observes('model.solution', 'model.setup', 'model.tests'),
    save: function() {
        var model = this.get('model');
        var that = this;
        if (this.isNew()) {
            return model.save().then(function(ch) {
                that.transitionToRoute('challenge.edit', ch);
            }, function(xhr) {
                console.error(xhr.message);
                toastr.error(xhr.message);
            });
        } else {
            return model.save();
        }
    },
    actions: {
        run: debounce(function() {
            // var controller = this;
            // var model = controller.get('model');
            
        }),
        test(report) {
            this.test(report);
        },
        validate: function() {
            var controller = this;
            controller.EventBus.publish('challenge.test');
        },
        reset: function() {
            if(this.get('model.canReset')) { this.get('model').rollback();}
        },
        save: function() {
            var model = this.get('model');
            if (model.get('canSave')) {
                if (model.get('isPublished')) {
                    this.send('validate');
                    return false;
                }
                this.save();
            }
        },
        delete: function() {
            var arena = this.get('arena');
            this.get('model').destroyRecord();
            if (arena) {
                this.transitionToRoute('arena.edit');
            } else {
                this.transitionToRoute('challenges');
            }
        },
        publish: function() {
            var model = this.get('model');
            if (!model.get('isPublished')) {
                this.set('intentToPublish', true);
                if (model.get('valid')) {
                    this.publish();
                    model.save().then(function() {
                        console.log('published');
                    }).catch(function(err) {
                        console.log(err.stack);
                    });
                } else {
                    this.send('validate');
                }
            }
        },
        unPublish: function() {
            this.set('model.isPublished', false);
            this.save().then(function() {
                console.log('unPublished');
            });
        }
    }
});
