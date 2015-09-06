import Ember from 'ember';

var ArenaTryController = Ember.Controller.extend({
    breadCrumb:'arenas',
    breadCrumbPath:'arenas',
    init: function() {
        this._super();
    },
    currentTrial:function () {
        return this.get('model.trials.firstObject');
    }.property('arena.challenges.[]'),
    actions: {
    }
});

export default ArenaTryController;
