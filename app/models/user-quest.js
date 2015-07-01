import DS from 'ember-data';

var attr = DS.attr;
export default DS.Model.extend({
    name: attr('string'),
    description: attr('string'),
    rp: attr('number'),
    requirements: attr('questRequirement'),
    complete:attr('boolean'),
    hash:function () {
        return '#'+this.get('id');
    }.property('id'),
    quest: DS.belongsTo('Quest', {
        async: true,
        inverse: 'userQuests'
    }),
    user: DS.belongsTo('User', {
        async: true,
        inverse: 'userQuests'
    })
});