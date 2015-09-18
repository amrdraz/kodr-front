import DS from 'ember-data';

var attr = DS.attr;
export default DS.Model.extend({
    exp: attr('number'),
    completed: attr('number'),
    user:DS.belongsTo('user', {inverse: 'userArenas', async:true}),
    arena:DS.belongsTo('arena', {inverse: 'users', async:true}),
    trials: DS.hasMany('trials', {inverse: 'userArena', async:true}),
});
