import Ember from 'ember';
import Requirement from 'kodr/models/requirement';

export default Ember.Controller.extend({
    breadCrumb: 'quest',
    breadCrumbPath: 'quest',
    // needs: ['quest'],
    init: function() {
        this._super();
    },
    challenges: function() {
        return this.get('store').findAll('challenge');
    }.property(),
    arenas: function() {
        return this.get('store').findAll('arena');
    }.property(),
    requirementsChanged:false,
    shouldSave:function () {
        return this.get('requirementsChanged') || this.get('model.canSave');
    }.property('requirementsChanged' ,'canSave'),
    actions: {
        save: function() {
            var that = this;
            this.get('model').save().then(function(g) {
                that.set('requirementsChanged', false);
                if (this.container.lookup('controller:application').get('currentPath').split('.').contains('create')) {
                    that.transitionToRoute('quest.edit', g);
                }
            }).catch(function(xhr) {
                that.set('errorMessage', xhr.responseText);
            });
        },
        delete: function() {
            if(confirm('Are you sure you want to delete this quest?')) {
                var newModel = this.get('model.isNew');
                this.get('model').destroyRecord();
                if (!newModel) {
                    this.get('model').save();
                }
                this.transitionToRoute('quests');
            }
        },
        publish:function () {
          if(this.get('model.canPublish')&&confirm('if you publish you can no longer change the value of this quest')) {
            this.set('model.isPublished', true);
            this.get('model').save();
          }  
        },
        add: function() {
            this.set('requirementsChanged', true);
            this.get('model.requirements').addObject(Requirement.create({
                model1: 'Challenge',
                id1: null,
                times: 1,
                model2: 'Arena',
                id2: null,
            }));
        },
        requirementChanged() {
            this.set('requirementsChanged', true);
        },
        removeReq: function(req) {
            this.get('model.requirements').removeObject(req);
        }
    }
});

