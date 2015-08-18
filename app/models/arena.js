import DS from 'ember-data';

var attr = DS.attr;

export default DS.Model.extend({
    name: attr('string', {
        defaultValue: "New Arena"
    }),
    description: attr('string', {
        defaultValue: "A new Arena"
    }),
    fllow: attr('string', {
        defaultValue: "any"
    }),
    fllowType: ['any', 'sequencial'],
    isPublished: attr('boolean', {defaultValue:false}),
    challenges: DS.hasMany('challenge', {async:true, inverse: 'arena'}),
    trials: DS.hasMany('trial', {async:true, inverse: 'arena'}),
    users: DS.hasMany('arenaTrial', {async:true, inverse: 'arena'}),
    author: DS.belongsTo('user', {async:true, inverse:'arenas'}),


    canSave: function() {
        return !this.get('isSaving') && this.get('hasDirtyAttributes') || this.get('isNew');
    }.property('hasDirtyAttributes'),
    canReset: function() {
        return !this.get('isSaving') && this.get('hasDirtyAttributes') && !this.get('isNew');
    }.property('hasDirtyAttributes'),
    canPublish: function() {
        return !this.get('hasDirtyAttributes') && !this.get('isPublished');
    }.property('hasDirtyAttributes', 'isPublished')
});
