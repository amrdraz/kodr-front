import DS from 'ember-data';
import Requirement from 'kodr/models/requirement';

 export default DS.Model.extend({
    name: DS.attr('string', {
        defaultValue: "new Quest"
    }),
    description: DS.attr('string'),
    rp: DS.attr('number'),
    requirements: DS.attr('questRequirement', {defaultValue: []}),
    userQuests: DS.hasMany('userQuest', {
        async: true,
        inverse: 'quest'
    }),
    isPublished:DS.attr('boolean', {defaultValue:false}),
    users: function () {
        return this.get('userQuests').getEach('user');
    }.property('userQuests.[].relationshipsLoaded'),

    canSave: function() {
        return this.get('isNew') || (!this.get('isSaving') && this.get('hasDirtyAttributes') && !this.get('isPublished'));
    }.property('hasDirtyAttributes', 'isPublished'),
    canReset: function() {
        return !this.get('isSaving') && this.get('hasDirtyAttributes') && !this.get('isNew');
    }.property('hasDirtyAttributes'),
    canPublish: function() {
        return !this.get('canSave')&& !this.get('isPublished');
    }.property('canSave')
    // usersOptions: function() {
    //     var store = this.store;
    //     var dfd = DS.PromiseArray.create({
    //         promise: Ember.$.getJSON('api/quests/' + this.get('id') + '/usersOptions').then(function(response) {
    //             return response.map(function(record) {
    //                 record.id = record._id;
    //                 return store.push('user', record);
    //             });
    //         })
    //     });
    //     return dfd;
    // }.property('users.[]')
});
