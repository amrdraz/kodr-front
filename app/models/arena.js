import DS from 'ember-data';
var _ = window._;
var attr = DS.attr;

export default DS.Model.extend({
    name: attr('string', {
        defaultValue: "Still Loading"
    }),
    description: attr('string', {
        defaultValue: "Isn't life a beautifule thing"
    }),
    flow: attr('string', {
        defaultValue: "sequencial"
    }),
    flowType: ['any', 'sequencial'],
    isPublished: attr('boolean', {defaultValue:false}),
    challenges: DS.hasMany('challenge', {async:true, inverse: 'arena'}),
    trials: DS.hasMany('trial', {async:true, inverse: 'arena'}),
    users: DS.hasMany('userArena', {async:true, inverse: 'arena'}),
    author: DS.belongsTo('user', {async:true, inverse:'arenas'}),

    canSave: function() {
        return !this.get('isSaving') && this.get('hasDirtyAttributes') || this.get('isNew');
    }.property('hasDirtyAttributes'),
    canReset: function() {
        return !this.get('isSaving') && this.get('hasDirtyAttributes') && !this.get('isNew');
    }.property('hasDirtyAttributes'),
    canPublish: function() {
        return !this.get('hasDirtyAttributes') && !this.get('isPublished');
    }.property('hasDirtyAttributes', 'isPublished'),

    getJson: function() {
        var v, ret = [];
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                v = this[key];
                if (v === 'toString') {
                    continue;
                } // ignore useless items
                if (Ember.typeOf(v) === 'function') {
                    continue;
                }
                ret.push(key);
            }
        }
        return this.getProperties.apply(this, ret);
    }
});
