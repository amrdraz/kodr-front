import DS from 'ember-data';

export default  DS.Model.extend({
    work: DS.attr('mixed'),
    blueprint: DS.attr('mixed'),
    input: DS.attr('string'),
    times: DS.attr('number'),
    exp: DS.attr('number'),
    order: DS.attr('number'),
    complete: DS.attr('boolean'),
    completed: DS.attr('number'),
    report:DS.attr(),
    challenge: DS.belongsTo('challenge', {async:true}),
    user: DS.belongsTo('user'),
    arena: DS.belongsTo('arena'),
    userArena: DS.belongsTo('userArena'),

    canSubmit: function () {
        return !this.get('complete') || this.get('hasDirtyAttributes');
    }.property('complete', 'hasDirtyAttributes'),
});
