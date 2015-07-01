import DS from 'ember-data';

var attr = DS.attr;
export default DS.Model.extend({
    exp: attr('number'),
    completed: attr('number'),
    user:DS.belongsTo('user', {inverse: 'arenasTried'}),
    arena:DS.belongsTo('arena', {inverse: 'users'}),
    trials: DS.hasMany('trials', {inverse: 'arenaTrial'}),
});
