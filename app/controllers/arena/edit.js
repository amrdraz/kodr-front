import Ember from 'ember';
var toastr = window.toastr;

export default Ember.Controller.extend({
    breadCrumb: 'arena',
    breadCrumbPath: 'arena',
    needs: ['arena'],
    isCreating: function() {
        return this.container.lookup('controller:application').get('currentPath').split('.').contains('create');
    }.property('currentPath'),
    canPublish: function() {
        return this.get('model.canPublish') && this.get('model.challenges').filterBy('isPublished', true).get('length') >= 1;
    }.property('model.challenges.[].isPublished'),
    challenges: function() {
        return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
            sortProperties: ['order'],
            content: this.get('model.challenges')
        });
    }.property('model.challenges'),
    actions: {
        reset: function() {
            this.get('model').rollback();
        },
        save: function() {
            var that = this;
            var model = this.get('model');
            model.save().then(function(arena) {
                if (that.get('isCreating')) {
                    that.transitionToRoute('arena.edit', arena.id);
                }
            }).catch(function(xhr) {
                console.error(xhr.message);
                toastr.error(xhr.message);
            });
        },
        delete: function() {
            var newModel = this.get('model.isNew');
            this.get('model').destroyRecord();
            if (!newModel) {
                this.get('model').save();
            }
            this.transitionToRoute('arenas');
        },
        publish: function() {
            var model = this.get('model');
            if (this.get('canPublish')) {
                this.set('model.isPublished', true);
                this.get('model').save().then(function(ch) {
                    console.log('published');
                });
            } else {
                toastr.info('You can not publish an Arena without having at least one published challenge');
            }
        },
        unPublish: function() {
            this.set('model.isPublished', false);
            this.get('model').save().then(function(ch) {
                console.log('unPublished');
            });
        },
        add: function() {
            this.transitionToRoute('challenges.create', {
                queryParams: {
                    arena: this.get('model')
                }
            });
        },
        removeChallenge: function(challenge) {
            if (confirm('Are you sure you want to remove this challenge?')) {
                challenge.deleteRecord();
                challenge.save();

            }
        },
        moveChallengeUp: function(challenge) {
            var challenge2;
            var index = this.get('challenges').indexOf(challenge);
            if(index > 0 && index < this.get('challenges.length')) {
                challenge2 = this.get('challenges').objectAt(index-1);
                challenge.set("order", challenge.get('order')-1);
                challenge2.set("order", challenge2.get('order')+1);
                challenge.save();
                challenge2.save();
            }
        },
        moveChallengeDown: function(challenge) {
            var challenge2;
            var index = this.get('challenges').indexOf(challenge);
            if(index > -1 && index < this.get('challenges.length') - 1) {
                challenge2 = this.get('challenges').objectAt(index+1);
                challenge.set("order", challenge.get('order')+1);
                challenge2.set("order", challenge2.get('order')-1);
                challenge.save();
                challenge2.save();
            }
        }

    }
});